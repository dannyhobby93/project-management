<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = User::query();

        $sortField = request('sort', 'id');
        $sortOrder = request('order', 'desc');

        if (request()->has('name')) {
            // $query->where('name', 'like', '%' . request('name') . '%');
            // POSTGRES
            $query->whereRaw('name ILIKE ?', ['%' . request('name') . '%']);
        }

        if (request()->has('email')) {
            // $query->where('email', 'like', '%' . request('email') . '%');
            // POSTGRES
            $query->whereRaw('email ILIKE ?', ['%' . request('email') . '%']);
        }

        $users = $query
            ->orderBy($sortField, $sortOrder)
            ->paginate(10)
            ->onEachSide(1)
            ->appends(request()->query());

        return Inertia::render(
            'User/Index',
            [
                'users' => UserResource::collection($users),
                'queryParams' => request()->query() ?: null
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        User::create($data);

        return redirect()->route('user.index')->with(
            'message',
            [
                'text' => 'User was created.',
                'type' => 'success'
            ]
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render('User/Show', [
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('User/Edit', [
            'user' => new UserResource($user)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        // Can't unset in UpdateUserRequest->withValidator() ???
        if (!$request->filled('password')) {
            unset($data['password']);
        }

        $user->update($data);

        return redirect()->route('user.index')->with(
            'message',
            [
                'text' => 'User was updated.',
                'type' => 'success'
            ]
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if ($user->id === auth()->user()->id) {
            return redirect()->route('user.index')->with(
                'message',
                [
                    'text' => 'You cannot delete yourself.',
                    'type' => 'error'
                ]
            );
        }

        $name = $user->name;

        $user->delete();

        return redirect()->route('user.index')->with(
            'message',
            [
                'text' => 'User ' . $name . ' was deleted.',
                'type' => 'success'
            ]
        );
    }
}
