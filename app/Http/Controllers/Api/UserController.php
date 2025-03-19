<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Get all users with their institutions
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $authUser = $request->user(); // Get the authenticated user

            if (!$authUser) {
                return response()->json([
                    'message' => 'Unauthorized: No authenticated user found',
                ], Response::HTTP_UNAUTHORIZED);
            }

            $query = User::with('institution'); // Eager load institution relationship

            // Apply institution_id filter unless the user is a Super Admin
            if ($authUser->role !== 'Super Admin' && $authUser->institution_id) {
                $query->where('institution_id', $authUser->institution_id);
            }

            // Optionally handle institution_id from query params (for frontend flexibility)
            if ($request->has('institution_id') && $authUser->role !== 'Super Admin') {
                $query->where('institution_id', $request->input('institution_id'));
            }

            $users = $query->get();

            return response()->json($users, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch users',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Get a single user with their institution
     */
    public function show($id)
    {
        try {
            $user = User::with('institution')->findOrFail($id);
            return response()->json($user, Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'User not found',
                'error' => $e->getMessage(),
            ], Response::HTTP_NOT_FOUND);
        }
    }

    /**
     * Store a new user
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
                'role' => 'required|in:Super Admin,HEI Admin,HEI Staff,Viewer',
                'institution_id' => 'nullable|exists:institutions,id',
                'status' => 'sometimes|in:Active,Inactive,Suspended',
                'profile_image' => 'sometimes|nullable|string',
            ]);

            if ($validated['role'] !== 'Super Admin' && !$request->filled('institution_id')) {
                return response()->json([
                    'message' => 'Institution ID is required for non-Super Admin users.',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
            if ($validated['role'] === 'Super Admin') {
                $validated['institution_id'] = null;
            }

            $validated['password'] = Hash::make($validated['password']);

            if (isset($validated['profile_image']) && preg_match('/^data:image\/(png|jpg|jpeg);base64,/', $validated['profile_image'])) {
                // Store base64 string directly
            } else {
                unset($validated['profile_image']);
            }

            $user = User::create($validated);

            return response()->json([
                'message' => 'User created successfully',
                'user' => $user->load('institution'),
            ], Response::HTTP_CREATED);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create user',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update user
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
                'password' => 'sometimes|string|min:8|confirmed',
                'role' => 'sometimes|in:Super Admin,HEI Admin,HEI Staff,Viewer',
                'institution_id' => 'nullable|exists:institutions,id',
                'profile_image' => 'sometimes|nullable|string',
                'status' => 'sometimes|in:Active,Inactive,Suspended',
            ]);

            if (array_key_exists('role', $validated)) {
                if ($validated['role'] !== 'Super Admin' && !$request->filled('institution_id')) {
                    return response()->json([
                        'message' => 'Institution ID is required for non-Super Admin users.',
                    ], Response::HTTP_UNPROCESSABLE_ENTITY);
                }
                if ($validated['role'] === 'Super Admin') {
                    $validated['institution_id'] = null;
                }
            } elseif ($user->role !== 'Super Admin' && !$request->filled('institution_id') && !isset($validated['institution_id'])) {
                return response()->json([
                    'message' => 'Institution ID is required for non-Super Admin users.',
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            if (isset($validated['password'])) {
                $validated['password'] = Hash::make($validated['password']);
            }

            if (isset($validated['profile_image'])) {
                $profileImage = $validated['profile_image'];
                if (preg_match('/^data:image\/(png|jpg|jpeg);base64,/', $profileImage)) {
                    $validated['profile_image'] = $profileImage;
                } else {
                    unset($validated['profile_image']);
                }
            }

            $user->update($validated);

            return response()->json([
                'message' => 'User updated successfully',
                'user' => $user->load('institution'),
            ], Response::HTTP_OK);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update user',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Reactivate user (update status to Active)
     */
    public function reactivate($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->update(['status' => 'Active']);

            return response()->json([
                'message' => 'User reactivated successfully',
                'user' => $user->load('institution'),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to reactivate user',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Deactivate user (update status to Inactive)
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->update(['status' => 'Inactive']);

            return response()->json([
                'message' => 'User deactivated successfully',
                'user' => $user->load('institution'),
            ], Response::HTTP_OK);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to deactivate user',
                'error' => $e->getMessage(),
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
