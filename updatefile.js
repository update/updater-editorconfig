'use strict';

var path = require('path');
var isValid = require('is-valid-app');

module.exports = function(app, base, env) {
  if (!isValid(app, 'updater-editorconfig')) return;

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
    return app.src('templates/_editorconfig', {cwd: __dirname})
      .pipe(app.dest(function(file) {
        file.basename = '.editorconfig';
        return app.cwd;
      }));
  });

  /**
   * Alias `eslint` task to make the updater more shareable
   */

  app.task('default', {silent: true}, ['editorconfig']);
};
