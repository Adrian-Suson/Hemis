<?php

use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\InstitutionController;
use App\Http\Controllers\Api\FacultyProfileController;
use App\Http\Controllers\Api\CampusController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CurricularProgramController;
use App\Http\Controllers\Api\GraduateController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\HEIDashboardController;
use App\Http\Controllers\Api\InstitutionManagementController;
use App\Http\Controllers\Api\ReportYearController; // Add this line
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

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
    Route::apiResource('curricular_programs', CurricularProgramController::class);

    // Faculty Profile Routes
    Route::apiResource('faculty-profiles', FacultyProfileController::class);

    // Graduate List Routes
    Route::apiResource('graduates', GraduateController::class);

    // Report Year Routes
    Route::apiResource('report-years', ReportYearController::class); // Add this line

    // Activity Log Routes
    Route::get('/activity-logs', [ActivityLogController::class, 'index']);
    Route::post('/activity-logs', [ActivityLogController::class, 'store']);

    // Region, Province, Municipality API Resource Routes
    Route::apiResource('regions', \App\Http\Controllers\Api\RegionController::class);
    Route::apiResource('provinces', \App\Http\Controllers\Api\ProvinceController::class);
    Route::apiResource('municipalities', \App\Http\Controllers\Api\MunicipalityController::class);

    // Dashboard Data Route
    Route::get('dashboard-data', [DashboardController::class, 'getDashboardData']); // Updated to handle report_year
    Route::get('hei-dashboard-data', [HEIDashboardController::class, 'getDashboardData']); // Updated to handle report_year

    // Institution Management Data Route
    Route::get('institution-management-data', [InstitutionManagementController::class, 'getInstitutionData']);
});
