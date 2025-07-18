<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

Route::prefix('/v1')->group(function () {
    Route::prefix('/auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/verify-email', [AuthController::class, 'verifyEmail']);
        Route::post('/verify-email/resend', [AuthController::class, 'resendOtp'])->middleware('throttle:1,1');
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/refresh-token', [AuthController::class, 'refreshToken']);

        Route::get('/{provider}/redirect', [AuthController::class, 'redirectToProvider'])->middleware('throttle:10,1');
        Route::get('/{provider}/callback', [AuthController::class, 'handleProviderCallback']);

        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/forgot-password/resend', [AuthController::class, 'resendForgotPassword']);
        Route::post('/forgot-password/verify', [AuthController::class, 'verifyForgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);

        Route::middleware(['auth:sanctum'])->group(function () {
            Route::get('/profile', [AuthController::class, 'profile']);
            Route::get('/verification-status', [AuthController::class, 'verificationStatus']);
        });

        Route::middleware(['auth:sanctum', 'verified'])->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
        });
    });
    Route::middleware(['auth:sanctum', 'verified'])->group(function() {
        Route::get('/users/export', [UserController::class, 'export']);
        Route::apiResource('users', UserController::class);
    });
});



