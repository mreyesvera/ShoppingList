<?php
/*
    Author: Silvia Mariana Reyesvera Quijano - 000813686 
    Date: November 23rd, 2020

    This code receives an item id which will be used
    to identify an item in the items table in order
    to update its done attribute to the value of that
    of the second provided attribute. If everything
    goes well it will return the item id.

    I didn't do a lot of error processing, if an error is found
    -1 is returned, otherwise the sent parameter is returned.
*/

include "connect.php"; // connect to the database

// retrieve parameters
$itemId = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);
$done = filter_input(INPUT_GET, "done", FILTER_VALIDATE_INT);

// validate parameters
if($itemId === false || $itemId === null || $done === false || 
    $done === null || $done > 1 || $done < 0){
    $result = -1;
} else {
    // perform the update to the attribute done of the respective item
    $cmd = "UPDATE items SET done = ? WHERE item_id = ?";
    $stmt = $dbh->prepare($cmd);
    $params = [$done, $itemId];
    $success = $stmt->execute($params);

    if($success === false){
        $result = -1;
    } else {
        $result = $itemId;
    }
}

echo $result;