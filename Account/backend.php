<?php
// Connection to your database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "Items";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Insert data
if ($_SERVER["REQUEST_METHOD"] == "POST" && !empty($_POST["name"]) && !empty($_POST["email"]) && empty($_POST["id"])) {
    $name = $_POST["name"];
    $email = $_POST["email"];

    $sql = "INSERT INTO users (name, email) VALUES ('$name', '$email')";
    $result = $conn->query($sql);
}

// Delete data
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] == "delete") {
    $id = $_POST["id"];

    $sql = "DELETE FROM users WHERE id = '$id'";
    $result = $conn->query($sql);
}
// Update data
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["action"]) && $_POST["action"] == "update"
    && !empty($_POST["id"]) && !empty($_POST["name"]) && !empty($_POST["email"])) {
    $id = $_POST["id"];
    $name = $_POST["name"];
    $email = $_POST["email"];

    $sql = "UPDATE users SET name='$name', email='$email' WHERE id='$id'";
    $result = $conn->query($sql);
}

// select single user 
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["action"]) && $_GET["action"] == "select-single") {
    header("Content-Type: application/json");

    $id =  $_GET["id"];

    $sql =  "SELECT * FROM users WHERE id='$id'";
    $result =  $conn-> query($sql);
    $user =  $result -> fetch_assoc();

    echo json_encode($user);
} else {
    

   // Fetch data
    $sql = "SELECT * FROM users";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            echo "<tr>";
            echo "<td>".$row["name"]."</td>";
            echo "<td>".$row["email"]."</td>";
            echo "<td><button class='deleteBtn' data-id='".$row["id"]."'>Delete</button></td>";
            echo "<td><button class='editBtn' data-id='".$row["id"]."'>Edit</button></td>";
            echo "</tr>";
        }
    } else {
        echo "<tr><td colspan='3'>No data found</td></tr>";
    }
}



$conn->close();

