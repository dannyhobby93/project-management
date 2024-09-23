<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $statuses = ['pending', 'in_progress', 'completed'];
        $tasks = collect();

        foreach ($statuses as $status) {
            $tasks->put($status . 'Tasks', Task::where('status', $status)->count());
            $tasks->put('user' . ucfirst($status) . 'Tasks', Task::where('status', $status)
                ->where('assigned_user_id', auth()->user()->id)->count());
        }

        $activeTasks = Task::whereIn('status', ['pending', 'in_progress'])
            ->where('assigned_user_id', auth()->user()->id)
            ->limit(10)
            ->get();

        return Inertia::render('Dashboard', [
            'tasks' => $tasks->all(),
            'activeTasks' => TaskResource::collection($activeTasks)
        ]);
    }
}
