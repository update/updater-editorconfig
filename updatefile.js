'use strict';

var os = require('os');
var path = require('path');
var fs = require('fs');
var isValid = require('is-valid-app');

module.exports = function(app, base, env) {
  if (!isValid(app, 'updater-editorconfig')) return;
  //var src = path.resolve.bind(path, __dirname, 'templates');

  var src = path.join( os.homedir(), './templates', '_editorconfig');
  if (!fs.existsSync( src )) {
    src = path.join( __dirname, 'templates/_editorconfig');
  }

  /**
   * Update or add an `.editorconfig` file in the current working directory.
   *
   * ```sh
   * $ update editorconfig
   * ```
   * @name editorconfig
   * @api public
   */

  app.task('editorconfig', function() {

    console.log('app.options.dest', app.options.dest);
    console.log('app.cwd', app.cwd);

    return app.copy( src, function(file) {
      file.basename = '.editorconfig';
      return app.options.dest || app.cwd;
    });
  });

  /**
   * Alias `eslint` task to make the updater more shareable
   */

  app.task('default', {silent: true}, ['editorconfig']);
};
