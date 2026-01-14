<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class LoginController extends Controller
{
    /**
     * Maximum number of failed attempts before lockout.
     */
    protected const MAX_ATTEMPTS = 5;

    /**
     * Lockout duration in minutes.
     */
    protected const LOCKOUT_MINUTES = 15;

    /**
     * Handle user login request.
     */
    public function __invoke(LoginRequest $request): JsonResponse
    {
        $email = $request->input('email');
        $lockoutKey = $this->getLockoutKey($email);
        $attemptsKey = $this->getAttemptsKey($email);

        // Check if account is locked out
        if ($this->isLockedOut($lockoutKey)) {
            $remainingMinutes = $this->getRemainingLockoutMinutes($lockoutKey);

            Log::channel('security')->warning('Login attempted on locked account', [
                'email' => $email,
                'ip' => $request->ip(),
                'remaining_minutes' => $remainingMinutes,
            ]);

            throw ValidationException::withMessages([
                'email' => ["Too many failed login attempts. Please try again in {$remainingMinutes} minute(s)."],
            ]);
        }

        $credentials = $request->only('email', 'password');

        if (! Auth::attempt($credentials)) {
            $this->incrementAttempts($attemptsKey, $lockoutKey, $email, $request->ip());

            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Clear failed attempts on successful login
        $this->clearAttempts($attemptsKey);

        $user = Auth::user();

        // Check if user is active
        if (! $user->is_active) {
            Auth::logout();

            Log::channel('security')->warning('Login attempted on deactivated account', [
                'user_id' => $user->id,
                'email' => $email,
                'ip' => $request->ip(),
            ]);

            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated. Please contact support.'],
            ]);
        }

        // Update last login timestamp
        $user->update(['last_login_at' => now()]);

        // Regenerate session for security
        $request->session()->regenerate();

        Log::channel('security')->info('Successful login', [
            'user_id' => $user->id,
            'email' => $email,
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'user' => $user->load('profile'),
            'message' => 'Login successful.',
        ]);
    }

    /**
     * Get the cache key for lockout status.
     */
    protected function getLockoutKey(string $email): string
    {
        return 'login_lockout:'.strtolower($email);
    }

    /**
     * Get the cache key for failed attempts count.
     */
    protected function getAttemptsKey(string $email): string
    {
        return 'login_attempts:'.strtolower($email);
    }

    /**
     * Check if the account is locked out.
     */
    protected function isLockedOut(string $lockoutKey): bool
    {
        return Cache::has($lockoutKey);
    }

    /**
     * Get remaining lockout time in minutes.
     */
    protected function getRemainingLockoutMinutes(string $lockoutKey): int
    {
        $lockoutUntil = Cache::get($lockoutKey);

        if (! $lockoutUntil) {
            return 0;
        }

        return max(1, (int) ceil(($lockoutUntil - now()->timestamp) / 60));
    }

    /**
     * Increment failed attempts and lock account if threshold reached.
     */
    protected function incrementAttempts(string $attemptsKey, string $lockoutKey, string $email, string $ip): void
    {
        $attempts = Cache::increment($attemptsKey);

        // Set expiry on first attempt
        if ($attempts === 1) {
            Cache::put($attemptsKey, 1, now()->addMinutes(self::LOCKOUT_MINUTES));
        }

        Log::channel('security')->warning('Failed login attempt', [
            'email' => $email,
            'ip' => $ip,
            'attempt_number' => $attempts,
        ]);

        // Lock account if max attempts reached
        if ($attempts >= self::MAX_ATTEMPTS) {
            $lockoutUntil = now()->addMinutes(self::LOCKOUT_MINUTES)->timestamp;
            Cache::put($lockoutKey, $lockoutUntil, now()->addMinutes(self::LOCKOUT_MINUTES));

            Log::channel('security')->alert('Account locked due to failed login attempts', [
                'email' => $email,
                'ip' => $ip,
                'lockout_minutes' => self::LOCKOUT_MINUTES,
            ]);
        }
    }

    /**
     * Clear failed attempts counter.
     */
    protected function clearAttempts(string $attemptsKey): void
    {
        Cache::forget($attemptsKey);
    }
}
