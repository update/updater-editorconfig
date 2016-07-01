'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var update = require('update');
var npm = require('npm-install-global');
var del = require('delete');
var updater = require('./');
var app;

var cwd = path.resolve.bind(path, __dirname, 'actual');

function exists(name, cb) {
  return function(err) {
    if (err) return cb(err);
    var filepath = cwd(name);
    fs.stat(filepath, function(err, stat) {
      if (err) return cb(err);
      assert(stat);
      del(path.dirname(filepath), cb);
    });
  };
}

describe('updater-editorconfig', function() {
  if (!process.env.CI && !process.env.TRAVIS) {
    before(function(cb) {
      npm.maybeInstall('update', cb);
    });
  }

  beforeEach(function() {
    app = update({silent: true});
    app.cwd = cwd();
    app.option('dest', cwd());
  });

  describe('plugin', function() {
    it('should only register the plugin once', function(cb) {
      var count = 0;
      app.on('plugin', function(name) {
        if (name === 'updater-editorconfig') {
          count++;
        }
      });
      app.use(updater);
      app.use(updater);
      app.use(updater);
      assert.equal(count, 1);
      cb();
    });

    it('should extend tasks onto the instance', function() {
      app.use(updater);
      assert(app.tasks.hasOwnProperty('default'));
      assert(app.tasks.hasOwnProperty('editorconfig'));
    });

    it('should run the `default` task with .build', function(cb) {
      app.use(updater);
      app.build('default', exists('.editorconfig', cb));
    });

    it('should run the `default` task with .update', function(cb) {
      app.use(updater);
      app.update('default', exists('.editorconfig', cb));
    });

    it('should run the `editorconfig` task with .build', function(cb) {
      app.use(updater);
      app.build('editorconfig', exists('.editorconfig', cb));
    });

    it('should run the `editorconfig` task with .update', function(cb) {
      app.use(updater);
      app.update('editorconfig', exists('.editorconfig', cb));
    });
  });

  if (!process.env.CI && !process.env.TRAVIS) {
    describe('updater (CLI)', function() {
      it('should run the default task using the `updater-editorconfig` name', function(cb) {
        app.use(updater);
        app.update('updater-editorconfig', exists('.editorconfig', cb));
      });

      it('should run the default task using the `editorconfig` updater alias', function(cb) {
        app.use(updater);
        app.update('editorconfig', exists('.editorconfig', cb));
      });
    });
  }

  describe('updater (API)', function() {
    it('should run the default task on the updater', function(cb) {
      app.register('editorconfig', updater);
      app.update('editorconfig', exists('.editorconfig', cb));
    });

    it('should run the `editorconfig` task', function(cb) {
      app.register('editorconfig', updater);
      app.update('editorconfig:editorconfig', exists('.editorconfig', cb));
    });

    it('should run the `default` task when defined explicitly', function(cb) {
      app.register('editorconfig', updater);
      app.update('editorconfig:default', exists('.editorconfig', cb));
    });
  });

  describe('sub-updater', function() {
    it('should work as a sub-updater', function(cb) {
      app.register('foo', function(foo) {
        foo.register('editorconfig', updater);
      });
      app.update('foo.editorconfig', exists('.editorconfig', cb));
    });

    it('should run the `default` task by default', function(cb) {
      app.register('foo', function(foo) {
        foo.register('editorconfig', updater);
      });
      app.update('foo.editorconfig', exists('.editorconfig', cb));
    });

    it('should run the `editorconfig:default` task when defined explicitly', function(cb) {
      app.register('foo', function(foo) {
        foo.register('editorconfig', updater);
      });
      app.update('foo.editorconfig:default', exists('.editorconfig', cb));
    });

    it('should run the `editorconfig:editorconfig` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('editorconfig', updater);
      });
      app.update('foo.editorconfig:editorconfig', exists('.editorconfig', cb));
    });

    it('should work with nested sub-updaters', function(cb) {
      app
        .register('foo', updater)
        .register('bar', updater)
        .register('baz', updater)

      app.update('foo.bar.baz', exists('.editorconfig', cb));
    });
  });
});
