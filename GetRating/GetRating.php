<?php
    include 'ApiKey.php';

    $movie = $_GET['movie'];    
    $c = $_GET['callback'];    
            
    function get_search_results($movie, $apikey) {
        $searchUrl = 'http://api.rottentomatoes.com/api/public/v1.0/movies.json?apikey='.$apikey
            .'&q='.urlencode($movie).'&page=1&page_limit=10';
        
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $searchUrl);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
        $results = curl_exec($curl);
        
        return $results;
    }
    
    echo $c.'('.get_search_results($movie, API_KEY).')';
?>