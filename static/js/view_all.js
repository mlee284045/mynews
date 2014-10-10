google.load("feeds", "1");

function initialize() {
    var feed = new google.feeds.Feed(feedUrl);
    feed.load(function(result) {
        if (!result.error) {
            var container = document.getElementById("feed");
            for (var i = 0; i < result.feed.entries.length; i++) {
                var entry = result.feed.entries[i];
                var div = document.createElement("div");
                div.appendChild(document.createTextNode(entry.title));
                container.appendChild(div);
            }
        }
    });
}
google.setOnLoadCallback(initialize);


$(document).ready(function () {
    google.load("feeds", "1");
    $.ajax({
        url
    });
});