<?php
/*
    Author: Silvia Mariana Reyesvera Quijano - 000813686 
    Date: November 23rd, 2020

    This code receives an item name, quantity and category id
    in order to add a new item into the items table. If
    everything goes well it will return the category id.

    I didn't do a lot of error processing, if an error is found
    -1 is returned, otherwise the sent parameter is returned.
*/

// retrieve parameters
$item = filter_input(INPUT_GET, "itemInput", FILTER_SANITIZE_SPECIAL_CHARS);
$quantity = filter_input(INPUT_GET, "quantityInput", FILTER_VALIDATE_INT);
$category = filter_input(INPUT_GET, "categoryInput", FILTER_VALIDATE_INT);

// validate parameters
if($item === null || $item === "" || 
$quantity === null || $quantity === false ||
$category === null || $category === false){
    $result = -1;
} else if($quantity<1 || $quantity>1000){ // if the quantity value is out of range
    $result = -1;
} else {
    if (strlen($item)>40) // if the provided item name has more than 40 characters
        $item = $item.substr(0, 40); // only use the first 40

    include "connect.php"; // connect to the database

    $cmd = "INSERT INTO items(name, quantity, category_id) VALUES (?, ?, ?)";
    $stmt = $dbh->prepare($cmd);
    $params = [$item, $quantity, $category];
    $success = $stmt->execute($params);

    if($success === false){
        $result = -1;
    } else {
        $result = $category;
    }
}

echo $result;
