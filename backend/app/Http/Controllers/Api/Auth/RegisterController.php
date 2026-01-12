<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    /**
     * Handle user registration request.
     */
    public function __invoke(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        // Assign role using Spatie Permission
        $user->assignRole($request->role);

        // Fire registered event (sends verification email)
        event(new Registered($user));

        // Log the user in
        Auth::login($user);

        // Regenerate session for security
        $request->session()->regenerate();

        return response()->json([
            'user' => $user,
            'message' => 'Registration successful. Please check your email to verify your account.',
        ], 201);
    }
}
