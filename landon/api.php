<?php
$connn = new mysqli("localhost","root", "","user_log_in_db");

 // set the response type of our server responses
 header("Content-type: application/json");

 
 $method = $_SERVER['REQUEST_METHOD'];
 
 if($method == "GET"){
    $results = $connn -> query("SELECT * FROM user");
    $people = array();
    while($row = $results -> fetch_asso()){
        $people[]=$row;
    }
 }elseif ($method == "POST") {
    parse_str(file_get_contents("php://input"), $_POST);
    $email = $_POST["email"];
    $password = $_POST["password"];
    $connn -> query("INSERT INTO user (email, password) VALUES ('$email','$password')");
    
    echo json_encode(array("success" => true));
 }



 ?>