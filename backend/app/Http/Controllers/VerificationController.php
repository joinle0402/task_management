<?php

namespace App\Http\Controllers;

use App\Enums\VerificationCodeType;
use App\Models\VerificationCode;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function status(Request $request): JsonResponse
    {
        $user = $request->user();
        $verification = VerificationCode::where('user_id', $user->id)
            ->where('type', VerificationCodeType::EMAIL_VERIFICATION)
            ->latest()
            ->first();
        return response()->json([
            'email' => $user->email,
            'isVerified' => $user->hasVerifiedEmail(),
            'expiresAt' => optional($verification)->expired_at,
        ]);
    }
}
