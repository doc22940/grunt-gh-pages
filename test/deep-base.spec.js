const fs = require('fs');
const path = require('path');

const helper = require('./helper');

const assert = helper.assert;

describe('deep-base', function() {
  let fixture, repo;

  before(function(done) {
    this.timeout(3000);
    helper.buildFixture('deep-base', function(error, dir) {
      if (error) {
        return done(error);
      }
      fixture = dir;
      repo = path.join(fixture, '.grunt/grunt-gh-pages/gh-pages/src');
      done();
    });
  });

  after(function(done) {
    helper.afterFixture(fixture, done);
  });

  it('creates .grunt/grunt-gh-pages/gh-pages/src directory', function(done) {
    fs.stat(repo, function(error, stats) {
      assert.isTrue(!error, 'no error');
      assert.isTrue(stats.isDirectory(), 'directory');
      done(error);
    });
  });

  it('creates a gh-pages branch', function(done) {
    let branch;
    helper
      .git(['rev-parse', '--abbrev-ref', 'HEAD'], repo)
      .progress(function(chunk) {
        branch = String(chunk);
      })
      .then(function() {
        assert.strictEqual(branch, 'gh-pages\n', 'branch created');
        done();
      })
      .fail(done);
  });

  it('copies source files relative to the base', function(done) {
    fs.exists(path.join(repo, 'hello.txt'), function(exists) {
      if (!exists) {
        done(new Error('Failed to find "hello.txt" in repo: ') + repo);
      } else {
        done();
      }
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
