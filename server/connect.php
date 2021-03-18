<?php

/**
 * Include this to connect. Change the dbname to match your database,
 * and make sure your login information is correct after you upload 
 * to csunix or your app will stop working.
 * 
 * Sam Scott, Mohawk College, 2019
 * edited by: Silvia Mariana Reyesvera Quijano, 000813686, 2020-10-21
 */
try {
    /* Not included for security reasons */
} catch (Exception $e) {
    die("ERROR: Couldn't connect. {$e->getMessage()}");
}
