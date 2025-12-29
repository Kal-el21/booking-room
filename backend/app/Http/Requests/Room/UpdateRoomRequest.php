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
            'room_name' => 'sometimes|string|max:255',
            'capacity' => 'sometimes|integer|min:1|max:1000',
            'location' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'status' => 'sometimes|in:available,occupied,maintenance',
            'is_active' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'room_name.string' => 'Nama ruangan harus berupa teks',
            'capacity.integer' => 'Kapasitas harus berupa angka',
            'capacity.min' => 'Kapasitas minimal 1 orang',
            'capacity.max' => 'Kapasitas maksimal 1000 orang',
            'status.in' => 'Status harus: available, occupied, atau maintenance',
        ];
    }
}
