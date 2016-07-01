'use strict';

var os = require('os');
var path = require('path');
var isValid = require('is-valid-app');

module.exports = function(app, base, env) {
  if (!isValid(app, 'updater-editorconfig')) return;
  var src = path.resolve.bind(path, __dirname, 'templates');

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
    return app.copy(src('_editorconfig'), function(file) {
      file.basename = '.editorconfig';
      return app.options.dest || app.cwd;
    });
  });

  /**
   * Alias `eslint` task to make the updater more shareable
   */

  app.task('default', {silent: true}, ['editorconfig']);
};
