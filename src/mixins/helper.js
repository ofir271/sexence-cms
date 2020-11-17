export function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key];
        var y = b[key];

        if (typeof x == "string")
        {
            x = (""+x).toLowerCase(); 
        }
        if (typeof y == "string")
        {
            y = (""+y).toLowerCase();
        }
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

export function tsToDateTime(UNIX_timestamp) {
    var tempDate = new Date(UNIX_timestamp * 1000);
    var year = tempDate.getFullYear();
    var month = tempDate.getMonth();
    var date = tempDate.getDate();
    var hour = tempDate.getHours();
    var min = tempDate.getMinutes();
    var sec = tempDate.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}