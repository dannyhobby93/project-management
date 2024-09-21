<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Project;
use Illuminate\Support\Str;
use App\Http\Resources\TaskResource;
use App\Http\Resources\ProjectResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Project::query();

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

        $projects = $query
            ->orderBy($sortField, $sortOrder)
            ->paginate(10)
            ->onEachSide(1)
            ->appends(request()->query());

        return Inertia::render(
            'Project/Index',
            [
                'projects' => ProjectResource::collection($projects),
                'queryParams' => request()->query() ?: null
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Project/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        $data = $request->validated();
        $data['created_by'] = $request->user()->id;
        $data['updated_by'] = $request->user()->id;

        $image = $request->file('image');

        if ($image) {
            $data['image_path'] = $image->store('images/uploads/projects', 'public');
        }

        Project::create($data);

        return redirect()->route('project.index')->with(
            'success',
            'Project was created.'
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        $query = $project->tasks();

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

        $tasks = $query
            ->orderBy($sortField, $sortOrder)
            ->paginate(10)
            ->onEachSide(1)
            ->appends(request()->query());

        return Inertia::render('Project/Show', [
            'project' => new ProjectResource($project),
            'tasks' => TaskResource::collection($tasks),
            'queryParams' => request()->query ?: null
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return Inertia::render('Project/Edit', [
            'project' => new ProjectResource($project)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, Project $project)
    {
        $data = $request->validated();
        $data['updated_by'] = $request->user()->id;

        $image = $request->file('image');

        if ($image) {
            if ($project->image_path) {
                Storage::disk('public')->delete($project->image_path);
            }
            $data['image_path'] = $image->store('images/uploads/projects', 'public');
        }

        $project->update($data);

        return redirect()->route('project.index')->with(
            'success',
            'Project was updated.'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        $name = $project->name;

        if ($project->image_path) {
            Storage::disk('public')->delete($project->image_path);
        }

        $project->delete();

        return redirect()->route('project.index')->with(
            'success',
            'Project ' . $name . ' was deleted.'
        );
    }
}
