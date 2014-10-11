$(document).ready(function() {
    var $rssDiv = $('#newRssFeed');
    var allEntries = [];
    var urlsLoaded = [];

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

    function getRssFeed () {
        function googleApiCall(urls) {
            google.load("feeds", "1", {
                callback: init(urls)
            });

            function init(urls) {
                for (var i = 0; i < urls.length; i++) {
                    console.log(i);
                    urlsLoaded[i] = false;
                    loadFeed({
                        url: urls[i].feedUrl,
                        indx: i,
                        noOfFeed: 4
                    });
                    console.log('unnested api', allEntries);
                };
                urlsLoaded.pop();

            }

            function loadFeed(opt_options) {
                var loadobjects = [];
                var url = opt_options.url;
                var feed = new google.feeds.Feed(url);
                feed.setNumEntries(opt_options.noOfFeed);
                feed.load(
                    function (result) {
                        if (!result.error) {

                            for (var i = 0; i < result.feed.entries.length; i++) {
//                            console.log(result.feed.entries[i]);
                                loadobjects.push(result.feed.entries[i]);
                            }
                            urlsLoaded[opt_options.indx] = true;
                            var total = allEntries.concat(loadobjects);
                            allEntries = total;
                            console.log(allEntries);
                            if (urlsLoaded.every(function(el, idx, arr) {return el;})) {
                                console.log('worked', urlsLoaded);
                                appendEntries(allEntries);
                            } else {
                                console.log('passed by', urlsLoaded);
                            }
                        }
//                    appendEntries(allEntries);
                    });

            }
        }

        function appendEntries() {

            allEntries.sort(function(a, b) {
                var dateA = new Date(a['publishedDate']), dateB = new Date(b['publishedDate']);
                return dateB - dateA
            });
            //need to sort array, all, before publishing listgroupitems
            for (var i = 0; i < allEntries.length; i++) {
                var entry = allEntries[i];
                $rssDiv.append(

                    '<a href="' + entry['link'] + '" class="list-group-item">' +
                        '<h4 class="list-group-item-heading">' + entry['title'] + '</h4>' +
                        '<span class="label label-info">' + entry['publishedDate'] + '</span>' +
                        '<p class="list-group-item-text">'+entry['contentSnippet']+'</p>' +
                    '</a>'

                );
            }
        }

        $.ajax({
            url: '/view_rss/',
            type: 'GET',
            success: function (res) {
                console.log(res);
                googleApiCall(res);
                console.log('googleapi completed: ', allEntries)
            },
            error: function (e) {
                console.log(e);
            },
            complete: function () {
                console.log('completed: ', allEntries);
            }
        });
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

    function saveRssArticles(articleUrls) {
        var allArticles = JSON.stringify(articleUrls);
        $.ajax({
            url:'/save_article/',
            type:'/POST/',
            dataType: 'json',
            data: allArticles,
            success: function(res) {
                console.log(res);
            },
            error: function(e) {
                console.log(e);
            }
        })
    }


    function displayRssForm() {
        $rssDiv.html(
            '<div class="input-group"><span class="input-group-addon">New RSS Feed: </span>' +
            '<input class="form-control" type="text" id="newRssInput">   <span class="input-group-btn">' +
            '<button class="btn" type="button" id="addRss">Go!</button></span></div>'
        );
        $('#addRss').click(function() {
            var newUrl = $('#newRssInput').val();
            console.log(newUrl);
            addNewRssFeed(newUrl);
        })
    }


    $('#allMyRss').click(function () {
        $rssDiv.html('');
        getRssFeed();
        console.log('final: ', allEntries);
    });


    $("#add-rss").on('click', function() {
        displayRssForm();
    });

});