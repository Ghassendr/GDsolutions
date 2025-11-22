<?php
 
header('Content-Type: application/json');
 
$file = __DIR__ . "/numbers.txt";
 
if (!file_exists($file)) {
 
    file_put_contents($file, 0);
}
 
$count = (int)file_get_contents($file);
  
$count++;
  
file_put_contents($file, $count);
 
echo json_encode(["clicks" => $count]);

  ?>  