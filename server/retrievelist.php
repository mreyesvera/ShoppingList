<?php
/*
    Author: Silvia Mariana Reyesvera Quijano - 000813686 
    Date: November 23rd, 2020

    This code retrieves the shopping list by creating an
    associative array of categories, within which an
    associative array of items is found for each category.
    This result is then returned. 

    I didn't do a lot of error processing, if an error is found
    -1 is returned, otherwise the sent parameter is returned.
*/

/*
    This class represents a category for shopping list items. 
*/
class Category {
    public $categoryId;
    public $name;
    public $selected; // determins if this category is selected from all at the moment
    public $items;

    /*
        Class constructor
        Sets all of the object's attributes except for the items. 
    */
    public function __construct($categoryId, $name, $selected){
        $this->categoryId = $categoryId;
        $this->name = $name;
        $this->selected = $selected;
    }

    /*
        Set the items to the value of the parameter.
        No return
    */
    public function set_items($items){
        $this->items = $items;
    }
}

/*
    This class represents a shopping list item. 
*/
class Item {
    public $itemId;
    public $name;
    public $quantity;
    public $categoryId;
    public $done;

    /*
        Class constructor
        Sets all of the object's attributes to those from the arguments.
    */
    public function __construct($itemId, $name, $quantity, $categoryId, $done){
        $this->itemId = $itemId;
        $this->name = $name;
        $this->quantity = $quantity;
        $this->categoryId = $categoryId;
        $this->done = $done;
    }
}


include "connect.php"; // connect to the database

$cmd = "SELECT category_id, name, selected FROM categories ORDER BY category_id";
$stmt = $dbh->prepare($cmd);
$success = $stmt->execute();

if($success === false){
    $result = -1;
} else {
    $result = []; // associative array to store the categories with their items

    // get the categories and add them to $result
    while($row = $stmt->fetch()){
        $category = new Category((int)$row["category_id"], $row["name"], (int)$row["selected"]);
        $result[] =  $category;
    }

    $cmd = "SELECT item_id, name, quantity, category_id, done FROM items ORDER BY done, name";
    $stmt = $dbh->prepare($cmd);
    $success = $stmt->execute();

    if($success === false){
        $result = -1;
    } else {
        $items = []; // associative array to store all items

        // get the items and add them to $items
        while($row = $stmt->fetch()){
            $item = new Item((int)$row["item_id"], $row["name"], (int)$row["quantity"], (int)$row["category_id"], (int)$row["done"]);
            $items[] = $item;
        } 

        $categoryItems = []; // associative array to store one category's items at a time

        // going through the categories
        foreach($result as $category){
            // check each item from the list
            foreach($items as $item){
                // if the category id matches
                if($item->categoryId === $category->categoryId){
                    $categoryItems [] = $item; // add it to the categoryItems array
                }
            }
            $category->set_items($categoryItems); // add the array to the appropriate category
            $categoryItems = []; // reset the categoryItems array
        }
    }
}

echo json_encode($result); // return the shopping list