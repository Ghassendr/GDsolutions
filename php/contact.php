
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
    echo json_encode(["error" => "Champs obligatoires manquants."]);
    exit;
}
 
try {
    $pdo = new PDO("mysql:host=localhost;dbname=contact_form;charset=utf8", "root", "");
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->prepare("INSERT INTO messages (name, email, service, message, company, phone, budget) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$name, $email, $service, $message, $company, $phone, $budget]);

   
    $to = "ghassendarouich@gmail.com";
  
    $subject = "Nouveau contact site web : " . $name;
 
    $body = "Nouveau message reçu !\n\n";
    $body .= "Nom : $name\n";
    $body .= "Email Client : $email\n";
    $body .= "Message : \n$message\n";

  
    $headers = "From: ghassendarouich@gmail.com\r\n";
 
    $headers .= "Reply-To: " . $email . "\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(["success" => "Message enregistré et email envoyé !"]);
    } else {
        echo json_encode(["success" => "Message enregistré (mais échec envoi mail local)."]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur."]);
}
?>