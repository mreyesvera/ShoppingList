/*
    Author: Silvia Mariana Reyesvera Quijano - 000813686 
    Date: November 23rd, 2020

    This code defines the events for different elements located 
    in the file index.html, allowing to properly add items to the
    shopping list, view them based on user preference, and delete
    the desired items and categories.
*/
window.addEventListener("load",
    /**
     * This is the main function that runs when the 
     * window is loaded, providing all of the described
     * functionality.
     */
    function () {
        let retrievedList;
        let currentSelectedIndex; // index of retrieved list of currently selected category
        let currentSelectedCategoryId; // category id of currently selected category

        // categories and items elements
        let categories = document.getElementById("categories");
        let categoryTitle = document.getElementById("categoryTitle");
        let itemsDisplayed = document.getElementById("items");

        // add category elements
        let newCategoryInput;
        let plusSign = document.getElementById("plusSign");
        let addCategory = document.getElementById("addCategory");

        // determines if the input field to add a category is displayed at the moment
        let addCategoryInputShown = false;

        // Add Item elements
        let itemInput = document.getElementById("itemInput");
        let quantityInput = document.getElementById("quantityInput");
        let categoryComboBox = document.getElementById("categoryComboBox");
        let submitButton = document.getElementById("submitButton");

        // Keep track of whether the value of the name and quantity inputs are valid
        let validName = false;
        let validQuantity = true;

        let maximumAmountTabs = 4; // maximum amount of categories
        let firstSetup = true;
        retrieveList();

        /**
         * Retrieves the shopping list information
         * from the database.
         */
        function retrieveList() {
            let url = "server/retrievelist.php";
            console.log(url);

            fetch(url, {
                    credentials: 'include'
                })
                .then(response => response.json())
                .then(setUpList)
        }

        /**
         * If an error is found when accessing the database
         * the following function runs, stoping the
         * program and displaying an error message.
         */
        function errorFound() {
            document.body.innerHTML = "<p>Something went wrong retrieving the list of data</p>";
        }

        /**
         * This function runs every time there is a change to the 
         * database in order to retrieve the list and update the view.
         * @param {Array} list 
         */
        function setUpList(list) {
            retrievedList = list;
            if (list === -1) { // if an error is found
                errorFound();
            } else {

                // adding the categories to the categories element
                let newCategory = "";
                let selected = -1;
                let selectedFound = false;
                categories.innerHTML = "";

                for (let i = 0; i < list.length; i++) {
                    newCategory = "<div class='tab category' id='category" + list[i].categoryId + "'>" +
                        "<span class='tabName'>" + list[i].name + "</span>" +
                        "<input class='categoryDelete' type='button' value='&times;'>" +
                        "</div>";
                    console.log("adding a category");

                    if (list[i].selected === 1 && !selectedFound) {
                        // if this category's selected attribute is 1
                        // and no other category with selected 1 has been found
                        // mark it to be selected
                        selected = i;
                        selectedFound = true;
                        currentSelectedCategoryId = list[i].categoryId;
                    } else if (list[i].selected === 1) {
                        // if this runs it means there is a data logic error
                        // because two categories had selected as 1
                        list[i].selected = 0;
                        console.log("need for update");
                    }

                    categories.innerHTML += newCategory;
                }
                if (list.length < maximumAmountTabs) { // if the amount of categories hasn't exceeded the limit
                    // add the add category button element
                    categories.innerHTML += "<div class='tab' id='addCategory'>" +
                        "<input id='newCategoryInput' type='text' name='newCategory' maxlength='15'>" +
                        "<span id='plusSign'>+</span>" +
                        "</div>";
                }

                // if no category was found to have the selected property to be 1
                if (!selectedFound) {
                    // make the selected to be the first one in the list
                    selected = 0;
                    currentSelectedCategoryId = list[0].categoryId;
                }
                currentSelectedIndex = selected;

                // adding the categories as options to the select input
                // where we can add items
                let newOption = "";
                categoryComboBox.innerHTML = "";
                for (let i = 0; i < list.length; i++) {
                    newOption = "<option " + isSelected(i) +
                        " value='" + list[i].categoryId +
                        "'>" +
                        list[i].name +
                        "</option>";

                    categoryComboBox.innerHTML += newOption;
                }

                /**
                 * Determines if the passed index 
                 * (from the retrieved list) corresponds
                 * to the current selected index 
                 * (meaning that this is the category
                 * for which items should be shown)
                 * @param {Integer} i 
                 * @returns A string that has "selected" or is empty
                 * respectively
                 */
                function isSelected(i) {
                    if (i === currentSelectedIndex) {
                        return "selected";
                    } else {
                        return "";
                    }
                }

                // Removing the delete button from the category that is currently selected
                // and styling appropriately
                let thisCategory = document.querySelector("#category" + currentSelectedCategoryId + " .categoryDelete");
                thisCategory.style.display = "none";
                let currentTab = document.getElementById("category" + currentSelectedCategoryId);
                currentTab.style.backgroundColor = "white";

                // if the add category button has been added
                if (retrievedList.length < maximumAmountTabs) {
                    // hide the input field and instead just show the plus sign
                    newCategoryInput = document.getElementById("newCategoryInput");
                    plusSign = document.getElementById("plusSign");

                    newCategoryInput.style.display = "none";
                    plusSign.style.display = "inline";
                }

                updateItems(); // adding the items to be displayed
            }

            if (firstSetup) {
                initialEventListeners();
                firstSetup = false;
            }
            addEventListeners();

            /**
             * Adds the event listeners to the
             * required elements.
             */
            function addEventListeners() {
                // getting the categories
                let categoryTabs = document.querySelectorAll(".category");

                // adding event listeners to child elements of each category
                categoryTabs.forEach(function (categoryTab) {
                    let tabName = document.querySelector("#" + categoryTab.id + " .tabName");
                    let categoryDelete = document.querySelector("#" + categoryTab.id + " .categoryDelete");

                    let categoryId = categoryTab.id.slice(8, categoryTab.id.length);

                    // adding an event listener to the categories name elements
                    tabName.addEventListener("click", tabNameClicked);

                    /**
                     * Event listener function for when the tab name 
                     * (name of a category) is clicked. 
                     * This changes the selected item to the one clicked.
                     */
                    function tabNameClicked() {
                        let previousCategoryId = currentSelectedCategoryId;

                        // if the name of different category than the one shown was clicked
                        if (currentSelectedCategoryId !== categoryId) {
                            // change the selected to be the category clicked
                            let url = "server/changeSelected.php?new=" + categoryId;

                            fetch(url, {
                                    credentials: 'include'
                                })
                                .then(response => response.text())
                                .then(needForUpdate)
                        }

                        // change the display of the delete buttons and the styling
                        // approriately to the change of selected category
                        let previousButton = document.querySelector("#category" + previousCategoryId + " .categoryDelete");
                        let currentButton = document.querySelector("#" + categoryTab.id + " .categoryDelete");

                        previousButton.style.display = "inline";
                        currentButton.style.display = "none";

                        let previousTab = document.getElementById("category" + previousCategoryId);
                        let currentTab = document.getElementById(categoryTab.id);

                        previousTab.style.backgroundColor = "#d9d9d9";
                        currentTab.style.backgroundColor = "white";
                    }

                    // adding an event listener to the categories' delete buttons
                    categoryDelete.addEventListener("click", deleteCategory);

                    /**
                     * Event listener function for when a category delete
                     * button is clicked.
                     * This deletes the corresponding category
                     * and any of its items.
                     */
                    function deleteCategory() {
                        let url = "server/deleteTab.php?toDelete=" + categoryId;

                        fetch(url, {
                                credentials: 'include'
                            })
                            .then(response => response.text())
                            .then(needForUpdate);
                    }
                });

                // getting the displayed items
                let itemtds = document.querySelectorAll(".itemtd");

                // adding event listeners to the displayed items child elements
                itemtds.forEach(
                    /**
                     * Adds event listeners to child elements
                     * of each item element displayed.
                     * @param {Integer} itemtd 
                     */
                    function (itemtd) {
                        let doneCheckbox = document.querySelector("#" + itemtd.id + " .doneCheckbox");
                        let toDeleteItem = document.querySelector("#" + itemtd.id + " .deleteItem");


                        let itemId = itemtd.id.slice(13, itemtd.id.length);

                        // adding an event listener to the items checkboxes
                        doneCheckbox.addEventListener("change", doneCheckBoxChange)

                        /**
                         * Event listener function for when the checkboxes of
                         * the displayed items are clicked. It changes the
                         * done attribute of the item appropriately. 
                         */
                        function doneCheckBoxChange() {
                            if (this.checked) { // if the item has been checked
                                // set the item's done attribute to one 
                                let url = "server/changeDoneItem.php?id=" + itemId + "&done=" + 1;

                                fetch(url, {
                                        credentials: 'include'
                                    })
                                    .then(response => response.text())
                                    .then(needForUpdate);
                            } else { // if the item has been unchecked
                                // set the item's done attribute to zero
                                let url = "server/changeDoneItem.php?id=" + itemId + "&done=" + 0;

                                fetch(url, {
                                        credentials: 'include'
                                    })
                                    .then(response => response.text())
                                    .then(needForUpdate);
                            }
                        }

                        // adding an event listener to the trashcan image of each item
                        toDeleteItem.addEventListener("click", deleteItem);

                        /**
                         * Event listener function for deleting an item.
                         * This is applied to the traschan image next to 
                         * each item.
                         */
                        function deleteItem() {
                            let url = "server/deleteItem.php?id=" + itemId;

                            fetch(url, {
                                    credentials: 'include'
                                })
                                .then(response => response.text())
                                .then(needForUpdate);
                        }
                    });

                // if the add category button is displayed
                if (retrievedList.length < maximumAmountTabs) {
                    // add an event listener for when the add category tab 
                    // or the plus sign are clicked

                    addCategory = document.getElementById("addCategory");
                    addCategory.addEventListener("click", addingCategory);


                    plusSign = document.querySelector("#addCategory #plusSign");
                    plusSign.addEventListener("click", addingCategory);
                }
            }

            /**
             * Event listener function for adding a category. 
             * Adds a category in the server, and updates the list,
             * which will now have an extra tab with the category's name.
             */
            function addingCategory() {
                addCategory = document.getElementById("addCategory");
                plusSign = document.querySelector("#addCategory #plusSign");

                // removes the event listeners to avoid multiple event listeners
                // being added (causing trouble)
                addCategory.removeEventListener("click", addingCategory);
                plusSign.removeEventListener("click", addingCategory);

                addCategoryInputShown = true;

                // display now the input to enter the category name
                newCategoryInput.style.display = "inline";
                plusSign.style.display = "none";

                // add an event listener to this input
                newCategoryInput.addEventListener("keyup", enterTabEvent);
            }

            /**
             * Event listener function for new category input field,
             * allowing to add the category by just clicking enter.
             * @param {Event} event 
             */
            function enterTabEvent(event) {
                if (event.key === "Enter") { // if the user clicks the enter key
                    // add the category to the list of categories in the database
                    let url = "server/addTab.php?name=" + newCategoryInput.value +
                        "&id=" + (retrievedList[retrievedList.length - 1].categoryId + 1);
                    console.log(url);

                    fetch(url, {
                            credentials: 'include'
                        })
                        .then(response => response.json())
                        .then(needForUpdate)
                }
            }

            /**
             * Adds the event listeners that should only be 
             * added when the page is loaded.
             */
            function initialEventListeners() {

                // adding an event listener to the document being clicked
                document.addEventListener("click", updatingAddCategory);

                /**
                 * Event listener function for when there is a click
                 * in the document. This event is linked to the 
                 * adding a category event, because it allows for the input
                 * to disappear if the user clicks outside of he field
                 * add the event listener to addCategory if it isn't added yet. 
                 * @param {Event} event 
                 */
                function updatingAddCategory(event) {
                    // if the add category tab is being displayed
                    if (retrievedList.length < maximumAmountTabs) {
                        // if the click was outside of the add category tab
                        if (!addCategory.contains(event.target) && !plusSign.contains(event.target) && !newCategoryInput.contains(event.target)) {
                            // display the plus sign instead of the input
                            newCategoryInput.style.display = "none";
                            plusSign.style.display = "inline";

                            // if the add category input was shown before this function ran
                            if (addCategoryInputShown) {
                                // add the event listener again to the add category tab
                                addCategory.addEventListener("click", addingCategory);
                                addCategoryInputShown = false; // state the input is not shown anymore
                            }
                        }
                    }
                }

                submitButton.disabled = true; // disable the submit button

                submitButton.addEventListener("click",
                    /**
                     * Event listener function for when the submit button is clicked
                     * to add a new item.
                     */
                    function () {
                        let submitError = document.getElementById("submitError");

                        // if the name and quantity values are valid
                        if (validName && validQuantity) {
                            // add the item
                            let url = "server/addItem.php?" +
                                "itemInput=" + itemInput.value +
                                "&quantityInput=" + quantityInput.value +
                                "&categoryInput=" + categoryComboBox.value;

                            fetch(url, {
                                    credentials: 'include'
                                })
                                .then(response => response.text())
                                .then(addItem);
                        } else {
                            submitError.innerHTML = "missing elements";
                        }
                    });

                /**
                 * Retrieves the added list after an item has been added 
                 * and updates what should be updated. 
                 * @param {Array or Integer} result 
                 */
                function addItem(result) {
                    // reset the input fields and set state the name is now not valid once again
                    itemInput.value = "";
                    quantityInput.value = "1";
                    validName = false;
                    updateSubmit(); // update the submit button to disable it again
                    needForUpdate(result); // update the view of categories and items
                }


                // adding an event listener to validate user input
                itemInput.addEventListener("keyup", validateItemField);

                /**
                 * Event listener functions for the item input field.
                 * Allows to validate what was entered, provide feedback,
                 * and if the enter event is clicked, add the item if
                 * everything is valid. 
                 * @param {Event} event 
                 */
                function validateItemField(event) {
                    // span next to the item title used to display an error message if needed
                    let itemInputError = document.getElementById("itemInputError");

                    if (itemInput.value === "") { // input field is empty
                        itemInputError.innerHTML = "- missing"
                        itemInput.style.backgroundColor = "#db5858";
                        validName = false;

                    } else { // input field value is not empty
                        itemInputError.innerHTML = ""
                        itemInput.style.backgroundColor = "white";
                        validName = true;
                    }

                    if (event.key === "Enter") { // the key pressed was the Enter key
                        // if the submit button is not disabled, then run its click event
                        if (!submitButton.disabled)
                            submitButton.click();
                    }

                    updateSubmit(); // update the submit button
                }

                // adding event listeners to the quantity input for when the value
                // changes (allows to intake change from the up and down arrows as well) and for keyup
                quantityInput.addEventListener("change", validateQuantityField);
                quantityInput.addEventListener("keyup",
                    /**
                     * Event listener function for the quantity input field
                     * to check if the user clicked enter and if everything
                     * is valid, add the item. 
                     * @param {Event} event 
                     */
                    function (event) {
                        if (event.key === "Enter") {
                            if (!submitButton.disabled)
                                submitButton.click();
                        }
                    });

                /**
                 * Event listener function for the quantity input field
                 * to check if the value entered is valid or not and
                 * provide appropriate feedback. 
                 */
                function validateQuantityField() {
                    // span next to quantity title used to display error message if there is one
                    let quantityInputError = document.getElementById("quantityInputError");
                    let value = quantityInput.value;

                    if (value === "") { // input field is empty
                        quantityInputError.innerHTML = "- missing"
                        quantityInput.style.backgroundColor = "#db5858";
                        validQuantity = false;

                    } else if (!(value % 1 === 0) || parseInt(value) < 1 || parseInt(value) > 1000) {
                        //input field value is invalid
                        quantityInputError.innerHTML = "- invalid"
                        quantityInput.style.backgroundColor = "#db5858";
                        validQuantity = false;
                    } else { // input field value is not empty and is valid
                        quantityInputError.innerHTML = ""
                        quantityInput.style.backgroundColor = "white";
                        validQuantity = true;
                    }

                    updateSubmit(); // updating the submit button
                }

                // adding an event listener to the category combo box input
                categoryComboBox.addEventListener("change",
                    /**
                     * Checks if value (category id) of the selected option
                     * is the same as the one of the category currently showing.
                     * If it's not, then it changes the view to show the 
                     * category from the selected option.
                     */
                    function () {
                        if (this.value !== currentSelectedCategoryId) {
                            let tabName = document.querySelector("#category" + this.value + " .tabName");
                            tabName.click(); // change the selected category to the one with the corresponding category id
                        }
                    });

                /**
                 * Checks if the the name and quantity fields
                 * are valid and if so it enables the submit button
                 * or disables it otherwise.
                 */
                function updateSubmit() {
                    // if the name and quantity are valid
                    if (validName && validQuantity) {

                        // enable the button
                        submitButton.disabled = false;
                        submitButton.classList.add("submitHoverEffect");
                    } else {

                        // disable the button
                        submitButton.disabled = true;
                        submitButton.classList.remove("submitHoverEffect");
                    }
                }
            }
        }

        /**
         * Updates the displayed items from the retrieved list based
         * on the current selected category.
         */
        function updateItems() {

            // create the items elements and add them to the itemsDisplayed
            itemsDisplayed.innerHTML = "";
            let itemToDisplay = "";
            let currentItems = retrievedList[currentSelectedIndex].items;
            for (let i = 0; i < currentItems.length; i++) {
                itemToDisplay = "<tr class='itemtd' id='currentitemtd" + currentItems[i].itemId + "'>" +
                    "<td><input class='doneCheckbox' type='checkbox' " + isDone(currentItems[i].done) + "></td>" +
                    "<td class='item' id='currentItem" + currentItems[i].itemId + "'>" +
                    currentItems[i].name + " ( " + currentItems[i].quantity + " )" +
                    "</td>" +
                    "<td><img class='deleteItem' src='img/trashcan_resized.png'></td>" +
                    "</tr>";

                itemsDisplayed.innerHTML += itemToDisplay;
            }

            // change the displayed title for the items
            categoryTitle.innerHTML = retrievedList[currentSelectedIndex].name + " Items:";

            /**
             * Checks if the value of done is 1,
             * done being an attribute of the item,
             * which determines whether the item
             * has been checked by the user or not.
             * @param {Integer} done 
             * @returns Either nothing "checked" respectively
             */
            function isDone(done) {
                if (done === 1) {
                    return "checked";
                } else {
                    return "";
                }
            }
        }

        /**
         * Checks if the provided parameter
         * indicates an error. If there is no 
         * error it goes on to retrieve the list
         * and display it later on through another method.
         * @param {Integer} result 
         */
        function needForUpdate(result) {
            if (result === -1) {
                errorFound();
            } else {
                retrieveList();
            }
        }
    });