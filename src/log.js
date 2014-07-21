var stream = require('stream'),
    util   = require('util');

var Transform = stream.Transform;

function log (msg) {
    // allow use without new
    if (!(this instanceof log)) {
        return new log(msg);
    }
    Transform.call(this, {objectMode: true});

    this.msg = msg || '%s';
}
util.inherits(log, Transform);

log.prototype._transform = function (file, unused, cb) {

    console.log(this.msg, file.path);
  cb(null, file);
};

module.exports = log;
