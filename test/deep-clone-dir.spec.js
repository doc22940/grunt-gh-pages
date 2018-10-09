const fs = require('fs');
const path = require('path');

const helper = require('./helper');

const assert = helper.assert;

describe('deep-clone-dir', function() {
  let fixture, repo;

  before(function(done) {
    this.timeout(3000);
    helper.buildFixture('deep-clone-dir', function(error, dir) {
      if (error) {
        return done(error);
      }
      fixture = dir;
      repo = path.join(fixture, 'path/to/clone-dir');
      done();
    });
  });

  after(function(done) {
    helper.afterFixture(fixture, done);
  });

  it('creates clone-dir directory', function(done) {
    fs.stat(repo, function(error, stats) {
      if (error) {
        return done(error);
      }
      assert.isTrue(stats.isDirectory(), 'directory');
      done();
    });
  });

  it('pushes the gh-pages branch to remote', function(done) {
    helper
      .git(['ls-remote', '--exit-code', '.', 'origin/gh-pages'], repo)
      .then(function() {
        done();
      })
      .fail(done);
  });
});
