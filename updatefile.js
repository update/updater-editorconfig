'use strict';

module.exports = function(app, base, env) {
  base.on('loaded', function(files) {
    var file = app.getFile('_editorconfig');
    base.files('.editorconfig', file);
  });

  base.preWrite(/_editorconfig$/, function(file, next) {
    file.basename = '.editorconfig';
    next();
  });
};

