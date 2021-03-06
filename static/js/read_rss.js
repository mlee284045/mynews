$(document).ready(function() {
    var $rssDiv = $('#newRssFeed');
    var allKeywords = [];

    var allEntries = [];
    var urlsLoaded = [];

    function Keyword(newWord) {
        this.word = newWord;
        this.vote = 0;

        this.upVote = function() {
            this.vote += 1;
        };

        this.downVote = function() {
            this.vote -= 1;
        };
    }

//=====================================================================
// This is just to allow me to make ajax calls freely
// it's from the django docs, https://docs.djangoproject.com/en/1.7/ref/contrib/csrf/

    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
// =====================================================================
// This is the google feed api call that I used, it is slightly different from the example on the
// google feed api site.  This worked for me and my situation but there are other ways of doing it.
// I also did some hacky(not good) thing by loading it earlier in another file called google_feed.js

    function getRssFeed () {
        // Gets all stored feeds from user and sends it to google feed api to get the articles
        // Articles are put onto the page using the function appendEntries
        //
        // put into a function wrapper to help control and debug project
        function googleApiCall(urls) {
            console.log("googleApiCall")
            google.load("feeds", "1", {
                // make call to google and when done loading, callback the function init(urls)
                callback: init(urls)
            });

            function init(urls) {
                // for each url in urls, call loadfeed with the parameters, {url, indx, and # of articles}

                // urlsLoaded is a parallel array(basically for each url, there is a corresponding boolean field that
                // says if the url has finished loading
                console.log("initializing")
                for (var i = 0; i < urls.length; i++) {
                    console.log("Running through initializing for loop");
                    urlsLoaded[i] = false;
                    loadFeed({
                        url: urls[i].feed_url,
                        indx: i,
                        noOfFeed: 4
                    });
                };
                urlsLoaded.pop(); // for some reason, I get an extra boolean value so I just pop it off to stay correct
            }

            function loadFeed(opt_options) {
                console.log("Running through loadFeed")
                // take parameters and get feed and articles from google feed
                var loadObjects = [];
                var url = opt_options.url;
                var feed = new google.feeds.Feed(url);
                feed.setNumEntries(opt_options.noOfFeed);

                feed.load(function(result) {
                    console.log(result)
                    if (!result.error) {
                        urlsLoaded[opt_options.indx] = true;
                        console.log(allEntries.length)
                        allEntries = loadObjects.concat(result.feed.entries);
                        console.log(allEntries.length)
                        // console.log(allEntries);
                        if (urlsLoaded.every(function(el, idx, arr) {return el;})) {
                            // console.log('worked', urlsLoaded);
                            chosenEntries(allEntries);  // function needs to be renamed, will contain the other functions
                            // replace doWork with appendEntries and it should work
                        } else {
                            // console.log('passed by', urlsLoaded);
                        }
                    }
                });
            }
        }

        $.ajax({
            // the ajax call that gets
            url: '/view_rss/',
            type: 'GET',
            success: function (res) {
                console.log(res);
                googleApiCall(res);
                console.log('googleapi completed: ', allEntries)
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

//================================================================================

    function chosenEntries(listEntries) {
        console.log(listEntries[0])
        var selection =[];
        // Filter list based on words, append selected entries to html document

        appendEntries(listEntries);
    }



    function appendEntries(listEntries) {
        console.log("sorting")
        //Sorts entries and appends them to the html document
        // Sorts entries so that newest articles are first
        console.log(listEntries)
        listEntries.sort(function(a, b) {
            var dateA = new Date(a['publishedDate']), dateB = new Date(b['publishedDate']);
            return dateB - dateA
        });
        console.log(listEntries)
        console.log("================================")
        console.log("sorted listEntries")
        console.log(listEntries)
        for (var i = 0; i < listEntries.length; i++) {
            var entry = listEntries[i];
            $rssDiv.append(
                    '<div class="list-group-item"><h4 class="list-group-item-heading">' + entry['title'] + '</h4>' +
                    '<div><span class="label label-primary">' + entry['publishedDate'] + '</span>' +
                    '<span><i class="fa fa-plus-square upVote" data-url="'+entry['link']+'"></i></span>' +
                    '<span><i class="fa fa-minus-square downVote"></i></span></div>' +
                    '<a href="' + entry['link'] + '" class="articleUrl">' +
                    '<p class="list-group-item-text">'+entry['contentSnippet']+'</p>' +
                    '</a></div>'
            );
        }
        // add event listener to newly created icons allowing user to upvote or downvote article
        $('i.upVote').click(function(e) {
            console.log('upvoted' + e.target);
            // Save the article with upvote
//            saveRssArticle(e.target.val('url'), up)
        });
        $('i.downVote').click(function(e) {
            console.log('upvoted' + e.target);
            // Save the article with downvote
            // saveRssArticle(e.target.val('url'), down)
        });
    }

    function saveRssArticle(articleUrl, vote) {
        // Saves the given article in user's profile.
        var allArticle = JSON.stringify(articleUrl);
        $.ajax({
            url:'/save_article/' + vote + '/',
            type:'POST',
            dataType: 'json',
            data: allArticle,
            success: function(res) {
                console.log(res);
            },
            error: function(e) {
                console.log(e);
            }
        })
    }

    function readStatus() {
        // Check for any links that have been visited("read") already and add a label 'READ' to the end of the blurb
        // This function does not work yet. Do not know how to implement this. Might have to check history
        console.log($('a.articleUrl'));
        $('.articleUrl:visited').append('<span class="label label-success"> Read</span>'); // does not work
    }

    function addNewRssFeed(url) {
        var newUrl = JSON.stringify(url);
        $.ajax({
            url: '/add_rss/',
            type: 'POST',
            dataType: 'json',
            data: newUrl,
            success: function(res) {
                console.log(res);
            },
            error: function(e) {
                console.log('post not working');
                console.log(e);
            }
        })
    }

    function displayRssForm() {
        // Creates new RSS Feed form inside the home page

        $rssDiv.html(
            '<div class="input-group"><span class="input-group-addon">New RSS Feed: </span>' +
            '<input class="form-control" type="text" id="newRssInput">   <span class="input-group-btn">' +
            '<button class="btn" type="button" id="addRss">Go!</button></span></div>'
        );
        // attaches an event handler to the newly created button
        $('#addRss').click(function() {
            var newUrl = $('#newRssInput').val();
            console.log(newUrl);
            addNewRssFeed(newUrl);
        })
    }
    // Attached all event handlers to page

    $('#allMyRss').click(function () {
        $rssDiv.html('');
        getRssFeed();
        console.log('final: ', allEntries);
    });

    $('#refreshArticle').click(function() {
        console.log('refreshed');
        readStatus();
    });

    $("#add-rss").on('click', function() {
        console.log('Yeah, add that rss feed')
        displayRssForm();
    });
});