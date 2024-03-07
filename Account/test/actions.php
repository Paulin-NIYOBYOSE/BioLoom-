<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $conn = mysqli_connect("localhost", "root", "", "my_records");

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    // Add new drug record
    if (isset($_POST['action']) && $_POST['action'] == 'add') {

        $name = mysqli_real_escape_string($conn, $_POST['name']);
        $description = mysqli_real_escape_string($conn, $_POST['description']);
        $price = $_POST['price'];
        $stock = $_POST['stock'];

        $sql = "INSERT INTO drugs (name, description, price, stock) VALUES ('$name', '$description', $price, $stock)";

        if (mysqli_query($conn, $sql)) {
            echo "New record added successfully";
        } else {
            echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        }
    }
    

    // Delete multiple drug records
    if (isset($_POST['action']) && $_POST['action'] == 'delete_multiple') {

        $selectedIds = json_decode($_POST['ids']);

        $sql = "DELETE FROM drugs WHERE id IN (".implode(",", $selectedIds).")";

        if (mysqli_query($conn, $sql)) {
            echo "Selected records deleted successfully";
        } else {
            echo "Error: " . $sql . "<br>" . mysqli_error($conn);
        }
    }

    mysqli_close($conn);
}
?>
