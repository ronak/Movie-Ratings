/*
    The MIT License

    Copyright (c) 2011 Ronak Patel

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
*/

var MovieRatings = (function() {    
    var movie = '';

    var loadMainResult = function(movie) {    
        $('#first-title-title').text(movie.title);
        $('#first-title-year').text('(' + movie.year + ')');
        
        $('#first-title').click(function() {            
            Util.openUrl(movie.links.alternate);
        });
        
        $('#poster').attr('src',movie.posters.thumbnail);

        // Is the movie fresh or rotten?
        if (movie.ratings.critics_score >= 60) 
            $('#first-critic-img').attr('class','tomato_med');    
        else if (movie.ratings.critics_score != -1)
            $('#first-critic-img').attr('class','rotten_med');
        
        // Has the movie been released in the theaters?    
        var releaseDate = Date.parse(movie.release_dates.theater);        
        if (releaseDate > new Date())
            $('#first-audience-img').attr('class','wanttosee_med');
        
        // Is there a critic rating?
        if (movie.ratings.critics_score != -1)
            $('#first-critic-rating').text(movie.ratings.critics_score+'%');
        else
            $('#first-critic-rating').text('N/A');
            
        $('#first-audience-rating').text(movie.ratings.audience_score+'%');        
    }
    
    var loadMoreResults = function(results) {
        for (var i = 1; i < results.length; i++) {
            var movie = results[i];
            
            var resultList = $('#more-results-list');        
            var li = $('<li>');
            li.append(createMoreResult(movie, i % 2 == 0 ? true : false));
            
            resultList.append(li);
        }    
    }
    
    var createMoreResult = function(movie, alternate) {
        // Create result box
        var result = $('<div>',{id:'result'});
        if (alternate)
            result.attr('class','alt');
        
        // Create result title
        var title = moreResult.Title(movie.title, movie.year);
        
        // Create result ratings
        var ratings = $('<div>',{id: 'result-ratings'});
            
        // Create critic rating    
        var critic = moreResult.CriticRating(movie.ratings.critics_score);
        
        // Create audience rating
        var audience = moreResult.AudienceRating(
            movie.ratings.audience_score,
            movie.release_dates.theater
        );
        
        ratings.append(critic);
        ratings.append(audience);
        
        result.append(title);
        result.append(ratings);        
        result.append($('<div>',{className:'clear'}));
        
        result.click(function() {
            Util.openUrl(movie.links.alternate);
        });
        
        return result;
    }
    
    var moreResult = {
        Title: function (movieTitle, movieYear) {
            var title = $('<div>',{id: 'result-title', text: movieTitle + ' '});    
            var year = $('<span>',{id: 'result-title-year', text: '(' + movieYear + ')'});    
            title.append(year);
            
            return title;
        },
        
        CriticRating: function(criticsScore) {
            var critic = $('<div>',{id: 'result-critic'});
            
            var rating = criticsScore;
            var criticRatingImg = $('<div>',{
                id: 'result-critic-img',
                'class': rating >= 60 ? 'tomato_sm' : 'rotten_sm'
            });
            if (rating == -1) criticRatingImg.removeAttr('class');
            var criticRating = $('<div>',{
                id: 'result-critic-rating',
                text: rating == -1 ? 'N/A' : rating + '%',
                'center': 'center'
            });
            critic.append(criticRatingImg);
            critic.append(criticRating);    

            return critic;
        },
        
        AudienceRating: function(audienceScore, releaseDate) {
            var audience = $('<div>',{id: 'result-audience'});
            var release = Date.parse(releaseDate);
            var audienceRatingImg = $('<div>',{
                id: 'result-audience-img',
                'class': release >= new Date() ? 'wanttosee_sm' : 'popcorn_sm'
            });
            var audienceRating = $('<div>',{
                id:'result-audience-rating', 
                text: audienceScore+'%',
                'class': 'center'
            });
            audience.append(audienceRatingImg);
            audience.append(audienceRating);    

            return audience;
        }
    }

    return {
        init: function(m) {
            movie = m;
        },
    
        loadResults: function(ratings) {                        
            if (ratings.total > 0) {
                loadMainResult(ratings.movies[0]);
                
                if (ratings.total > 1) {
                    loadMoreResults(ratings.movies);
                            
                    $('#more-results-link').click(function() {                    
                        $('#more-results-link').text(
                            $('#more-results-link').text() 
                                == 'More results' ? 'Hide results' : 'More results'
                        );
                        
                        $('#more-results-box').toggle();                                                
                    });
                    
                    if (ratings.total > 10) {
                        $('#even-more-results').click(function() {
                            Util.openUrl('http://www.rottentomatoes.com/search/full_search.php?search='+movie);
                        });
                        $('#even-more-results').show();
                    } else {
                        $('#even-more-results').hide();
                    }
                } else {
                    $('#more-results-link').hide();
                }
                
                $('#loading-box').hide();
                $('#results').show();
            } else {
                $('#loading-box').hide();
                $('#error').text('Could not find any results.');
            }
        },
        
        loadFooter: function() {
            $('#footer').click(function() {
                Util.openUrl('http://www.rottentomatoes.com');
            });
        }
    };
}());

var Util = (function() {
    return {
        isDefined: function(element) {
            if (element == undefined ||
                element == null ||
                element == '')
                return false;
            else
                return true;
        },
        
        openUrl: function(url) {        
            var browser = top.document.getElementById('content');
            var tab = browser.addTab(url);
        }
    };
}());

if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {    
        var parameters = $.parseQuery();
        var movie = '';
        var url = '';
        
        if (parameters) {
            movie = $.parseQuery().movie;
            url = Config.Url + '?callback=MovieRatings.loadResults&movie=' + encodeURI(movie);    
        }
        
        MovieRatings.loadFooter();
        
        if (Util.isDefined(movie)) {
            MovieRatings.init(movie);            
            $('#loading-box').show();
            $('#results').hide();
            
            $('#get-ratings').attr('src', url);
        } else {        
            $('#loading-box').text('Please select a movie.');
            $('#loading-box').show();
        }
    }, false);
}

