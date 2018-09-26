

Date.prototype.passing_total_seconds = function() {
    return parseInt((Date.now() - this.getTime()) / 1000);
};

Date.prototype.passing_total_days = function() {
    return parseInt(this.passing_total_seconds() / 86400);
};

Date.prototype.passing_minutes = function() {
    return parseInt(this.passing_total_seconds() / 60) % 60;
};

Date.prototype.passing_hours = function() {
    return parseInt(this.passing_total_seconds() / 3600) % 24;
};

Date.prototype.passing_days = function() {
    return parseInt(this.passing_total_seconds() / 86400) % 7;
};

Date.prototype.passing_weeks = function() {
    return parseInt(this.passing_total_seconds() / 604800);
};

Date.prototype.getDayName = function() {
    let _name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return _name[this.getDay()];
};

Date.prototype.getDayName = function() {
    let _name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return _name[this.getDay()];
};

Date.prototype.getMonthName = function() {
    let _name = ['Jan', 'Feb', 'Mar', 'Apr' ,'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return _name[this.getMonth()];
};

Date.prototype.getTimeFormat = function(milliseconds = false) {
    let _format
        = ('0' + this.getHours().toString()).substr(-2, 2) + ':'
        + ('0' + this.getMinutes().toString()).substr(-2, 2) + ':'
        + ('0' + this.getSeconds().toString()).substr(-2, 2);
    if (milliseconds) {
        _format += ' ' + ('00' + this.getMilliseconds().toString()).substr(-3, 3);
    }
    return _format;
};

Date.prototype.term_date = function() {
    let _date = new Date();
    return `${_date.getMonthName()} ${_date.getDate()} ${_date.getTimeFormat(true)}`;
};
