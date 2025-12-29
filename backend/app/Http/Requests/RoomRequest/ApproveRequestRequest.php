<?php

namespace App\Http\Requests\RoomRequest;

use Illuminate\Foundation\Http\FormRequest;

class ApproveRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->isGA();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'idroom' => 'required|exists:rooms,id',
        ];
    }

    public function messages(): array
    {
        return [
            'id_room.required' => 'Ruangan harus dipilih',
            'id_room.exists' => 'Ruangan tidak ditemukan',
        ];
    }
}
