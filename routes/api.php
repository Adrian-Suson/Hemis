<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;

// Public routes
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('auth/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes - Require Authentication
Route::middleware('auth:sanctum')->group(function () {
    // User Management Routes
    Route::get('users', [UserController::class, 'index']); // List all users
    Route::get('users/{id}', [UserController::class, 'show']); // Get single user
    Route::put('users/{id}', [UserController::class, 'update']); // Update user
    Route::delete('users/{id}', [UserController::class, 'destroy']); // Delete user
    Route::post('users/{id}/reactivate', [UserController::class, 'reactivate']); // Reactivate user
    
    // Authenticated user routes
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/profile', [AuthController::class, 'profile']);
});
