<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $userId = $this->route('id');
        return auth()->check() && (auth()->id() === (int)$userId || auth()->user()->isGA());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('id');

        return [
            'nama' => 'sometimes|string|max:255',
            'divisi' => 'nullable|string|max:255',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('users', 'email')->ignore($userId, 'id_user'),
            ],
            'role' => 'sometimes|in:user,admin_ruangan,GA',
            'is_active' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nama.string' => 'Nama harus berupa teks',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah digunakan',
            'role.in' => 'Role harus: user, admin_ruangan, atau GA',
        ];
    }
}
