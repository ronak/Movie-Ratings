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
    var _rImdbRating = /\d+\.\d\/10/;
    var _rImdbLink = /www\.imdb\.com\/title\/[a-z0-9]*/;
    var _movie = '';
    var _movieTitles = [];
    var _currentDate = new Date();

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
        
        getImdbRating(movie.title, movie.year, '#first-imdb', '#first-imdb-rating');
    }
    
    var loadMoreResults = function(results) {        
        for (var i = 1; i < results.length; i++) {
            var movie = results[i];
            
            var resultList = $('#more-results-list');        
            var li = $('<li>').append(
                createMoreResult(movie, i % 2 == 0 ? true : false, i)                
            );
            
                             
            _movieTitles.push({'id':i,'title':movie.title,'year':movie.year});            
            
            resultList.append(li);
        }    
    }
    
    var createMoreResult = function(movie, alternate, idNum) {
        // Create result box
        var result = $('<div>',{'class':'result'});
        if (alternate)
            result.attr('class','result alt');
        
        // Create result title
        var title = MoreResult.Title(movie.title, movie.year);
        
        // Create result ratings
        var ratings = $('<div>',{'class': 'result-ratings'});
            
        // Create critic rating    
        var critic = MoreResult.CriticRating(movie.ratings.critics_score);
        
        // Create audience rating
        var audience = MoreResult.AudienceRating(
            movie.ratings.audience_score,
            movie.release_dates.theater
        );
        
        // Create IMDb rating box
        var imdb = MoreResult.ImdbRating(idNum);
        
        ratings.append(critic);
        ratings.append(audience);
        ratings.append(imdb);       
        
        result.append(title);
        result.append(ratings);        
        result.append($('<div>',{'class':'clear'}));
        
        result.click(function() {
            Util.openUrl(movie.links.alternate);
        });
        
        return result;
    }
    
    var MoreResult = {
        Title: function (movieTitle, movieYear) {
            var title = $('<div>',{'class': 'result-title', text: movieTitle + ' '});    
            var year = $('<span>',{'class': 'result-title-year', text: '(' + movieYear + ')'});    
            title.append(year);
            
            return title;
        },
        
        CriticRating: function(criticsScore) {
            var critic = $('<div>',{'class': 'result-critic'});
            
            var rating = criticsScore;
            var criticRatingImg = $('<div>',{
                'class': (rating >= 60 ? 'tomato_sm' : 'rotten_sm') + ' result-critic-img'
            });
            if (rating == -1) criticRatingImg.removeAttr('class');
            var criticRating = $('<div>',{
                text: rating == -1 ? '' : rating + '%',
                'class': 'center result-critic-rating'
            });
            critic.append(criticRatingImg);
            critic.append(criticRating);    

            return critic;
        },
        
        AudienceRating: function(audienceScore, releaseDate) {
            var audience = $('<div>',{'class': 'result-audience'});
            var audienceRatingImg = $('<div>',{                
                'class': (Date.parse(releaseDate) > _currentDate ? 'wanttosee_sm' : 'popcorn_sm') + ' result-audience-img'
            });
            var audienceRating = $('<div>',{                
                text: audienceScore+'%',
                'class': 'center result-audience-rating'
            });
            audience.append(audienceRatingImg);
            audience.append(audienceRating);    

            return audience;
        },
        
        ImdbRating: function(idNum) {
            var imdb = $('<div>',{
                id: 'result-imdb-'+idNum,
                'class': 'result-imdb',
                text: 'IMDb: '
            });
            var imdbRating = $('<span>',{
                id: 'result-imdb-rating-'+idNum
            });
            imdb.append(imdbRating);
            
            return imdb;
        }
    }
    
    var getImdbRating = function(movie, year, imdbDivId, imdbRatingDivId) {     
        var movieSearch = movie + ' (' + year + ')';
        $.ajax({
            url: "https://www.google.com/search?q=" + encodeURI(movieSearch + ' site:imdb.com'),
            success: function(html) {                
                var link = _rImdbLink.exec(html);
                
                $.ajax({
                    url: Config.Url + '/imdb?link=' + link,
                    success: function(rating) {
                        if (!Util.isDefined(rating))
                            rating = 'N/A';
                        
                        $(imdbRatingDivId).text(escape(rating)); 
                        $(imdbRatingDivId).click(function() {
                            Util.openUrl('http://' + link);
                        });
                        $(imdbDivId).show();       
                    }
                });          
            }
        });
    }

    return {
        init: function(m) {
            _movie = m;
        },
    
        loadResults: function(ratings) {             
            if (ratings.total > 0) {
                loadMainResult(ratings.movies[0]);
                
                if (ratings.total > 1) {
                    loadMoreResults(ratings.movies);
                            
                    $('#more-results-link').click(function() {                    
                        $('#more-results-link').hide();                        
                        $('#more-results-box').show();        
                       
                        for (var i = 0; i < _movieTitles.length; i++) {
                            var title = _movieTitles[i].title;
                            var year = _movieTitles[i].year;
                            var id = _movieTitles[i].id;
                            getImdbRating(title, year, '#result-imdb-'+id, '#result-imdb-rating-'+id);
                        }                        
                    });
                    
                    if (ratings.total > 10) {
                        $('#even-more-results').click(function() {
                            Util.openUrl('http://www.rottentomatoes.com/search/?search='+_movie);
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
            window.open(url);
        }    
    };
}());

$(document).ready(function() {
    var movie = $.parseQuery().movie;
    var url = Config.Url + '/rt?callback=MovieRatings.loadResults&movie=' + encodeURI(movie);    
    
    if (Util.isDefined(movie)) {
        MovieRatings.init(movie);
        $('#loading-box').show();
        $('#results').hide();
        
        $('#get-ratings').attr('src', url);
    } else {        
        $('#loading-box').text('Please select a movie.');
        $('#loading-box').show();        
    }
    
    MovieRatings.loadFooter();
});
