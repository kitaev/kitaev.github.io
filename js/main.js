var isLeapYear = function(yr) {
    return (yr%400) ? ( (yr%100) ? ( (yr%4) ? false : true ) : false) : true;
}

var adjustDate = function(date) {
    var adjusted = new Date(date.getTime());
    var isLeap = isLeapYear(adjusted.getFullYear());
    var inc = adjusted.getDay() > 3 ? 1 : -1;
    var target = adjusted.getHours() == 23 ? 6 : 6;
    while(adjusted.getDay() != target) {
        do {
            adjusted.setFullYear(adjusted.getFullYear() + inc);
        } while (isLeapYear(adjusted.getFullYear()) != isLeap);
    }
    return adjusted;
}

var updateTimeAndDate = function(now, adjusted) {
    var date = adjusted.customFormat("#DDDD#");
    if (adjusted.getDay() == 6) {
        date = "<span class=\"text-danger\">" + date + "</span>";
    }
    document.getElementById("date").innerHTML = date + adjusted.customFormat(", #MMMM# #DD# " + now.getFullYear());
    var hour =adjusted.customFormat("#hhh#");
    if (hour === "0") {
        hour = "00";
    }
    document.getElementById("time").innerHTML = hour + adjusted.customFormat(":#mm#:#ss#");
}

var generateWeekRow = function(monday, currentMonth, currentDate) {
    var generated = "";
    for(var i = 0; i < 7; i++) {
        var dateClass = monday.getMonth() == currentMonth ? "" : "text-muted";
        if (i >= 5) {
          dateClass += " bg-danger";
        }
        var date = monday.getDate();
        if (currentMonth == monday.getMonth() && currentDate == monday.getDate()) {
            date = "<strong>" + date + "</strong>";
        }
        generated += "<td class=\"" + dateClass + "\">" + date + "</td>";
        monday.setDate(monday.getDate() + 1);
    }
    return generated;
}

var generateMonth = function(adjusted) {
    var date = new Date(adjusted.getTime());
    while(date.getDay() != 1) {
        date.setDate(date.getDate() - 1);
    }
    var generated = "";
    if (date.getDate() == 1) {
        date.setDate(date.getDate() - 7);
        generated += "<tr>" + generateWeekRow(date, adjusted.getMonth(), adjusted.getDate()) + "</tr>"
    }
    while(date.getMonth() <= adjusted.getMonth()) {
        generated += "<tr>" + generateWeekRow(date, adjusted.getMonth(), adjusted.getDate()) + "</tr>"
    }
    if (date.getDay() == 1) {
        generated += "<tr>" + generateWeekRow(date, adjusted.getMonth(), adjusted.getDate()) + "</tr>"
    }
    return generated;
}

var updateCalendar = function(now, adjusted) {
    document.getElementById("month-header").innerHTML = now.customFormat("#MMMM# #YYYY#");
    var body = document.getElementById("month-table");
    body.innerHTML = generateMonth(adjusted);
}

var updateView = function() {
    var now = new Date();
    var adjusted = adjustDate(now);
    updateTimeAndDate(now, adjusted);
    updateCalendar(now, adjusted);
}

var init = function() {
    document.getElementById("jumbo")['onclick'] = function() {
        if (document.getElementById("dateandtime").style.display == 'none') {
            document.getElementById("dateandtime").style.display = 'block';
            document.getElementById("calendar").style.display = 'none';
        } else {
            document.getElementById("dateandtime").style.display = 'none';
            document.getElementById("calendar").style.display = 'block';
        }
    };
    updateView();
    window.setInterval(updateView, 1000);
}
window.onload = init