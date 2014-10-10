$(document).ready(function() {
    var feedUrl;

    function getRssFeed () {
        function googleApiCall(url) {
            google.load("feeds", "1", {
                callback: initialize
            });

            function initialize() {
                var feed = new google.feeds.Feed(url);
                console.log('The feed', feed);
                feed.load(function(result) {
                    if (!result.error) {
                        var $rssDiv = $('#newRssFeed');
                        $rssDiv.html('');
                        for (var i = 0; i < result.feed.entries.length; i++) {
                            var entry = result.feed.entries[i];
                            console.log('The entry', entry);

                            $rssDiv.append('<a href="' + entry['link'] + '" class="list-group-item"><h4 class="list-group-item-heading">' + entry['title'] + '</h4><p class="list-group-item-text">'+entry['contentSnippet']+'</p></a>');
                        }
                    }
                });
            }
        }
        $.ajax({
            url: '/view_rss/',
            type: 'GET',
            success: function (res) {
                console.log(res);
                feedUrl = res[0].feedUrl;
                googleApiCall(feedUrl);
            },
            error: function (e) {
                console.log(e);
            }
        });
    }


    $('#allMyRss').click(function () {
        getRssFeed();
    })

});