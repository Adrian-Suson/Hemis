<?php

use App\Http\Controllers\Api\HeiController;
use App\Http\Controllers\Api\SucDetailsController;
use App\Http\Controllers\Api\LucDetailsController;
use App\Http\Controllers\Api\PrivateDetailsController;
use App\Http\Controllers\Api\SucFormBController;
use App\Http\Controllers\Api\SucFormE1Controller;
use App\Http\Controllers\Api\SucFormE2Controller;
use App\Http\Controllers\Api\SucNfResearchFormController;
use App\Http\Controllers\Api\SucPcrGraduateController;
use App\Http\Controllers\Api\LucFormBCController;
use App\Http\Controllers\Api\LucFormE5Controller;
use App\Http\Controllers\Api\LucPrcGraduateController;
use App\Http\Controllers\Api\LucDeanProfileController;
use App\Http\Controllers\Api\PrivateFormBCController;
use App\Http\Controllers\Api\PrivateFormE5Controller;
use App\Http\Controllers\Api\PrivatePrcGraduateController;
use App\Http\Controllers\Api\PrivateDeanProfileController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminUserController;
use App\Http\Controllers\Api\SucCampusController;
use App\Http\Controllers\Api\LocationController;
use Illuminate\Support\Facades\Route;

// Authentication Routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::get('/admin/users', [AdminUserController::class, 'index']);

    // Admin: View all users
    Route::get('/admin/users/{id}', [AdminUserController::class, 'show']);
    // Admin: View a specific user
    Route::put('/admin/users/{id}', [AdminUserController::class, 'update']);
    Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']);

    // HEI Routes
    Route::apiResource('/heis', HeiController::class);

    // SUC Details Routes
    Route::apiResource('/suc-details', SucDetailsController::class);
    // SUC Campus Routes
    Route::apiResource('/suc-campuses', SucCampusController::class);
    // SUC Form B Routes
    Route::apiResource('/suc-form-b', SucFormBController::class);
    Route::post('/suc-form-b/bulk', [SucFormBController::class, 'bulkStore']);
    
    // SUC Form E1 Routes
    Route::apiResource('/suc-form-e1', SucFormE1Controller::class);
    // SUC Form E2 Routes
    Route::apiResource('/suc-form-e2', SucFormE2Controller::class);
    // SUC Non-Faculty Research Form Routes
    Route::apiResource('/suc-nf-research-form', SucNfResearchFormController::class);
    // SUC PCR Graduate Routes
    Route::apiResource('/suc-pcr-graduate', SucPcrGraduateController::class);

    // LUC Details Routes
    Route::apiResource('/luc-details', LucDetailsController::class);
    // LUC Form BC Routes
    Route::apiResource('/luc-form-bc', LucFormBCController::class);
    // LUC Form E5 Routes
    Route::apiResource('/luc-form-e5', LucFormE5Controller::class);
    // LUC PRC Graduate Routes
    Route::apiResource('/luc-prc-graduate', LucPrcGraduateController::class);
    // LUC Dean Profile Routes
    Route::apiResource('/luc-dean-profiles', LucDeanProfileController::class);


    // Private Details Routes
    Route::apiResource('/private-details', PrivateDetailsController::class);
    // Private Form BC Routes
    Route::apiResource('/private-form-bc', PrivateFormBCController::class);
    // Private Form E5 Routes
    Route::apiResource('/private-form-e5', PrivateFormE5Controller::class);
    // Private PRC Graduate Routes
    Route::apiResource('/private-prc-graduate', PrivatePrcGraduateController::class);
    // Private Dean Profile Routes
    Route::apiResource('/private-dean-profiles', PrivateDeanProfileController::class);


    // Location Routes
    Route::get('/regions', [LocationController::class, 'getRegions']);
    Route::get('/provinces', [LocationController::class, 'getProvinces']);
    Route::get('/municipalities', [LocationController::class, 'getMunicipalities']);

    Route::get('/regions/{id}', [LocationController::class, 'showRegion']);
    Route::get('/provinces/{id}', [LocationController::class, 'showProvince']);
    Route::get('/municipalities/{id}', [LocationController::class, 'showMunicipality']);
});
