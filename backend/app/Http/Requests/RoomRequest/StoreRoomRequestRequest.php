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
            // 'nama_peminjam' => 'required|string|max:255',
            'required_capacity' => 'required|integer|min:1|max:1000',
            'purpose' => 'required|string|max:500',
            'notes' => 'nullable|string|max:1000',
            'date' => 'required|date|after_or_equal:today',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
        ];
    }

    public function messages(): array
    {
        return [
            // 'nama_peminjam.required' => 'Nama peminjam harus diisi',
            'required_capacity.required' => 'Kapasitas yang dibutuhkan harus diisi',
            'required_capacity.integer' => 'Kapasitas harus berupa angka',
            'required_capacity.min' => 'Kapasitas minimal 1 orang',
            'purpose.required' => 'Keperluan harus diisi',
            'date.required' => 'Tanggal harus diisi',
            'date.date' => 'Format tanggal tidak valid',
            'date.after_or_equal' => 'Tanggal tidak boleh di masa lalu',
            'start_time.required' => 'Jam mulai harus diisi',
            'start_time.date_format' => 'Format jam harus HH:mm (contoh: 14:00)',
            'end_time.required' => 'Jam selesai harus diisi',
            'end_time.date_format' => 'Format jam harus HH:mm (contoh: 16:00)',
            'end_time.after' => 'Jam selesai harus lebih besar dari jam mulai',
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validasi waktu booking minimal 30 menit
            if ($this->start_time && $this->end_time) {
                $start = Carbon::parse($this->start_time);
                $end = Carbon::parse($this->end_time);

                if ($end->diffInMinutes($start) < 30) {
                    $validator->errors()->add('end_time', 'Durasi booking minimal 30 menit');
                }

                // Validasi maksimal 8 jam
                if ($end->diffInHours($start) > 8) {
                    $validator->errors()->add('end_time', 'Durasi booking maksimal 8 jam');
                }
            }

            // Validasi booking tidak boleh lebih dari 30 hari ke depan
            if ($this->date) {
                $bookingDate = Carbon::parse($this->date);
                $maxDate = Carbon::today()->addDays(30);

                if ($bookingDate->greaterThan($maxDate)) {
                    $validator->errors()->add('date', 'Booking maksimal 30 hari ke depan');
                }
            }
        });
    }
}
