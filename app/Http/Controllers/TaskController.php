<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Task;
use Inertia\Inertia;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::query();

        $sortField = request('sort', 'id');
        $sortOrder = request('order', 'asc');

        if (request()->has('name')) {
            // $query->where('name', 'like', '%' . request('name') . '%');
            // POSTGRES
            $query->whereRaw('name ILIKE ?', ['%' . request('name') . '%']);
        }

        if (request()->has('status')) {
            $query->where('status', request('status'));
        }

        $projects = $query
            ->orderBy($sortField, $sortOrder)
            ->paginate(10)
            ->onEachSide(1)
            ->appends(request()->query());

        return Inertia::render(
            'Task/Index',
            [
                'tasks' => TaskResource::collection($projects),
                'queryParams' => request()->query() ?: null
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        //
    }
}
