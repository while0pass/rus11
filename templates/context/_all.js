var now = new Date(),
    version = require('util').format('v%s.%s.%s.%s',
        ('0' + (now.getMonth() + 1)).slice(-2),
        now.getDate(), now.getHours(), now.getMinutes());

module.exports = {
    VERSION: version,
};
