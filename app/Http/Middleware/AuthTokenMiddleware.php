<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Exception;

class AuthTokenMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        try {
            $authHeader = $request->header('Authorization');

            if (!$authHeader || !str_starts_with($authHeader, 'Bearer ')) {
                return response()->json(['error' => 'Unauthorized: Token missing'], 401);
            }

            $token = substr($authHeader, 7);
            $decoded = JWT::decode($token, new Key(env('JWT_SECRET'), 'HS256'));

            $request->attributes->set('userId', $decoded->user_id);

            return $next($request);
        } catch (Exception $e) {
            return response()->json(['error' => 'Unauthorized: Invalid token'], 401);
        }
    }
}
