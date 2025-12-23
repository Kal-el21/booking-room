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
            'nama_peminjam' => 'sometimes|string|max:255',
            'kapasitas_dibutuhkan' => 'sometimes|integer|min:1|max:1000',
            'kebutuhan' => 'sometimes|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'tanggal' => 'sometimes|date|after_or_equal:today',
            'jam_mulai' => 'sometimes|date_format:H:i',
            'jam_selesai' => 'sometimes|date_format:H:i|after:jam_mulai',
        ];
    }

    public function messages(): array
    {
        return [
            'nama_peminjam.string' => 'Nama peminjam harus berupa teks',
            'kapasitas_dibutuhkan.integer' => 'Kapasitas harus berupa angka',
            'kapasitas_dibutuhkan.min' => 'Kapasitas minimal 1 orang',
            'kebutuhan.string' => 'Keperluan harus berupa teks',
            'tanggal.date' => 'Format tanggal tidak valid',
            'tanggal.after_or_equal' => 'Tanggal tidak boleh di masa lalu',
            'jam_mulai.date_format' => 'Format jam harus HH:mm',
            'jam_selesai.date_format' => 'Format jam harus HH:mm',
            'jam_selesai.after' => 'Jam selesai harus lebih besar dari jam mulai',
        ];
    }
}
