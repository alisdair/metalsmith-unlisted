# metalsmith-unlisted

[![Build Status](https://travis-ci.org/alisdair/metalsmith-unlisted.svg)](https://travis-ci.org/alisdair/metalsmith-unlisted)

Remove pages from collections, but still allow them to build. Useful for writing draft weblog posts and sharing with people, while not updating your listings or RSS feed.

## Usage

```javascript
var Metalsmith = require('metalsmith');
var permalinks = require('metalsmith-unlisted');

var metalsmith = new Metalsmith(__dirname)
  .use(unlisted());
```

Then add an `unlisted` property to the metadata for the files in your collections that you want to remove from the listings. For example:

```yaml
---
title: My upcoming post
unlisted: true
---
```

Any truthy value will cause the file to be removed from the collection.

### Options

If you don't want to use `unlisted` as the metadata property, you can override the name by setting the `property` option:

```javascript
var metalsmith = new Metalsmith(__dirname)
  .use(unlisted({
    property: 'private'
  }));
```

### CLI

You can also use the plugin with the Metalsmith CLI by adding a key to your `metalsmith.json` file:

```json
{
  "plugins": {
    "metalsmith-unlisted": {
      "property": "private"
    }
  }
}
```

### Debugging

If it doesn't seem to be working, turn on debug logging:

    DEBUG=metalsmith-unlisted node build.js

This should print out enough information to help you diagnose the problem.

## License

[MIT](https://github.com/alisdair/metalsmith-unlisted/blob/master/LICENSE.md)
