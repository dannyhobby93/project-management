<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Inertia\Inertia;
use App\Http\Resources\TaskResource;
use App\Http\Requests\StoreTaskRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateTaskRequest;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::query();

        $sortField = request('sort', 'id');
        $sortOrder = request('order', 'desc');

        if (request()->has('name')) {
            // $query->where('name', 'like', '%' . request('name') . '%');
            // POSTGRES
            $query->whereRaw('name ILIKE ?', ['%' . request('name') . '%']);
        }

        if (request()->has('status')) {
            $query->where('status', request('status'));
        }

        $tasks = $query
            ->orderBy($sortField, $sortOrder)
            ->paginate(10)
            ->onEachSide(1)
            ->appends(request()->query());

        return Inertia::render(
            'Task/Index',
            [
                'tasks' => TaskResource::collection($tasks),
                'queryParams' => request()->query() ?: null
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::query()
            ->orderBy('name', 'asc')
            ->get();

        $users = User::query()
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render(
            'Task/Create',
            [
                'projects' => ProjectResource::collection($projects),
                'users' => UserResource::collection($users),
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()->id;
        $data['updated_by'] = $request->user()->id;

        $image = $request->file('image');

        if ($image) {
            $data['image_path'] = $image->store('images/uploads/tasks', 'public');
        }

        Task::create($data);

        return redirect()->route('task.index')->with(
            'message',
            [
                'text' => 'Task was created.',
                'type' => 'success'
            ]
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return Inertia::render('Task/Show', [
            'task' => new TaskResource($task)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $projects = Project::query()
            ->orderBy('name', 'asc')
            ->get();
        $users = User::query()
            ->orderBy('name', 'asc')
            ->get();

        return Inertia::render('Task/Edit', [
            'task' => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();
        $data['updated_by'] = $request->user()->id;

        $image = $request->file('image');

        if ($image) {
            if ($task->image_path) {
                Storage::disk('public')->delete($task->image_path);
            }
            $data['image_path'] = $image->store('images/uploads/tasks', 'public');
        }

        $task->update($data);

        return redirect()->route('task.index')->with(
            'message',
            [
                'text' => 'Task ' . $task->name . ' was updated.',
                'type' => 'success'
            ]
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $name = $task->name;

        if ($task->image_path) {
            Storage::disk('public')->delete($task->image_path);
        }

        $task->delete();

        return redirect()->route('task.index')->with(
            'message',
            [
                'text' => 'Task ' . $name . ' was deleted.',
                'type' => 'success'
            ]
        );
    }
}
