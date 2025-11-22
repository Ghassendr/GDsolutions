<?php
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Méthode non autorisée"]);
    exit;
}

$name     = trim($_POST["name"] ?? "");
$email    = trim($_POST["email"] ?? "");
$service  = trim($_POST["service"] ?? "");
$message  = trim($_POST["message"] ?? "");
$company  = trim($_POST["company"] ?? "");
$phone    = trim($_POST["phone"] ?? "");
$budget   = trim($_POST["budget"] ?? "");

 
if ($name === "" || $email === "" || $service === "" || $message === "") {
    http_response_code(400);
    echo json_encode(["error" => "Veuillez remplir tous les champs obligatoires."]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["error" => "Email invalide."]);
    exit;
}

 
session_start();
if (isset($_SESSION["last_submit"]) && time() - $_SESSION["last_submit"] < 10) {
    http_response_code(429);
    echo json_encode(["error" => "Vous envoyez trop vite. Réessayez dans quelques secondes."]);
    exit;
}
$_SESSION["last_submit"] = time();

try {
     
    $pdo = new PDO("mysql:host=localhost;dbname=contact_form;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  
    $stmt = $pdo->prepare("INSERT INTO messages 
        (name, email, service, message, company, phone, budget)
        VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->execute([$name, $email, $service, $message, $company, $phone, $budget]);

    
    http_response_code(200);
    echo json_encode(["success" => "Message enregistré avec succès"]);

} catch (Exception $e) {
    http_response_code(500);
    error_log("DB Error: " . $e->getMessage());
    echo json_encode(["error" => "Erreur lors de l'enregistrement : " . $e->getMessage()]);
    exit;
}
?>