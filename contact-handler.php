<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Μη επιτρεπτή μέθοδος.']);
    exit;
}

// --- Simple honeypot spam trap (field must stay empty) ---
if (!empty($_POST['website'] ?? '')) {
    // Pretend success so bots don't learn the trap was hit.
    echo json_encode(['success' => true]);
    exit;
}

function respond_error(string $message): void {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

// Strip anything that could be used for header injection
function clean_field(string $value): string {
    $value = trim($value);
    return preg_replace('/[\r\n]+/', ' ', $value);
}

$name    = clean_field((string)($_POST['name'] ?? ''));
$email   = clean_field((string)($_POST['email'] ?? ''));
$phone   = clean_field((string)($_POST['phone'] ?? ''));
$subject = clean_field((string)($_POST['subject'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));

$allowedSubjects = [
    'Αστικό Δίκαιο',
    'Ποινικό Δίκαιο',
    'Εργατικό Δίκαιο',
    'Εμπορικό Δίκαιο',
    'Δημόσιο Δίκαιο',
    'Αυτοκινητικές Διαφορές',
    'Υπερχρεωμένα Νοικοκυριά',
    'Λατομικό Δίκαιο',
    'Δίκαιο Αλλοδαπών',
    'Συμβάσεις',
    'Άλλο',
];

if ($name === '' || mb_strlen($name) > 150) {
    respond_error('Παρακαλούμε εισάγετε ένα έγκυρο ονοματεπώνυμο.');
}
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond_error('Παρακαλούμε εισάγετε μια έγκυρη διεύθυνση email.');
}
if ($subject !== '' && !in_array($subject, $allowedSubjects, true)) {
    respond_error('Παρακαλούμε επιλέξτε ένα έγκυρο θέμα.');
}
if ($message === '' || mb_strlen($message) > 5000) {
    respond_error('Παρακαλούμε γράψτε ένα μήνυμα (έως 5000 χαρακτήρες).');
}
if (empty($_POST['consent'] ?? '')) {
    respond_error('Παρακαλούμε αποδεχθείτε την Πολιτική Απορρήτου για να συνεχίσετε.');
}

$to          = 'contact@isonomia.gr';
$subjectLine = '[ΙΣΟΝΟΜΙΑ Επικοινωνία] ' . ($subject !== '' ? $subject : 'Γενικό Ερώτημα');

$body  = "Νέο μήνυμα από τη φόρμα επικοινωνίας του isonomia.gr\n\n";
$body .= "Όνομα: {$name}\n";
$body .= "Email: {$email}\n";
if ($phone !== '') {
    $body .= "Τηλέφωνο: {$phone}\n";
}
$body .= "Θέμα: " . ($subject !== '' ? $subject : '—') . "\n\n";
$body .= "Μήνυμα:\n{$message}\n";

// Envelope sender must be @isonomia.gr to align with the domain's DMARC
// policy — otherwise SPF/DKIM won't align and the message can get
// quarantined even though it "passes" generally.
$envelopeFrom = 'isonomia@isonomia.gr';

$headers   = [];
$headers[] = 'From: Φόρμα Ιστοσελίδας ΙΣΟΝΟΜΙΑ <' . $envelopeFrom . '>';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';

$sent = mail($to, $subjectLine, $body, implode("\r\n", $headers), '-f' . $envelopeFrom);

if ($sent) {
    echo json_encode(['success' => true]);
} else {
    respond_error('Κάτι πήγε στραβά κατά την αποστολή του μηνύματός σας. Παρακαλούμε δοκιμάστε ξανά ή επικοινωνήστε απευθείας μαζί μας.');
}
