<?php

function etymonline_base_url(array $config): string
{
    return rtrim($config['etymonline_base'] ?? 'https://www.etymonline.com', '/');
}

function etymonline_user_agent(array $config): string
{
    return $config['user_agent'] ?? 'HonestAIVocab/1.0 (+https://vocab.logosanalog.com)';
}

function etymonline_fetch_html(array $config, string $word): array
{
    $url = etymonline_base_url($config) . '/word/' . rawurlencode(strtolower($word));
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_USERAGENT => etymonline_user_agent($config),
        CURLOPT_HTTPHEADER => ['Accept: text/html'],
    ]);

    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($body === false) {
        return ['ok' => false, 'error' => 'Could not reach the Online Etymology Dictionary.', 'detail' => $curlError];
    }

    return ['ok' => true, 'status' => $status, 'html' => $body, 'url' => $url];
}

function etymonline_clean_text(string $html): string
{
    $text = html_entity_decode(strip_tags($html), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = preg_replace('/\s+/u', ' ', $text);
    return trim((string) $text);
}

function etymonline_inner_html(DOMNode $node): string
{
    $html = '';
    foreach ($node->childNodes as $child) {
        $html .= $node->ownerDocument->saveHTML($child);
    }
    return $html;
}

function etymonline_parse_html(string $html, string $requestedWord): array
{
    $previous = libxml_use_internal_errors(true);
    $document = new DOMDocument();
    $loaded = $document->loadHTML('<?xml encoding="utf-8" ?>' . $html, LIBXML_NOWARNING | LIBXML_NOERROR);
    libxml_clear_errors();
    libxml_use_internal_errors($previous);

    if (!$loaded) {
        return [];
    }

    $xpath = new DOMXPath($document);
    $sections = $xpath->query("//section[contains(concat(' ', normalize-space(@class), ' '), ' prose-lg ')]");
    if (!$sections) {
        return [];
    }

    $entries = [];
    $requested = strtolower($requestedWord);

    foreach ($sections as $section) {
        if (!$section instanceof DOMElement) {
            continue;
        }

        $heading = $xpath->query('.//h2', $section)->item(0);
        if (!$heading) {
            continue;
        }

        $term = '';
        $pos = '';
        $spans = $xpath->query('.//span', $heading);
        if ($spans && $spans->length > 0) {
            $term = etymonline_clean_text($spans->item(0)->textContent ?? '');
            if ($spans->length > 1) {
                $pos = etymonline_clean_text($spans->item(1)->textContent ?? '');
            }
        } else {
            $term = etymonline_clean_text($heading->textContent ?? '');
        }

        $pos = trim($pos, '() ');
        if ($term === '' || $pos === '' || !preg_match('/^[a-z]+\.?$/i', $pos)) {
            continue;
        }

        $paragraphs = [];
        $paragraphNodes = $xpath->query('.//section//p | .//p', $section);
        if ($paragraphNodes) {
            foreach ($paragraphNodes as $paragraph) {
                if (!$paragraph instanceof DOMElement) {
                    continue;
                }
                $text = etymonline_clean_text(etymonline_inner_html($paragraph));
                if ($text !== '') {
                    $paragraphs[] = $text;
                }
            }
        }

        $paragraphs = array_values(array_filter($paragraphs, static function (string $text) {
            if (strlen($text) < 25) {
                return false;
            }
            return !preg_match('/^also from /i', $text);
        }));

        if (!$paragraphs) {
            continue;
        }

        $entries[] = [
            'term' => strtolower($term),
            'lexicalCategory' => $pos,
            'etymologies' => $paragraphs,
            'definitions' => [],
        ];
    }

    if (!$entries) {
        return [];
    }

    $primary = array_values(array_filter($entries, static function (array $entry) use ($requested) {
        return $entry['term'] === $requested;
    }));

    return $primary ?: [$entries[0]];
}

function etymonline_lookup(array $config, string $word): array
{
    $wordId = strtolower($word);
    $fetch = etymonline_fetch_html($config, $wordId);
    if (!$fetch['ok']) {
        return ['ok' => false, 'status' => 502, 'error' => $fetch['error'], 'detail' => $fetch['detail'] ?? null];
    }

    if ($fetch['status'] === 404) {
        return [
            'ok' => false,
            'status' => 404,
            'error' => 'No entry found on Etymonline for that word.',
            'word' => $wordId,
        ];
    }

    if ($fetch['status'] < 200 || $fetch['status'] >= 300) {
        return [
            'ok' => false,
            'status' => 502,
            'error' => 'Etymonline lookup failed.',
            'word' => $wordId,
        ];
    }

    $entries = etymonline_parse_html($fetch['html'], $wordId);
    if (!$entries) {
        return [
            'ok' => false,
            'status' => 404,
            'error' => 'No etymology entry found for that word.',
            'word' => $wordId,
        ];
    }

    return [
        'ok' => true,
        'status' => 200,
        'word' => $wordId,
        'entries' => array_map(static function (array $entry) {
            return [
                'lexicalCategory' => $entry['lexicalCategory'],
                'etymologies' => $entry['etymologies'],
                'definitions' => $entry['definitions'],
            ];
        }, $entries),
        'source' => 'etymonline',
        'sourceUrl' => $fetch['url'],
        'attribution' => 'Etymology from the Online Etymology Dictionary (etymonline.com), by Douglas Harper.',
    ];
}
