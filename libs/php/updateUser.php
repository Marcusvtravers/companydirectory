<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;

}	


$id = $_POST['updateId'];
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['email'];
$department = $_POST['department'];


$sqldep = "SELECT id from department WHERE id = '$department'";
$result2 = $conn->query($sqldep);
$arr=[];
while ($row = mysqli_fetch_assoc($result2)){
    array_push($arr, $row);
};

$var = $arr[0]['id'];


$sql = "UPDATE personnel set firstName='$firstName', lastName='$lastName', email='$email', departmentID='$var' WHERE id=$id";

$result = $conn->query($sql);

$sqlcon = "SELECT * from personnel WHERE id = $id";
$result3 = $conn->query($sqlcon);
$array=[];
while ($row = mysqli_fetch_assoc($result3)){
    array_push($array, $row);
};


echo json_encode($array);




if (!$result) {

    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";	
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 

    exit;

}

$conn->close();
