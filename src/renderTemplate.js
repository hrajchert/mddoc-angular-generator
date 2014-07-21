var stream = require('stream'),
    util   = require('util'),
    path   = require('path');


var Transform = stream.Transform;

function renderTemplate (options) {
    // allow use without new
    if (!(this instanceof renderTemplate)) {
        return new renderTemplate(options);
    }

    Transform.call(this, {objectMode: true});

    this.renderer = options.renderer;
    this.helpers = options.helpers;
}
util.inherits(renderTemplate, Transform);

renderTemplate.prototype._transform = function (file, unused, cb) {

    var html = this.renderer.render(file.path, {documentor: this.helpers, links:['1','2','3']});
    file.contents = new Buffer(html);

    file.path = path.normalize(path.dirname(file.path) + path.sep + path.basename(file.path, '.tpl') + '.html');
    cb(null, file);
};

module.exports = renderTemplate;
