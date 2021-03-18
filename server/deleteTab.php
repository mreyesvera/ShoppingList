<?php
/*
    Author: Silvia Mariana Reyesvera Quijano - 000813686 
    Date: November 23rd, 2020

    This code receives a category id which will be used
    to identify and delete the respective items from the items table 
    and the respective category from the categories table. 
    If everything goes well it will return the category
    id of the deleted category. 

    I didn't do a lot of error processing, if an error is found
    -1 is returned, otherwise the sent parameter is returned.
*/

include "connect.php"; // connect to the database

// retrieve parameter
$toDelete = filter_input(INPUT_GET, "toDelete", FILTER_VALIDATE_INT);

// validate parameters
if($toDelete === false || $toDelete === null){
    $result =  -1;
} else {
    // check if the provided category id exists
    $cmd = "SELECT category_id FROM categories WHERE category_id = ?";
    $stmt = $dbh->prepare($cmd);
    $params = [$toDelete];
    $success = $stmt->execute($params);

    if($success === false){
        $result = -1;
    } else {
        if($row = $stmt->fetch()){
            // if the category exists, delete all of the categories items from the items table
            $cmd = "DELETE FROM items WHERE category_id = ?";
            $stmt = $dbh->prepare($cmd);
            $params = [$toDelete];
            $success = $stmt->execute($params);

            if($success === false){
                $result = -1;
            } else {
                // delete the category from the categories table
                $cmd = "DELETE FROM categories WHERE category_id = ?";
                $stmt = $dbh->prepare($cmd);
                $params = [$toDelete];
                $success = $stmt->execute($params);

                if($success === false){
                    $result = -1;
                } else {
                    $result = $toDelete;
                }
            }
        }
        else {
            $result = -1;
        }
    }
}

echo $result;