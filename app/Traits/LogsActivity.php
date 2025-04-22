<?php
// app/Traits/LogsActivity.php
namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
public function logActivity(string $description, array $properties = [], $subject = null): ActivityLog
{
return ActivityLog::create([
'description' => $description,
'subject_id' => $subject ? $subject->id : null,
'subject_type' => $subject ? get_class($subject) : null,
'causer_id' => Auth::id(),
'causer_type' => Auth::user() ? get_class(Auth::user()) : null,
'properties' => $properties,
]);
}
}