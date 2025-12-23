<?php

namespace App\Http\Requests\RoomRequest;

use Illuminate\Foundation\Http\FormRequest;

class RejectRequestRequest extends FormRequest
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
            'rejected_reason' => 'required|string|min:10|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'rejected_reason.required' => 'Alasan penolakan harus diisi',
            'rejected_reason.min' => 'Alasan penolakan minimal 10 karakter',
            'rejected_reason.max' => 'Alasan penolakan maksimal 500 karakter',
        ];
    }
}
