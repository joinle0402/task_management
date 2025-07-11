<?php

use App\Models\RefreshToken;
use App\Models\User;
use App\Models\VerificationCode;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use \Illuminate\Support\Facades\Schedule;
use Laravel\Sanctum\PersonalAccessToken;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('cleanup', function () {
    $count = RefreshToken::query()->where('expired_at', '<', now())->delete();
    $this->info("Deleted {$count} expired tokens.");
    $count = PersonalAccessToken::query()->where('expires_at', '<', now())->delete();
    $this->info("Deleted {$count} expired access tokens.");
    $count = User::whereNull('email_verified_at')->where('created_at', '<', now()->subHours(24))->delete();
    $this->info("Deleted {$count} expired user not verified.");
    $count = VerificationCode::where('expired_at', '<', now())->delete();
    $this->info("Deleted {$count} expired verification codes.");
})->purpose('Clean up expired token and unverified user.');

Schedule::call(function () {
    $count = RefreshToken::query()->where('expired_at', '<', now())->delete();
    $this->info("Deleted {$count} expired tokens.");
    $count = PersonalAccessToken::query()->where('expires_at', '<', now())->delete();
    $this->info("Deleted {$count} expired access tokens.");
    $count = User::whereNull('email_verified_at')->where('created_at', '<', now()->subHours(24))->delete();
    $this->info("Deleted {$count} expired user not verified.");
    $count = VerificationCode::where('expired_at', '<', now())->delete();
    $this->info("Deleted {$count} expired verification codes.");
})->daily();
