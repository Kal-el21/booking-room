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
        return auth()->check() && (auth()->user()->isRoomAdmin() || auth()->user()->isGA());
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'room_name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1|max:1000',
            'location' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'nullable|in:available,occupied,maintenance',
            'is_active' => 'nullable|boolean',
        ];
    }
    public function messages(): array
    {
        return [
            'room_name.required' => 'Nama ruangan harus diisi',
            'capacity.required' => 'Kapasitas harus diisi',
            'capacity.integer' => 'Kapasitas harus berupa angka',
            'capacity.min' => 'Kapasitas minimal 1 orang',
            'capacity.max' => 'Kapasitas maksimal 1000 orang',
            'location.required' => 'Lokasi harus diisi',
            'status.in' => 'Status harus: available, occupied, atau maintenance',
        ];
    }
}
