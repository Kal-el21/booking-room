<?php

namespace App\Http\Requests\RoomRequest;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRoomRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $request = \App\Models\RoomRequest::findOrFail($this->route('id'));
        return auth()->check() && $request->id_user === auth()->id() && $request->isPending();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // 'nama_peminjam' => 'sometimes|string|max:255',
            'required_capacity' => 'sometimes|integer|min:1|max:1000',
            'purpose' => 'sometimes|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'date' => 'sometimes|date|after_or_equal:today',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
        ];
    }

    public function messages(): array
    {
        return [
            // 'nama_peminjam.string' => 'Nama peminjam harus berupa teks',
            'required_capacity.integer' => 'Kapasitas harus berupa angka',
            'required_capacity.min' => 'Kapasitas minimal 1 orang',
            'purpose.string' => 'Keperluan harus berupa teks',
            'date.date' => 'Format tanggal tidak valid',
            'date.after_or_equal' => 'Tanggal tidak boleh di masa lalu',
            'start_time.date_format' => 'Format jam harus HH:mm',
            'end_time.date_format' => 'Format jam harus HH:mm',
            'end_time.after' => 'Jam selesai harus lebih besar dari jam mulai',
        ];
    }
}
