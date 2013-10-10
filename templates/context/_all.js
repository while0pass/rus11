var now = new Date(),
    version = require('util').format('v%s.%s.%s.%s', now.getMonth(),
        now.getDate(), now.getHours(), now.getMinutes());

module.exports = {
    VERSION: version,
};
