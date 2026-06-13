<?php

function etymology_cache_dir(array $config): string
{
    return $config['cache_dir'] ?? (__DIR__ . '/cache');
}

function etymology_cache_enabled(array $config): bool
{
    return !empty($config['persistent_cache']);
}

function etymology_cache_path(string $dir, string $provider, string $word): string
{
    return $dir . '/' . $provider . '/' . $word . '.json';
}

function etymology_cache_read(array $config, string $provider, string $word): ?array
{
    if (!etymology_cache_enabled($config)) {
        return null;
    }

    $path = etymology_cache_path(etymology_cache_dir($config), $provider, $word);
    if (!is_readable($path)) {
        return null;
    }

    $raw = file_get_contents($path);
    if ($raw === false) {
        return null;
    }

    $record = json_decode($raw, true);
    return is_array($record) ? $record : null;
}

function etymology_cache_write(array $config, string $provider, string $word, array $record): void
{
    if (!etymology_cache_enabled($config)) {
        return;
    }

    $base = etymology_cache_dir($config);
    $providerDir = $base . '/' . $provider;
    if (!is_dir($providerDir) && !mkdir($providerDir, 0755, true) && !is_dir($providerDir)) {
        return;
    }

    $path = etymology_cache_path($base, $provider, $word);
    $tmp = $path . '.tmp.' . getmypid();
    $encoded = json_encode($record, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    if ($encoded === false) {
        return;
    }

    if (file_put_contents($tmp, $encoded, LOCK_EX) !== false) {
        rename($tmp, $path);
    } else {
        @unlink($tmp);
    }
}

function etymology_success_response(array $payload, bool $cached, ?string $cachedAt): array
{
    $response = $payload;
    $response['cached'] = $cached;
    if ($cachedAt) {
        $response['cachedAt'] = $cachedAt;
    }
    return $response;
}

function etymology_error_response(string $message, string $wordId, bool $cached, ?string $cachedAt): array
{
    $response = [
        'error' => $message,
        'word' => $wordId,
        'cached' => $cached,
    ];
    if ($cachedAt) {
        $response['cachedAt'] = $cachedAt;
    }
    return $response;
}

function etymology_send_json(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}
