<?php

namespace App\Http\Requests\Room;

use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequest extends FormRequest
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
            'nama_ruangan' => 'required|string|max:255',
            'kapasitas' => 'required|integer|min:1|max:1000',
            'lokasi' => 'required|string|max:255',
            'deskripsi' => 'nullable|string|max:1000',
            'status' => 'nullable|in:available,occupied,maintenance',
            'is_active' => 'nullable|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nama_ruangan.required' => 'Nama ruangan harus diisi',
            'kapasitas.required' => 'Kapasitas harus diisi',
            'kapasitas.integer' => 'Kapasitas harus berupa angka',
            'kapasitas.min' => 'Kapasitas minimal 1 orang',
            'kapasitas.max' => 'Kapasitas maksimal 1000 orang',
            'lokasi.required' => 'Lokasi harus diisi',
            'status.in' => 'Status harus: available, occupied, atau maintenance',
        ];
    }
}
