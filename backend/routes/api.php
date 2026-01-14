<?php

use App\Http\Controllers\Api\Auth\EmailVerificationController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\PasswordResetController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\V1\BillingController;
use App\Http\Controllers\Api\V1\ConversationController;
use App\Http\Controllers\Api\V1\DesignController;
use App\Http\Controllers\Api\V1\InquiryController;
use App\Http\Controllers\Api\V1\InstagramAuthController;
use App\Http\Controllers\Api\V1\MessageController;
use App\Http\Controllers\Api\V1\MockupController;
use App\Http\Controllers\Api\V1\PaymentMethodController;
use App\Http\Controllers\Api\V1\PlanController;
use App\Http\Controllers\Api\V1\ProductCatalogController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\SavedSupplierController;
use App\Http\Controllers\Api\V1\SubscriptionController;
use App\Http\Controllers\Api\V1\SupplierCertificationController;
use App\Http\Controllers\Api\V1\SupplierController;
use App\Http\Controllers\Api\V1\SupplierSearchController;
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

        /*
        |--------------------------------------------------------------------------
        | Supplier Directory Routes (Public for authenticated users)
        |--------------------------------------------------------------------------
        */
        Route::get('/suppliers', [SupplierSearchController::class, 'index'])
            ->name('suppliers.index');
        Route::get('/suppliers/featured', [SupplierSearchController::class, 'featured'])
            ->name('suppliers.featured');
        Route::get('/suppliers/recommendations', [SupplierSearchController::class, 'recommendations'])
            ->name('suppliers.recommendations');
        Route::get('/suppliers/{supplier}', [SupplierController::class, 'show'])
            ->name('suppliers.show');
        Route::post('/suppliers/{supplier}/view', [SupplierController::class, 'recordView'])
            ->name('suppliers.view');
        Route::get('/suppliers/{supplier}/catalog', [ProductCatalogController::class, 'index'])
            ->name('suppliers.catalog');
        Route::get('/suppliers/{supplier}/saved-check', [SavedSupplierController::class, 'check'])
            ->name('suppliers.saved-check');

        /*
        |--------------------------------------------------------------------------
        | Saved Suppliers Routes (Designer only)
        |--------------------------------------------------------------------------
        */
        Route::get('/saved-suppliers', [SavedSupplierController::class, 'index'])
            ->name('saved-suppliers.index');
        Route::post('/suppliers/{supplier}/save', [SavedSupplierController::class, 'store'])
            ->name('suppliers.save');
        Route::delete('/suppliers/{supplier}/save', [SavedSupplierController::class, 'destroy'])
            ->name('suppliers.unsave');

        /*
        |--------------------------------------------------------------------------
        | Supplier Profile Management Routes (Supplier only)
        |--------------------------------------------------------------------------
        */
        Route::prefix('supplier')->name('supplier.')->group(function () {
            // Profile
            Route::get('/profile', [SupplierController::class, 'profile'])
                ->name('profile.show');
            Route::put('/profile', [SupplierController::class, 'update'])
                ->name('profile.update');
            Route::post('/logo', [SupplierController::class, 'uploadLogo'])
                ->name('logo.upload');

            // Stats & Analytics
            Route::get('/stats', [SupplierController::class, 'stats'])
                ->name('stats');
            Route::get('/stats/views', [SupplierController::class, 'viewsTimeline'])
                ->name('stats.views');
            Route::get('/activity', [SupplierController::class, 'activity'])
                ->name('activity');

            // Certifications
            Route::get('/certifications', [SupplierCertificationController::class, 'index'])
                ->name('certifications.index');
            Route::post('/certifications', [SupplierCertificationController::class, 'store'])
                ->name('certifications.store');
            Route::delete('/certifications/{certification}', [SupplierCertificationController::class, 'destroy'])
                ->name('certifications.destroy');
            Route::post('/certifications/{certification}/verify', [SupplierCertificationController::class, 'requestVerification'])
                ->name('certifications.verify');

            // Product Catalog
            Route::get('/catalog', [ProductCatalogController::class, 'ownIndex'])
                ->name('catalog.index');
            Route::post('/catalog', [ProductCatalogController::class, 'store'])
                ->name('catalog.store');
            Route::put('/catalog/{item}', [ProductCatalogController::class, 'update'])
                ->name('catalog.update');
            Route::delete('/catalog/{item}', [ProductCatalogController::class, 'destroy'])
                ->name('catalog.destroy');
        });

        /*
        |--------------------------------------------------------------------------
        | Messaging Routes
        |--------------------------------------------------------------------------
        */
        // Conversations
        Route::get('/conversations', [ConversationController::class, 'index'])
            ->name('conversations.index');
        Route::post('/conversations', [ConversationController::class, 'store'])
            ->name('conversations.store');
        Route::get('/conversations/unread-count', [ConversationController::class, 'unreadCount'])
            ->name('conversations.unread-count');
        Route::get('/conversations/{conversation}', [ConversationController::class, 'show'])
            ->name('conversations.show');
        Route::post('/conversations/{conversation}/archive', [ConversationController::class, 'archive'])
            ->name('conversations.archive');

        // Messages
        Route::get('/conversations/{conversation}/messages', [MessageController::class, 'index'])
            ->name('conversations.messages.index');
        Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store'])
            ->name('conversations.messages.store');
        Route::post('/conversations/{conversation}/read', [MessageController::class, 'markRead'])
            ->name('conversations.read');
        Route::delete('/messages/{message}', [MessageController::class, 'destroy'])
            ->name('messages.destroy');

        // Inquiries (all authenticated users can view)
        Route::get('/inquiries', [InquiryController::class, 'index'])
            ->name('inquiries.index');
        Route::put('/inquiries/{inquiry}/status', [InquiryController::class, 'updateStatus'])
            ->name('inquiries.update-status');
        Route::get('/inquiries/stats', [InquiryController::class, 'stats'])
            ->name('inquiries.stats');

        /*
        |--------------------------------------------------------------------------
        | Subscription & Billing Routes
        |--------------------------------------------------------------------------
        */
        // Plans (public info for authenticated users)
        Route::get('/plans', [PlanController::class, 'index'])
            ->name('plans.index');
        Route::get('/plans/{plan:slug}', [PlanController::class, 'show'])
            ->name('plans.show');

        // Subscription Management
        Route::get('/subscription', [SubscriptionController::class, 'current'])
            ->name('subscription.current');
        Route::post('/subscription', [SubscriptionController::class, 'subscribe'])
            ->name('subscription.subscribe');
        Route::put('/subscription', [SubscriptionController::class, 'changePlan'])
            ->name('subscription.change-plan');
        Route::post('/subscription/cancel', [SubscriptionController::class, 'cancel'])
            ->name('subscription.cancel');
        Route::post('/subscription/resume', [SubscriptionController::class, 'resume'])
            ->name('subscription.resume');
        Route::get('/subscription/usage', [SubscriptionController::class, 'usage'])
            ->name('subscription.usage');

        // Payment Methods
        Route::get('/payment-methods', [PaymentMethodController::class, 'index'])
            ->name('payment-methods.index');
        Route::post('/payment-methods/setup-intent', [PaymentMethodController::class, 'setupIntent'])
            ->name('payment-methods.setup-intent');
        Route::post('/payment-methods', [PaymentMethodController::class, 'store'])
            ->name('payment-methods.store');
        Route::put('/payment-methods/default', [PaymentMethodController::class, 'setDefault'])
            ->name('payment-methods.set-default');
        Route::delete('/payment-methods/{id}', [PaymentMethodController::class, 'destroy'])
            ->name('payment-methods.destroy');

        // Billing & Invoices
        Route::get('/billing/invoices', [BillingController::class, 'invoices'])
            ->name('billing.invoices');
        Route::get('/billing/invoices/{id}/download', [BillingController::class, 'downloadInvoice'])
            ->name('billing.invoices.download');
        Route::get('/billing/upcoming', [BillingController::class, 'upcomingInvoice'])
            ->name('billing.upcoming');

        /*
        |--------------------------------------------------------------------------
        | Admin Routes (Admin/Super Admin only)
        |--------------------------------------------------------------------------
        */
        Route::prefix('admin')->middleware('role:admin,super_admin')->name('admin.')->group(function () {
            // Dashboard Stats
            Route::get('/stats', [\App\Http\Controllers\Api\Admin\AdminController::class, 'stats'])
                ->name('stats');
            Route::get('/signup-trends', [\App\Http\Controllers\Api\Admin\AdminController::class, 'signupTrends'])
                ->name('signup-trends');
            Route::get('/recent-activity', [\App\Http\Controllers\Api\Admin\AdminController::class, 'recentActivity'])
                ->name('recent-activity');

            // User Management
            Route::get('/users', [\App\Http\Controllers\Api\Admin\AdminController::class, 'users'])
                ->name('users.index');
            Route::get('/users/{user}', [\App\Http\Controllers\Api\Admin\AdminController::class, 'showUser'])
                ->name('users.show');
            Route::put('/users/{user}', [\App\Http\Controllers\Api\Admin\AdminController::class, 'updateUser'])
                ->name('users.update');
            Route::post('/users/{user}/suspend', [\App\Http\Controllers\Api\Admin\AdminController::class, 'suspendUser'])
                ->name('users.suspend');
            Route::post('/users/{user}/reactivate', [\App\Http\Controllers\Api\Admin\AdminController::class, 'reactivateUser'])
                ->name('users.reactivate');

            // Verification Management
            Route::get('/verifications', [\App\Http\Controllers\Api\Admin\VerificationController::class, 'index'])
                ->name('verifications.index');
            Route::get('/verifications/types', [\App\Http\Controllers\Api\Admin\VerificationController::class, 'types'])
                ->name('verifications.types');
            Route::get('/verifications/{certification}', [\App\Http\Controllers\Api\Admin\VerificationController::class, 'show'])
                ->name('verifications.show');
            Route::post('/verifications/{certification}/approve', [\App\Http\Controllers\Api\Admin\VerificationController::class, 'approve'])
                ->name('verifications.approve');
            Route::post('/verifications/{certification}/reject', [\App\Http\Controllers\Api\Admin\VerificationController::class, 'reject'])
                ->name('verifications.reject');

            // Audit Logs
            Route::get('/audit-logs', [\App\Http\Controllers\Api\Admin\AdminController::class, 'auditLogs'])
                ->name('audit-logs');

            // Subscription Management
            Route::get('/subscriptions', [\App\Http\Controllers\Api\Admin\AdminController::class, 'subscriptions'])
                ->name('subscriptions.index');
            Route::get('/subscriptions/{subscription}', [\App\Http\Controllers\Api\Admin\AdminController::class, 'showSubscription'])
                ->name('subscriptions.show');
            Route::post('/subscriptions/{subscription}/retry', [\App\Http\Controllers\Api\Admin\AdminController::class, 'retryPayment'])
                ->name('subscriptions.retry');
            Route::post('/invoices/{invoice}/refund', [\App\Http\Controllers\Api\Admin\AdminController::class, 'createRefund'])
                ->name('invoices.refund');

            // User Support
            Route::get('/users/{user}/communications', [\App\Http\Controllers\Api\Admin\AdminController::class, 'userCommunications'])
                ->name('users.communications');
        });
    });
});
