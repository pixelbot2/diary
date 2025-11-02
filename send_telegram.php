<?php
// Set your unique Telegram credentials
// Bot Token and Chat ID (1928349457) are configured here
$botToken = "8020868469:AAEg2VD7KyuQYOCIr6PBR9umNKS20-L0-B0"; 
$chatId = "1928349457"; 

// Set content type header for JSON response
header('Content-Type: application/json');

// Get the JSON data sent from the JavaScript
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Check if the message is present
if (!isset($data['message'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'No message content provided.']);
    exit;
}

$message = $data['message'];
$url = "https://api.telegram.org/bot" . $botToken . "/sendMessage";

$params = [
    'chat_id' => $chatId,
    'text' => $message,
    'parse_mode' => 'Markdown', // Allows using *bold* text
];

// Initialize cURL for the API request
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
// Set a timeout
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10); 
curl_setopt($ch, CURLOPT_TIMEOUT, 10); 

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

if ($httpCode >= 200 && $httpCode < 300) {
    http_response_code(200);
    echo json_encode(['status' => 'success', 'response' => json_decode($response)]);
} else {
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'status' => 'error', 
        'message' => 'Telegram API failed', 
        'http_code' => $httpCode,
        'curl_error' => $curlError,
        'response' => $response
    ]);
}
?>
