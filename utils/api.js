
var INDEX_HOST = 'https://demo.g9zz.com';

var CONSOLE_HOST = 'https://demo.g9zz.com/console';

var POST_LIMIT = 2;

var REPLY_LIMIT = 1;

function __getIndexHost() {
    return INDEX_HOST;
}

function __getConsoleHost() {
    return CONSOLE_HOST;
}

function __getPostLimit() {
    return POST_LIMIT;
}

function __getReplyLimit() {
    return REPLY_LIMIT;
}


module.exports = {
    getIndexHost: __getIndexHost(),
    getConsoleHost: __getConsoleHost(),
    getPostLimit:__getPostLimit(),
    getReplyLimit:__getReplyLimit(),
}
