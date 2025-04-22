<?php

// app/Http/Controllers/Api/ActivityLogController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class ActivityLogController extends Controller
{
    public function index(Request $request)
    {
        $query = ActivityLog::query()
            ->with('user')
            ->orderBy('created_at', 'desc');

        if ($request->has('action')) {
            $query->where('action', $request->action);
        }

        if ($request->has('model_type')) {
            $query->where('model_type', $request->model_type);
        }

        $logs = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'data' => $logs->items(),
            'current_page' => $logs->currentPage(),
            'last_page' => $logs->lastPage(),
            'total' => $logs->total(),
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'action' => 'required|string|max:255',
            'description' => 'nullable|string',
            'model_type' => 'nullable|string',
            'model_id' => 'nullable|integer',
            'properties' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $log = ActivityLog::create([
            'user_id' => Auth::id(),
            'action' => $request->action,
            'description' => $request->description,
            'model_type' => $request->model_type,
            'model_id' => $request->model_id,
            'properties' => $request->properties
        ]);

        return response()->json([
            'message' => 'Activity log created successfully',
            'data' => $log
        ], 201);
    }
}
