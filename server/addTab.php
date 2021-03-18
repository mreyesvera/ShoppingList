<?php
/*
    Author: Silvia Mariana Reyesvera Quijano - 000813686 
    Date: November 23rd, 2020

    This code receives a name and id in order to add a 
    new category into the categories table with these
    respective values. If everythings goes well, it will
    return the created category.

    I didn't do a lot of error processing, if an error is found
    -1 is returned, otherwise the sent parameter is returned.
*/

include "connect.php"; // connect to the database
$name = filter_input(INPUT_GET, "name", FILTER_SANITIZE_SPECIAL_CHARS);
$id = filter_input(INPUT_GET, "id", FILTER_VALIDATE_INT);

// validate parameters
if($name === null || $id === null || $id === false){
    $result = -1;
} else {
    if ($name === "") // if no name was provided
        $name = "New"; // set name to New

    if (strlen($name) > 15) // if the length of the name is more than 15
        $name = $name.substr(0, 15); // only use the first 15 characters
    
    // add the category into the categories table and mark as selected
    $cmd = "INSERT INTO categories (category_id, name, selected) VALUES (?, ?, ?)";
    $stmt = $dbh->prepare($cmd);
    $params = [$id, $name, 1];
    $success = $stmt->execute($params);

    if($success === false){
        $result = -1;
    } else {
        // update other categories' selected value to 0
        $cmd = "UPDATE categories SET selected = 0 WHERE category_id <> ?";
        $stmt = $dbh->prepare($cmd);
        $params = [$id];
        $success = $stmt->execute($params);

        if($success === false){
            $result = -1;
        } else {
            // retrieve the added category
            $cmd = "SELECT category_id, name, selected FROM categories WHERE category_id = ?";
            $stmt = $dbh->prepare($cmd);
            $params = [$id];
            $success = $stmt->execute($params);
            
            if($success === false){
                $result = -1;
            } else {
                $result = -1;

                // save the added category into an associative array
                if($row = $stmt->fetch()){
                    $items = [];
                    $category = ["categoryId" => (int)$row["category_id"],
                    "name" => $row["name"], "selected" => (int)$row["selected"],
                    "items" => $items];
                    $result = $category;
                }

                
            }
        }
    }
}

echo json_encode($result); // return either an error value or the added category