<?php
/*
    Author: Silvia Mariana Reyesvera Quijano - 000813686 
    Date: November 23rd, 2020

    This code receives a category id which will be used
    to identify a category in the categories table in order
    to update its selected attribute to 1 and change all others
    back to 0. If everything goes well it will return the
    provided category id.

    I didn't do a lot of error processing, if an error is found
    -1 is returned, otherwise the sent parameter is returned.
*/

include "connect.php"; // connect to the database

// retrieve parameter
$new = filter_input(INPUT_GET, "new", FILTER_VALIDATE_INT);

// validate parameters
if($new === false || $new === null){
    $result = -1;
} else {
    // change the category's selected attribute to 1
    $cmd = "UPDATE categories SET selected = 1 WHERE category_id = ?";
    $stmt = $dbh->prepare($cmd);
    $params = [$new];
    $success = $stmt->execute($params);

    if($success === false){
        $result = -1;
    } else {
        // change other categories' selected attribute to 0
        $cmd = "UPDATE categories SET selected = 0 WHERE category_id <> ?";
        $stmt = $dbh->prepare($cmd);
        $params = [$new];
        $success = $stmt->execute($params);

        if($success === false){
            $result = -1;
        } else {
            $result = $new;
        }
    }
}

echo $result;