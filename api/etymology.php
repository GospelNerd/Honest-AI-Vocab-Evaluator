<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: private, max-age=300');

require __DIR__ . '/cache.php';
require __DIR__ . '/etymonline.php';

$config = require __DIR__ . '/config.php';
if (!$config) {
    etymology_send_json(503, ['error' => 'Etymology lookup is not configured on this server.']);
}

$word = isset($_GET['word']) ? trim($_GET['word']) : '';

if ($word === '' || !preg_match('/^[a-zA-Z][a-zA-Z0-9\'-]{0,49}$/', $word)) {
    etymology_send_json(400, ['error' => 'Enter a single English word (letters, hyphens, and apostrophes only).']);
}

$wordId = strtolower($word);
$cacheProvider = 'etymonline';
$cachedRecord = etymology_cache_read($config, $cacheProvider, $wordId);
if ($cachedRecord && isset($cachedRecord['httpStatus'], $cachedRecord['response'])) {
    $cachedAt = $cachedRecord['cachedAt'] ?? null;
    $response = $cachedRecord['response'];
    $response['cached'] = true;
    if ($cachedAt) {
        $response['cachedAt'] = $cachedAt;
    }
    etymology_send_json((int) $cachedRecord['httpStatus'], $response);
}

$result = etymonline_lookup($config, $wordId);
$cachedAt = gmdate('c');

if (!$result['ok']) {
    $response = etymology_error_response($result['error'], $wordId, false, null);
    if (!empty($result['sourceUrl'])) {
        $response['sourceUrl'] = $result['sourceUrl'];
    }
    if ((int) $result['status'] === 404) {
        etymology_cache_write($config, $cacheProvider, $wordId, [
            'cachedAt' => $cachedAt,
            'httpStatus' => 404,
            'response' => $response,
        ]);
    }
    etymology_send_json((int) $result['status'], $response);
}

$response = etymology_success_response([
    'word' => $result['word'],
    'entries' => $result['entries'],
    'source' => $result['source'],
    'sourceUrl' => $result['sourceUrl'],
    'attribution' => $result['attribution'],
], false, null);

etymology_cache_write($config, $cacheProvider, $wordId, [
    'cachedAt' => $cachedAt,
    'httpStatus' => 200,
    'response' => $response,
]);

etymology_send_json(200, $response);
