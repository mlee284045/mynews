google.load("feeds", "1");
function init(){
    console.log("Init callback runs");
}
google.setOnLoadCallback(init);