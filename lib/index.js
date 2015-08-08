var debug = require('debug')('metalsmith-unlisted');

module.exports = function(options) {
  options = options || {};
  var property = options.property || 'unlisted';

  return function(files, metalsmith, done) {
    setImmediate(done);

    var metadata = metalsmith.metadata();

    debug('Looking for files with property "%s"', property);

    Object.keys(files).forEach(function(filename) {
      var file = files[filename];
      var unlisted = file[property];

      if (!unlisted) {
        debug('File %s is not unlisted', filename);
        return;
      }

      debug('File %s is unlisted', filename);

      debug('Collections: %s', JSON.stringify(file.collection));

      if (!file.collection) {
        debug('No collections, ignoring');
        return;
      }

      file.collection.forEach(function(name) {
        debug('Checking collection %s', name);

        var collection = metadata.collections[name];
        var index = collection.indexOf(file);

        if (index < 0) {
          debug('Could not find file in collection');
          return;
        }

        debug('Found file at index %d, removing', index);
        collection.splice(index, 1);
      });

      debug('Resetting file collections');
      file.collection = [];
    });
  };
};
