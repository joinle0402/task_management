<?php

namespace App\Providers;

use DateTime;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use SqlFormatter;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        if ($this->app->environment('local')) {
            $queries = [];
            DB::listen(function ($query) use (&$queries) {
                $bindings = array_map(function ($binding) {
                    if ($binding === null) {
                        return 'NULL';
                    }
                    if (is_bool($binding)) {
                        return $binding ? 'TRUE' : 'FALSE';
                    }
                    if ($binding instanceof DateTime) {
                        return $binding->format('Y-m-d H:i:s');
                    }
                    return is_numeric($binding) ? $binding : "'$binding'";
                }, $query->bindings);

                $rawSql = vsprintf(str_replace('?', '%s', $query->sql), $bindings);
                $formattedSql = SqlFormatter::format($rawSql, false);

                $queries[] = [
                    'sql' => $formattedSql,
                    'time' => $query->time,
                ];

                Log::info("SQL:\nTime: $query->time ms\n$formattedSql");
            });

            app()->terminating(function () use (&$queries) {
                if (empty($queries)) return;

                // Prepare log content
                $log = "===== SQL Queries For Request: " . now() . " =====\n";

                foreach ($queries as $query) {
                    $log .= "Time: ($query[time] ms)\nSQL: \n$query[sql]\n\n";
                }

                $log .= "===== END REQUEST =====\n";

                file_put_contents(storage_path('logs/sql_per_request.log'), $log);
            });
        }
    }
}
