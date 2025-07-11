<?php
use Illuminate\Http\JsonResponse;

if (!function_exists('json_message')) {
    function json_message($message, $status = 200): JsonResponse
    {
        return response()->json(['message' => $message], $status);
    }
}
