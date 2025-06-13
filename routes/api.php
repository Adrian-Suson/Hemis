<?php

use App\Http\Controllers\Api\HeiController;
use App\Http\Controllers\Api\SucDetailsController;
use App\Http\Controllers\Api\LucDetailsController;
use App\Http\Controllers\Api\PrivateDetailsController;
use App\Http\Controllers\Api\SucFormBController;
use App\Http\Controllers\Api\SucFormE1Controller;
use App\Http\Controllers\Api\SucFormE2Controller;
use App\Http\Controllers\Api\SucNfResearchFormController;
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
use App\Http\Controllers\Api\AllotmentController;
use App\Http\Controllers\Api\ExpenditureController;
use App\Http\Controllers\Api\IncomeController;
use App\Http\Controllers\Api\SucFormGHController;
use App\Http\Controllers\Api\ResearchTb1Controller;
use App\Http\Controllers\Api\ResearchTb2Controller;
use App\Http\Controllers\Api\ResearchTb3Controller;
use App\Http\Controllers\Api\ResearchTb4Controller;
use App\Http\Controllers\Api\ResearchTb5Controller;
use App\Http\Controllers\Api\ResearchTbcController;
use App\Http\Controllers\Api\SucPcrGraduateListController;
use App\Http\Controllers\Api\ClusterController;
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
    Route::get('heis/type/{type}', [HeiController::class, 'getByType']);
    Route::get('heis/cluster/{clusterId}', [HeiController::class, 'getByCluster']);
    Route::get('heis/search', [HeiController::class, 'search']);

    // SUC Details Routes
    Route::apiResource('/suc-details', SucDetailsController::class);
    // SUC Campus Routes
    Route::apiResource('/suc-campuses', SucCampusController::class);
    // SUC Form B Routes
    Route::get('/suc-form-b', [SucFormBController::class, 'index']);
    Route::get('/suc-form-b/suc-detail/{sucDetailId}', [SucFormBController::class, 'getBySucDetailId']);
    Route::post('/suc-form-b', [SucFormBController::class, 'store']);
    Route::get('/suc-form-b/{id}', [SucFormBController::class, 'show']);
    Route::put('/suc-form-b/{id}', [SucFormBController::class, 'update']);
    Route::delete('/suc-form-b/{id}', [SucFormBController::class, 'destroy']);
    Route::post('/suc-form-b/bulk', [SucFormBController::class, 'bulkStore']);

    // SUC Form E1 Routes
    Route::apiResource('/suc-form-e1', SucFormE1Controller::class);
    // SUC Form E2 Routes
    Route::apiResource('/suc-form-e2', SucFormE2Controller::class);
    Route::get('/suc-form-e2/suc-detail/{sucDetailId}', [SucFormE2Controller::class, 'getBySucDetailId']);
    Route::post('/suc-form-e2/bulk', [SucFormE2Controller::class, 'bulk']);
    // SUC Non-Faculty Research Form Routes
    Route::apiResource('/suc-nf-research-form', SucNfResearchFormController::class);

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

    // Allotment Routes
    Route::apiResource('/suc-form-gh/allotments', AllotmentController::class);
    Route::post('/suc-form-gh/allotments/bulk', [AllotmentController::class, 'bulkCreate']);

    // Expenditure Routes
    Route::apiResource('/suc-form-gh/expenditures', ExpenditureController::class);
    Route::post('/suc-form-gh/expenditures/bulk', [ExpenditureController::class, 'bulkCreate']);

    // Income Routes
    Route::apiResource('/suc-form-gh/incomes', IncomeController::class);
    Route::post('/suc-form-gh/incomes/bulk', [IncomeController::class, 'bulkCreate']);

    // Consolidated SucFormGH Route
    Route::get('/suc-form-gh/{sucDetailId}/all-data', [SucFormGHController::class, 'show']);

    // Location Routes
    Route::get('/regions', [LocationController::class, 'getRegions']);
    Route::get('/provinces', [LocationController::class, 'getProvinces']);
    Route::get('/municipalities', [LocationController::class, 'getMunicipalities']);

    Route::get('/regions/{id}', [LocationController::class, 'showRegion']);
    Route::get('/provinces/{id}', [LocationController::class, 'showProvince']);
    Route::get('/municipalities/{id}', [LocationController::class, 'showMunicipality']);

    // Research Routes
    Route::apiResource('/research-tb1', ResearchTb1Controller::class);
    Route::post('/research-tb1/bulk', [ResearchTb1Controller::class, 'bulkStore']);
    Route::apiResource('/research-tb2', ResearchTb2Controller::class);
    Route::post('/research-tb2/bulk', [ResearchTb2Controller::class, 'bulkStore']);
    Route::apiResource('/research-tb3', ResearchTb3Controller::class);
    Route::post('/research-tb3/bulk', [ResearchTb3Controller::class, 'bulkStore']);
    Route::apiResource('/research-tb4', ResearchTb4Controller::class);
    Route::post('/research-tb4/bulk', [ResearchTb4Controller::class, 'bulkStore']);
    Route::apiResource('/research-tb5', ResearchTb5Controller::class);
    Route::post('/research-tb5/bulk', [ResearchTb5Controller::class, 'bulkStore']);
    Route::apiResource('/research-tbc', ResearchTbcController::class);
    Route::post('/research-tbc/bulk', [ResearchTbcController::class, 'bulkStore']);
    Route::get('/research/all/{hei_id}', [ResearchTbcController::class, 'getAllResearch']);

    // SUC PCR Graduate List Routes
    Route::apiResource('suc-pcr-graduate-list', SucPcrGraduateListController::class);
    Route::post('suc-pcr-graduate-list/bulk', [SucPcrGraduateListController::class, 'bulkStore']);
    Route::post('suc-pcr-graduate-list/{id}/restore', [SucPcrGraduateListController::class, 'restore']);

    // Cluster routes
    Route::apiResource('clusters', ClusterController::class);
    Route::get('clusters/{cluster}/heis', [ClusterController::class, 'getHeis']);
});