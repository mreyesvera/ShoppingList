<?php
/*
    Author: Silvia Mariana Reyesvera Quijano - 000813686 
    Date: November 23rd, 2020

    This code receives an item id which will be used
    to identify and delete the respective item from the items table.
    If everything goes well it will return the item id
    of the deleted item.

    I didn't do a lot of error processing, if an error is found
    -1 is returned, otherwise the sent parameter is returned.
*/

include "connect.php"; // connect to the database

// retrieve parameter
$itemId = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

// validate parameters
if($itemId === false || $itemId === null){
    $result = -1;
} else {
    // delete the item from the items table
    $cmd = "DELETE FROM items WHERE item_id = ?";
    $stmt = $dbh->prepare($cmd);
    $params = [$itemId];
    $success = $stmt->execute($params);

    if($success === false){
        $result = -1;
    } else {
        $result = $itemId;
    }
}

echo $result;
