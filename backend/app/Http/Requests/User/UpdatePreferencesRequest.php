<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePreferencesRequest extends FormRequest
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
            'notification_24h' => 'sometimes|boolean',
            'notification_3h' => 'sometimes|boolean',
            'notification_30m' => 'sometimes|boolean',
            'email_notifications' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'notification_24h.boolean' => 'Nilai harus true atau false',
            'notification_3h.boolean' => 'Nilai harus true atau false',
            'notification_30m.boolean' => 'Nilai harus true atau false',
            'email_notifications.boolean' => 'Nilai harus true atau false',
        ];
    }
}
