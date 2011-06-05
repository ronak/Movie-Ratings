<?php
    include 'ApiKey.php';  
    
    main();
    
    function main() {
        // add more error handling..try/catch for missing parameter
        // add caching
        $movie = $_GET['movie'];    
        $callback = $_GET['callback'];  
        
        if (!isDefined($movie) || !isDefined($callback)) {
            echo "Query string is missing parameters: ".
                "Movie: " . $movie . " Callback: " . $callback;
            return;
        }
        
        $rtResults = getRtResults($movie, API_KEY);
        
        echo $callback . '(' . $rtResults . ')';
    }
    
    function isDefined($x) {
        if (isset($x)) {
            $x = trim($x);
            // empty only works on variables
            if (!empty($x))
                return true;
        }               
        return false;
    }
       
    function getRtResults($movie, $apikey) {
        $searchUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey='.$apikey
            .'&q='.urlencode($movie).'&page=1&page_limit=10';
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $searchUrl);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $results = curl_exec($curl);
        
        return $results;
    }
?>