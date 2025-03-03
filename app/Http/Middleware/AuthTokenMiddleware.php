<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\User;
use Symfony\Component\HttpFoundation\Response;

class AuthTokenMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken(); // Get the token from Authorization header

        if (!$token) {
            return response()->json(['message' => 'Unauthorized. No token provided.'], 401);
        }

        // Find the user by token
        $user = User::whereHas('tokens', function ($query) use ($token) {
            $query->where('token', hash('sha256', $token));
        })->first();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized. Invalid token.'], 401);
        }

        // Set the authenticated user
        $request->setUserResolver(fn() => $user);

        return $next($request);
    }
}
