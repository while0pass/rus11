var now = new Date(),
    twoDigits = function (x) { return ('0' + x).slice(-2); },
    version = require('util').format('v%s.%s.%s.%s',
        twoDigits(now.getMonth() + 1),
        twoDigits(now.getDate()),
        twoDigits(now.getHours()),
        twoDigits(now.getMinutes())
    );

module.exports = {
    VERSION: version,
};
