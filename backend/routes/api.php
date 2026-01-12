<?php

use App\Http\Controllers\Api\Auth\EmailVerificationController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\PasswordResetController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\V1\DesignController;
use App\Http\Controllers\Api\V1\InstagramAuthController;
use App\Http\Controllers\Api\V1\MockupController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\ValidationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group.
|
*/

/*
|--------------------------------------------------------------------------
| Public Auth Routes (Rate Limited)
|--------------------------------------------------------------------------
*/
Route::post('/register', RegisterController::class)
    ->middleware('throttle:register')
    ->name('register');

Route::post('/login', LoginController::class)
    ->middleware('throttle:login')
    ->name('login');

Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword'])
    ->middleware('throttle:password-reset')
    ->name('password.email');

Route::post('/reset-password', [PasswordResetController::class, 'resetPassword'])
    ->middleware('throttle:password-reset')
    ->name('password.update');

/*
|--------------------------------------------------------------------------
| Protected Routes (Requires Authentication)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    // User
    Route::get('/user', function (Request $request) {
        return $request->user()->load('profile');
    })->name('user');

    // Logout
    Route::post('/logout', LogoutController::class)->name('logout');

    // Email Verification
    Route::post('/email/verification-notification', [EmailVerificationController::class, 'resend'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
        ->middleware('signed')
        ->name('verification.verify');

    /*
    |--------------------------------------------------------------------------
    | Profile Routes (V1 API)
    |--------------------------------------------------------------------------
    */
    Route::prefix('v1')->group(function () {
        // Profile management
        Route::get('/profile', [ProfileController::class, 'show'])->name('profile.show');
        Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::post('/profile/complete-onboarding', [ProfileController::class, 'completeOnboarding'])
            ->name('profile.complete-onboarding');
        Route::post('/profile/upload-image', [ProfileController::class, 'uploadImage'])
            ->name('profile.upload-image');
        Route::delete('/profile/image', [ProfileController::class, 'deleteImage'])
            ->name('profile.delete-image');

        // Design management
        Route::get('/designs-stats', [DesignController::class, 'stats'])->name('designs.stats');
        Route::apiResource('designs', DesignController::class);

        // AI Analysis & Variations
        Route::post('/designs/{design}/analyze', [DesignController::class, 'triggerAnalysis'])
            ->name('designs.analyze');
        Route::post('/designs/{design}/variations', [DesignController::class, 'generateVariations'])
            ->name('designs.variations.generate');
        Route::post('/designs/{design}/variations/regenerate', [DesignController::class, 'regenerateVariations'])
            ->name('designs.variations.regenerate');

        // Instagram Integration
        Route::prefix('instagram')->name('instagram.')->group(function () {
            Route::get('/auth', [InstagramAuthController::class, 'redirect'])->name('auth');
            Route::get('/callback', [InstagramAuthController::class, 'callback'])->name('callback');
            Route::get('/status', [InstagramAuthController::class, 'status'])->name('status');
            Route::delete('/disconnect', [InstagramAuthController::class, 'disconnect'])->name('disconnect');
            Route::post('/refresh', [InstagramAuthController::class, 'refresh'])->name('refresh');
        });

        // Mockups
        Route::post('/designs/{design}/mockups', [MockupController::class, 'store'])
            ->name('designs.mockups.store');
        Route::get('/designs/{design}/mockups', [MockupController::class, 'index'])
            ->name('designs.mockups.index');
        Route::get('/mockups/{mockup}', [MockupController::class, 'show'])
            ->name('mockups.show');
        Route::delete('/mockups/{mockup}', [MockupController::class, 'destroy'])
            ->name('mockups.destroy');

        // Validations
        Route::apiResource('validations', ValidationController::class)
            ->only(['index', 'store', 'show']);
        Route::post('/validations/{validation}/cancel', [ValidationController::class, 'cancel'])
            ->name('validations.cancel');
        Route::get('/validations/{validation}/metrics', [ValidationController::class, 'metrics'])
            ->name('validations.metrics');
    });
});
