<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex, nofollow');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Use POST to save a conversation.']);
    exit;
}

$baseDir = __DIR__;
$sheetsDir = $baseDir . DIRECTORY_SEPARATOR . 'excel_sheets';
$submissionsDir = $sheetsDir . DIRECTORY_SEPARATOR . 'submissions';
$masterSheet = $sheetsDir . DIRECTORY_SEPARATOR . 'conversations_master.csv';

$fieldNames = [
    'submitted_at',
    'name',
    'email',
    'need',
    'timeline',
    'brief',
    'destination_email',
    'source_page',
    'submitted_from',
];

function send_json(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES);
    exit;
}

function clean_text(mixed $value): string
{
    if ($value === null) {
        return '';
    }

    $text = trim(str_replace(["\r\n", "\r"], "\n", (string) $value));
    return preg_replace("/[ \t]+\n/", "\n", $text) ?? $text;
}

function slugify(string $value): string
{
    $slug = strtolower($value);
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
    $slug = trim($slug, '-');
    return $slug !== '' ? $slug : 'conversation';
}

function ensure_storage(string $sheetsDir, string $submissionsDir, string $masterSheet, array $fieldNames): void
{
    if (!is_dir($submissionsDir) && !mkdir($submissionsDir, 0755, true) && !is_dir($submissionsDir)) {
        send_json(500, ['ok' => false, 'error' => 'Unable to create conversation submissions folder.']);
    }

    if (!file_exists($masterSheet)) {
        $handle = fopen($masterSheet, 'wb');

        if ($handle === false) {
            send_json(500, ['ok' => false, 'error' => 'Unable to create conversation master sheet.']);
        }

        fwrite($handle, "\xEF\xBB\xBF");
        fputcsv($handle, $fieldNames);
        fclose($handle);
    }
}

function write_csv_row(string $path, array $fieldNames, array $record, bool $writeHeader): void
{
    $handle = fopen($path, $writeHeader ? 'wb' : 'ab');

    if ($handle === false) {
        send_json(500, ['ok' => false, 'error' => 'Unable to write conversation sheet.']);
    }

    flock($handle, LOCK_EX);

    if ($writeHeader) {
        fwrite($handle, "\xEF\xBB\xBF");
        fputcsv($handle, $fieldNames);
    }

    fputcsv($handle, array_map(fn($field) => safe_csv_value($record[$field] ?? ''), $fieldNames));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function safe_csv_value(mixed $value): string
{
    $text = (string) $value;

    if (preg_match('/^\s*[=+\-@]/', $text) === 1) {
        return "'" . $text;
    }

    return $text;
}

$rawBody = file_get_contents('php://input');
$payload = json_decode($rawBody === false ? '' : $rawBody, true);

if (!is_array($payload)) {
    send_json(400, ['ok' => false, 'error' => 'Invalid JSON payload.']);
}

$record = [
    'submitted_at' => date('Y-m-d H:i:s'),
    'name' => clean_text($payload['name'] ?? ''),
    'email' => clean_text($payload['email'] ?? ''),
    'need' => clean_text($payload['need'] ?? ''),
    'timeline' => clean_text($payload['timeline'] ?? ''),
    'brief' => clean_text($payload['brief'] ?? ''),
    'destination_email' => clean_text($payload['destinationEmail'] ?? ''),
    'source_page' => clean_text($payload['sourcePage'] ?? ''),
    'submitted_from' => clean_text($payload['submittedFrom'] ?? ''),
];

if ($record['name'] === '' || $record['email'] === '' || $record['brief'] === '') {
    send_json(400, ['ok' => false, 'error' => 'Name, email, and brief are required before saving the conversation.']);
}

ensure_storage($sheetsDir, $submissionsDir, $masterSheet, $fieldNames);

$timestamp = date('Y-m-d_H-i-s');
$savedFile = $timestamp . '_' . slugify($record['name']) . '.csv';
$submissionPath = $submissionsDir . DIRECTORY_SEPARATOR . $savedFile;

write_csv_row($masterSheet, $fieldNames, $record, false);
write_csv_row($submissionPath, $fieldNames, $record, true);

send_json(201, [
    'ok' => true,
    'saved_file' => $savedFile,
    'storage' => 'conversation_archive',
]);
