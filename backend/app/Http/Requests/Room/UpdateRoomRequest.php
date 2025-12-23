<?php

namespace App\Http\Requests\Room;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && (auth()->user()->isAdminRuangan() || auth()->user()->isGA());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_ruangan' => 'sometimes|string|max:255',
            'kapasitas' => 'sometimes|integer|min:1|max:1000',
            'lokasi' => 'sometimes|string|max:255',
            'deskripsi' => 'nullable|string|max:1000',
            'status' => 'sometimes|in:available,occupied,maintenance',
            'is_active' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nama_ruangan.string' => 'Nama ruangan harus berupa teks',
            'kapasitas.integer' => 'Kapasitas harus berupa angka',
            'kapasitas.min' => 'Kapasitas minimal 1 orang',
            'kapasitas.max' => 'Kapasitas maksimal 1000 orang',
            'status.in' => 'Status harus: available, occupied, atau maintenance',
        ];
    }
}
