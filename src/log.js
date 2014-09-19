var stream = require('stream'),
    util   = require('util'),
    gutil  = require('gulp-util');

var Transform = stream.Transform;

function log (msg) {
    // allow use without new
    if (!(this instanceof log)) {
        return new log(msg);
    }
    Transform.call(this, {objectMode: true});

    this.msg = msg || '%s';
    if (this.msg.indexOf('%s') === -1) {
        this.msg += ' %s';
    }
}
util.inherits(log, Transform);

log.prototype._transform = function (file, unused, cb) {
    gutil.log(this.msg.replace('%s',file.path));
  cb(null, file);
};

module.exports = log;
