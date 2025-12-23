<?php

namespace App\Http\Requests\RoomRequest;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreRoomRequestRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nama_peminjam' => 'required|string|max:255',
            'kapasitas_dibutuhkan' => 'required|integer|min:1|max:1000',
            'kebutuhan' => 'required|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'tanggal' => 'required|date|after_or_equal:today',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
        ];
    }

    public function messages(): array
    {
        return [
            'nama_peminjam.required' => 'Nama peminjam harus diisi',
            'kapasitas_dibutuhkan.required' => 'Kapasitas yang dibutuhkan harus diisi',
            'kapasitas_dibutuhkan.integer' => 'Kapasitas harus berupa angka',
            'kapasitas_dibutuhkan.min' => 'Kapasitas minimal 1 orang',
            'kebutuhan.required' => 'Keperluan harus diisi',
            'tanggal.required' => 'Tanggal harus diisi',
            'tanggal.date' => 'Format tanggal tidak valid',
            'tanggal.after_or_equal' => 'Tanggal tidak boleh di masa lalu',
            'jam_mulai.required' => 'Jam mulai harus diisi',
            'jam_mulai.date_format' => 'Format jam harus HH:mm (contoh: 14:00)',
            'jam_selesai.required' => 'Jam selesai harus diisi',
            'jam_selesai.date_format' => 'Format jam harus HH:mm (contoh: 16:00)',
            'jam_selesai.after' => 'Jam selesai harus lebih besar dari jam mulai',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validasi waktu booking minimal 30 menit
            if ($this->jam_mulai && $this->jam_selesai) {
                $start = Carbon::parse($this->jam_mulai);
                $end = Carbon::parse($this->jam_selesai);

                if ($end->diffInMinutes($start) < 30) {
                    $validator->errors()->add('jam_selesai', 'Durasi booking minimal 30 menit');
                }

                // Validasi maksimal 8 jam
                if ($end->diffInHours($start) > 8) {
                    $validator->errors()->add('jam_selesai', 'Durasi booking maksimal 8 jam');
                }
            }

            // Validasi booking tidak boleh lebih dari 30 hari ke depan
            if ($this->tanggal) {
                $bookingDate = Carbon::parse($this->tanggal);
                $maxDate = Carbon::today()->addDays(30);

                if ($bookingDate->greaterThan($maxDate)) {
                    $validator->errors()->add('tanggal', 'Booking maksimal 30 hari ke depan');
                }
            }
        });
    }
}
