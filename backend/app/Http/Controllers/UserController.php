<?php

namespace App\Http\Controllers;

use App\Exports\UsersExport;
use App\Http\Requests\User\StoreUserRequest;
use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\Response as Status;

class UserController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        return UserResource::collection(
            User::query()
                ->when(
                    $request->filled('sort'),
                    function ($query) use ($request) {
                        $sort = explode(',', $request->input('sort'));
                        foreach ($sort as $sortParam) {
                            [$field, $direction] = explode(':', $sortParam);
                            $query->orderBy($field, $direction);
                        }
                    },
                    fn($query) => $query->orderBy('id', 'DESC')
                )
                ->paginate($request->input('pageSize', 10), page: $request->input('page', 1))
        );
    }

    public function store(StoreUserRequest $request): UserResource
    {
        return new UserResource(User::create($request->validated()));
    }

    public function show(User $user): UserResource
    {
        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user): UserResource
    {
        $user->update([
            'name' => $request->validated('name') ?? $user->name,
            'email' => $request->validated('email') ?? $user->email,
            'password' => $request->validated('password') ?? $user->password,
            'phone' => $request->validated('phone') ?? $user->phone,
        ]);
        return new UserResource($user);
    }

    public function destroy(User $user): Response
    {
        abort_if(auth()->id() === $user->id, Status::HTTP_FORBIDDEN, 'You cannot delete your own account.');
        $user->delete();
        return response()->noContent();
    }

    public function export(): BinaryFileResponse
    {
        return Excel::download(new UsersExport, 'users.xlsx');
    }
}
