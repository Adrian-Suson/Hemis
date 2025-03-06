<?php

use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\ProgramStatisticController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CampusController;

// Public routes
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('auth/reset-password', [AuthController::class, 'resetPassword']);


// Protected routes - Require Authentication
Route::middleware('auth:sanctum')->group(function () {
    // User Routes
    Route::apiResource('users', UserController::class);
    Route::post('users/{user}/reactivate', [UserController::class, 'reactivate']);

    // Authenticated User Routes
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/profile', [AuthController::class, 'profile']);

    // Institution Routes
    Route::apiResource('institutions', InstitutionController::class);
    // Campus Routes
    Route::apiResource('campuses', CampusController::class);

    // Program Routes
    Route::apiResource('programs', ProgramController::class);
    Route::get('programs/export/{category}', [ProgramController::class, 'export']);

    Route::apiResource('enrollments', EnrollmentController::class);
    Route::apiResource('program-statistics', ProgramStatisticController::class);


});
