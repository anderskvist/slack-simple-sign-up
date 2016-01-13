global.unixtime_to_datetime = function (unixtime) {
    var date = new Date(unixtime*1000);
    var year = "0" + date.getFullYear();
    var month = "0" + date.getMonth() + 1; // SHIT?!?
    var day = "0" + date.getDate();
    var hours = "0" + date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();
    
    var formattedTime = year.substr(-4) + '-' + month.substr(-2) + '-' + day.substr(-2) + ' ' + hours.substr(-2) + ':' + minutes.substr(-2) + ':';

    return formattedTime;
}
