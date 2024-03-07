<?php
$conn = mysqli_connect("localhost", "root", "", "my_records");
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$sql = "SELECT * FROM drugs";
$result = mysqli_query($conn, $sql);

$drugs = array();
if (mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        $drugs[] = array(
            'id' => $row['id'],
            'name' => $row['name'],
            'description' => $row['description'],
            'price' => $row['price'],
            'stock' => $row['stock']
        );
    }
}

mysqli_close($conn);
header('Content-Type: application/json');
echo json_encode($drugs);
?>
