<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::prefix('/v1')->group(function () {
    Route::prefix('/auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
        Route::post('/verify-email/resend', [AuthController::class, 'resendOtp'])->middleware('throttle:1,1');
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/refresh-token', [AuthController::class, 'refreshToken']);

        Route::post('/forgot-password', [AuthController::class, 'sendResetPasswordOtp']);
        Route::post('/reset-password', [AuthController::class, 'resetPasswordOtp']);

        Route::middleware(['auth:sanctum'])->group(function () {
            Route::get('/profile', [AuthController::class, 'profile']);
            Route::get('/verification-status', [AuthController::class, 'verificationStatus']);
        });

        Route::middleware(['auth:sanctum', 'verified'])->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });
});



