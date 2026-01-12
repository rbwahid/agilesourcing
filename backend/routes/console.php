<?php

use App\Jobs\RefreshInstagramTokenJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

/*
|--------------------------------------------------------------------------
| Scheduled Jobs
|--------------------------------------------------------------------------
*/

// Refresh Instagram tokens that are expiring soon (run daily at 3 AM)
Schedule::job(new RefreshInstagramTokenJob)->dailyAt('03:00');
