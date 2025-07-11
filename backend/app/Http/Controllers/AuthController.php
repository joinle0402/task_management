<?php

namespace App\Http\Controllers;

use App\Enums\VerificationCodeType;
use App\Http\Requests\Auth\EmailRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\VerifyEmailRequest;
use App\Models\RefreshToken;
use App\Models\User;
use App\Models\VerificationCode;
use App\Notifications\VerificationCodeNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Throwable;

class AuthController extends Controller
{
    /**
     * @throws Throwable
     */
    public function register(RegisterRequest $request): JsonResponse|Response
    {
        $user = User::where('email', $request->email)->first();
        if (!empty($user) && $user->hasVerifiedEmail()) {
            throw ValidationException::withMessages(['email' => 'This email is already registered!']);
        }
        return DB::transaction(function () use ($request, $user) {
            $user = empty($user) ? User::create($request->validated()) : $user;
            $this->sendVerificationCode($user, VerificationCodeType::EMAIL_VERIFICATION, "Your verification code is: @otp", "Verify your email address");
            return $this->buildAuthenticationResponse('Verification code was sent to your email.', $user);
        });
    }

    /**
     * @throws ValidationException
     * @throws Throwable
     */
    public function verifyEmail(VerifyEmailRequest $request): JsonResponse
    {
        $user = User::whereEmail($request->validated('email'))->firstOrFail();
        $verificationCode = VerificationCode::where('user_id', $user->id)
            ->where('code', $request->validated('otp'))
            ->where('type', VerificationCodeType::EMAIL_VERIFICATION)
            ->where('expired_at', '>', now())
            ->first();
        if (empty($verificationCode)) {
            throw ValidationException::withMessages(['otp' => 'OTP is invalid or expired!']);
        }

        return DB::transaction(function () use ($user) {
            $user->email_verified_at = now();
            $user->save();
            VerificationCode::where('user_id', $user->id)->where('type', VerificationCodeType::EMAIL_VERIFICATION)->delete();
            return json_message('User verified successfully.');
        });
    }

    public function resendOtp(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $user = User::whereEmail($request->get('email'))->first();
        abort_if(empty($user), Response::HTTP_NOT_FOUND, "User not found!");
        abort_if($user->hasVerifiedEmail(), Response::HTTP_BAD_REQUEST, "Email already verified!");

        $verificationCode = $this->sendVerificationCode($user, VerificationCodeType::EMAIL_VERIFICATION, "Your verification code is @otp", "Verify your email address");
        return response()->json([
            'message' => 'Resend verification code sent to your email address.',
            'data' => ['expired_at' => $verificationCode->expired_at->toISOString()]
        ]);
    }

    /**
     * @throws ValidationException
     * @throws Throwable
     */
    public function login(LoginRequest $request): Response
    {
        $user = User::whereEmail($request->validated('email'))->first();
        abort_if(empty($user), Response::HTTP_UNAUTHORIZED, "Username or password is incorrect.");
        abort_if(empty(Hash::check($request->validated('password'), $user->password)), Response::HTTP_UNAUTHORIZED, "Username or password is incorrect.");
        return DB::transaction(function () use ($user) {
            return $this->buildAuthenticationResponse('Logged in successfully.', $user);
        });
    }

    /**
     * @throws Throwable
     */
    public function refreshToken(Request $request): Response
    {
        $refreshTokenCookie = $request->cookie('refresh_token');
        abort_if(empty($refreshTokenCookie), Response::HTTP_BAD_REQUEST, "Missing refresh token!");

        $refreshToken = RefreshToken::where('token', hash('sha256', $refreshTokenCookie))
            ->where('expired_at', '>', now())
            ->first();
        abort_if(empty($refreshToken), Response::HTTP_BAD_REQUEST, "Refresh token is invalid or expired!");

        return DB::transaction(function () use ($refreshToken) {
            $response = $this->buildAuthenticationResponse('Refresh token successfully!', $refreshToken->user);
            $refreshToken->delete();
            return $response;
        });
    }

    public function logout(Request $request): Response
    {
        $refreshTokenCookie = $request->cookie('refresh_token');
        if ($refreshTokenCookie) {
            RefreshToken::where('token', hash('sha256', $refreshTokenCookie))->delete();
        }
        $request->user()?->currentAccessToken()?->delete();
        return json_message('Logout successfully!')->withCookie('refresh_token');
    }

