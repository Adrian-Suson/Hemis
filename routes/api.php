<?php

use App\Http\Controllers\Api\EnrollmentController;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\ProgramStatisticController;
use App\Http\Controllers\Api\FacultyProfileController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CampusController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CurricularProgramController;
use App\Http\Controllers\Api\GraduateController;
use App\Http\Controllers\Api\StudentProfileController;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('auth/register', [AuthController::class, 'register']);
Route::post('auth/login', [AuthController::class, 'login']);
Route::post('auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('auth/reset-password', [AuthController::class, 'resetPassword']);

// Protected routes - Require Authentication
Route::middleware('auth:sanctum')->group(function () {
    // User Routes
    Route::apiResource('users', UserController::class); // Maps to index, show, store, update, destroy
    Route::post('users/{user}/reactivate', [UserController::class, 'reactivate']);

    // Authenticated User Routes
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/profile', [AuthController::class, 'profile']);

    // Institution Routes
    Route::apiResource('institutions', InstitutionController::class);

    // Campus Routes
    Route::apiResource('campuses', CampusController::class);

    // Program Routes
    Route::apiResource('programs', CurricularProgramController::class);
    Route::get('programs/export/{category}', [CurricularProgramController::class, 'export']);

    // Enrollment Routes
    Route::apiResource('enrollments', EnrollmentController::class);

    // Program Statistics Routes
    Route::apiResource('program-statistics', ProgramStatisticController::class);

    // Faculty Profile Routes
    Route::apiResource('faculty-profiles', FacultyProfileController::class);

    //graduate list
    Route::apiResource('graduates', GraduateController::class);
});
