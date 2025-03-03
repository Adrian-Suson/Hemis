<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Get all users
     */
    public function index()
    {
        $users = User::all(); // Retrieves all users without pagination
        return response()->json($users);
    }

    /**
     * Get single user
     */
    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json($user);
    }

    /**
     * Update user
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'password' => 'sometimes|string|min:8|confirmed',
            'role' => 'sometimes|string|in:admin,user',
            'profile_image' => 'sometimes|nullable|string', // Base64 image validation
        ]);

        // If password is provided, hash it
        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        // Handle profile image if provided (base64 encoded string)
        if (isset($validated['profile_image'])) {
            $profileImage = $validated['profile_image'];

            // If the profile image is a valid base64 string, save it
            if (preg_match('/^data:image\/(png|jpg|jpeg);base64,/', $profileImage)) {
                // Directly save the base64 string in the profile_image column
                // We don't need to decode and save as a file, just store the base64 string
                $validated['profile_image'] = $profileImage;
            }
        }

        // Update the user record with validated data
        $user->update($validated);

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Reactivate user (update status to active)
     */
    public function reactivate($id)
    {
        try {
            $user = User::findOrFail($id);

            // Update status to active
            $user->update([
                'status' => 'Active'
            ]);

            return response()->json([
                'message' => 'User reactivated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to reactivate user',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete user
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);

            // Update status to inactive instead of deleting
            $user->update([
                'status' => 'Inactive'
            ]);

            return response()->json([
                'message' => 'User deactivated successfully',
                'user' => $user
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to deactivate user',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