    public function profile(Request $request)
    {
        return $request->user();
    }

    public function forgotPassword(EmailRequest $request): JsonResponse
    {
        $user = User::whereEmail($request->email)->first();
        if (empty($user)) return json_message('Password reset code sent to your email address.');

        $verificationCode = $this->sendVerificationCode($user, VerificationCodeType::PASSWORD_RESET, "Your password reset code is @otp", "Password reset code");

        return response()->json([
            'message' => 'Password reset code sent to your email address.',
            'data' => [
                'expired_at' => $verificationCode->expired_at->toISOString(),
            ]
        ]);
    }

    public function resendForgotPassword(EmailRequest $request): JsonResponse
    {
        $user = User::whereEmail($request->email)->first();
        if (empty($user)) return json_message('Password reset code resent to your email address.');

        abort_if(!RateLimiter::attempt("resend-otp:".$user->id, 1, fn() => true), Response::HTTP_TOO_MANY_REQUESTS, "Please wait before requesting another code.");

        $this->sendVerificationCode($user, VerificationCodeType::PASSWORD_RESET, "Your password reset code is @otp", "Password reset code");
        return response()->json([
            'message' => 'OTP resent successfully.',
            'data' => ['expired_at' => now()->addMinutes(10)],
        ]);
    }

    public function verifyForgotPassword(VerifyEmailRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();
        abort_if(empty($user), Response::HTTP_NOT_FOUND, "Email is not exists!");

        $verificationCode = VerificationCode::where('user_id', $user->id)
            ->where('code', $request->validated('otp'))
            ->where('type', VerificationCodeType::PASSWORD_RESET)
            ->first();
        abort_if(empty($verificationCode), Response::HTTP_UNPROCESSABLE_ENTITY, "Invalid verification code.");
        abort_if(now()->greaterThan($verificationCode->expired_at), Response::HTTP_UNPROCESSABLE_ENTITY, "Verification code has expired.");

        $verificationCode->delete();
        $token = Str::uuid()->toString();
        Cache::put("forgot-password-token:$token", $user->id, now()->addMinutes(15));

        return response()->json([
            'message' => 'OTP verified. Proceed to reset your password.',
            'data' => ['token' => $token],
        ]);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $userId = Cache::pull('forgot-password-token:'.$request->token);
        abort_if(empty($userId), Response::HTTP_UNPROCESSABLE_ENTITY, "Invalid or expired token!");

        $user = User::find($userId);
        abort_if(empty($user), Response::HTTP_NOT_FOUND, "User not found!");

        if (Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['password' => 'New password must be different from the current password.']);
        }

        $user->update(['password' => $request->password]);

        return json_message('Password reset successfully.');
    }

    public function verificationStatus(Request $request): JsonResponse
    {
        $user = $request->user();
        $verification = VerificationCode::where('user_id', $user->id)->where('type', VerificationCodeType::EMAIL_VERIFICATION)->latest()->first();
        return response()->json([
            'email' => $user->email,
            'isVerified' => $user->hasVerifiedEmail(),
            'expiresAt' => optional($verification)->expired_at,
        ]);
    }

    private function buildAuthenticationResponse(string $message, User|BelongsTo $user): Response
    {
        $accessToken = $user->createToken('access_token', ['*'], now()->addMinutes(config('sanctum.expiration', 10)))->plainTextToken;
        $refreshTokenPlain = str()->random(60);
        RefreshToken::create(['user_id' => $user->id, 'token' => hash('sha256', $refreshTokenPlain), 'expired_at' => now()->addDays(7)]);
        cookie()->queue('refresh_token', $refreshTokenPlain, 10080, '/', null, true, true, false, 'Strict');
        return response([
            'message' => $message,
            'access_token' => $accessToken,
            'profile' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
            ],
        ]);
    }

    private function sendVerificationCode(User $user, VerificationCodeType $type, string $content, string $subject): VerificationCode
    {
        $otp = rand(100000, 999999);
        $verificationCode = VerificationCode::updateOrCreate(
            ['user_id' => $user->id, 'type' => $type],
            ['code' => $otp, 'expired_at' => now()->addMinutes(10)]
        );
        $user->notify(new VerificationCodeNotification($otp, $subject, $content, 10));
        return $verificationCode;
    }
}
