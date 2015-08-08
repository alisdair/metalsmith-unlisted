var rimraf = require('rimraf');
var assert = require('assert');
var dirEqual = require('assert-dir-equal');
var Metalsmith = require('metalsmith');
var collections = require('metalsmith-collections');
var unlisted = require('..');

describe('metalsmith-unlisted', function() {
  before(function(done) {
    rimraf('test/fixtures/*/build', done);
  }),

  it('removes unlisted files from explicit collections, but not the build', function(done) {
    var metalsmith = Metalsmith('test/fixtures/explicit');
    metalsmith
    .use(collections({ articles: {} }))
    .use(unlisted())
    .build(function(err) {
      if (err) return done(err);

      var m = metalsmith.metadata();

      assert.equal(1, m.articles.length);
      assert.equal(m.articles[0].title, 'one');

      dirEqual('test/fixtures/explicit/expected',
               'test/fixtures/explicit/build');

      done();
    });
  });

  it('removes unlisted files from pattern matched collection, but not the build', function(done) {
    var metalsmith = Metalsmith('test/fixtures/matched');
    metalsmith
    .use(collections({ articles: { pattern: '*.md' } }))
    .use(unlisted())
    .build(function(err) {
      if (err) return done(err);

      var m = metalsmith.metadata();

      assert.equal(1, m.articles.length);
      assert.equal(m.articles[0].title, 'one');

      dirEqual('test/fixtures/matched/expected',
               'test/fixtures/matched/build');

      done();
    });
  });

  it('removes unlisted files from all collections', function(done) {
    var metalsmith = Metalsmith('test/fixtures/multiple');
    metalsmith
    .use(collections({
      articles: { pattern: '*.md' },
      twos: { pattern: 'two.*' }
    }))
    .use(unlisted())
    .build(function(err) {
      if (err) return done(err);

      var m = metalsmith.metadata();

      assert.equal(1, m.articles.length);
      assert.equal(m.articles[0].title, 'one');

      assert.equal(1, m.twos.length);
      assert.equal(m.twos[0].title, 'two text');

      dirEqual('test/fixtures/multiple/expected',
               'test/fixtures/multiple/build');

      done();
    });
  });

  it('allows configurable unlisted property', function(done) {
    var metalsmith = Metalsmith('test/fixtures/private');
    metalsmith
    .use(collections({ articles: { pattern: '*.md' } }))
    .use(unlisted({ property: 'private' }))
    .build(function(err) {
      if (err) return done(err);

      var m = metalsmith.metadata();

      assert.equal(1, m.articles.length);
      assert.equal(m.articles[0].title, 'one');

      dirEqual('test/fixtures/private/expected',
               'test/fixtures/private/build');

      done();
    });
  });

  it('ignores extra unlisted files which are not in collections', function(done) {
    var metalsmith = Metalsmith('test/fixtures/extras');
    metalsmith
    .use(collections({ articles: { pattern: '*.md' } }))
    .use(unlisted())
    .build(function(err) {
      if (err) return done(err);

      var m = metalsmith.metadata();

      assert.equal(1, m.articles.length);
      assert.equal(m.articles[0].title, 'one');

      dirEqual('test/fixtures/private/expected',
               'test/fixtures/private/build');

      done();
    });
  });

  it('removes the collection property from unlisted files', function(done) {
    var metalsmith = Metalsmith('test/fixtures/explicit');
    metalsmith
    .use(collections({ articles: {} }))
    .use(unlisted())
    .use(function(files, metalsmith, done) {
      setImmediate(done);

      var two = files['two.md'];
      assert.deepEqual(two.collection, []);
    })
    .build(function(err) {
      if (err) return done(err);

      done();
    });
  });

  it('copes with files missing from collections', function(done) {
    var metalsmith = Metalsmith('test/fixtures/explicit');
    metalsmith
    .use(collections({ articles: {} }))
    .use(function(files, metalsmith, done) {
      setImmediate(done);

      // Mess with the collections in an unlikely (but possible) way

      var collection = metalsmith.metadata().collections.articles;
      var two = files['two.md'];
      var index = collection.indexOf(two);

      collection.splice(index, 1);
    })
    .use(unlisted())
    .build(function(err) {
      if (err) return done(err);

      var m = metalsmith.metadata();

      assert.equal(1, m.articles.length);
      assert.equal(m.articles[0].title, 'one');

      done();
    });
  });
});
