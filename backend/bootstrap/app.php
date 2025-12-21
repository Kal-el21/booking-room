<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\RoleMiddleware::class,
        ]);

        $middleware->api(prepend: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
    })
    ->withSchedule(function (Schedule $schedule) {
        // Send scheduled notifications every 5 minutes
        $schedule->command('notifications:send')
                 ->everyFiveMinutes()
                 ->withoutOverlapping()
                 ->runInBackground();

        // Update room status every 10 minutes
        $schedule->command('rooms:update-status')
                 ->everyTenMinutes()
                 ->withoutOverlapping()
                 ->runInBackground();

        // Clean old notifications daily at 2 AM (optional)
        $schedule->command('model:prune', [
            '--model' => [\App\Models\Notification::class],
        ])->daily()->at('02:00');

        $schedule->command('model:prune')->daily();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
