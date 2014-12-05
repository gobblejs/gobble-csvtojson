# gobble-coffee

Convert CSV data to JSON with gobble.

## Installation

First, you need to have gobble installed - see the [gobble readme](https://github.com/gobblejs/gobble) for details. Then,

```bash
npm i -D gobble-csvtojson
```

## Usage

**gobblefile.js**

```js
var gobble = require( 'gobble' );

module.exports = gobble( 'src/data' ).map( 'csvtojson', {
  parseValues: false,        // default `true`
  includeNullValues: true,   // default `false`
  space: '  '                // default `undefined`
});
```

The second argument is optional:

* **parseValues** - if `true`, values will be parsed with `JSON.parse()` - e.g. numbers will be stored as numbers, `true` and `false` will be stored as booleans, and so on. Otherwise, all values will be stored as strings
* **includeNullValues** - if `true`, `null` or missing values will not be added to objects
* **space** - passed to `JSON.stringify()`, useful if readability is more important than the filesize of the resulting JSON


## Notes

This isn't using a robust, battle-tested CSV parser - it's using a few brittle hacks (I needed something quickly and didn't have time to evaluate all the options). Contributions welcome!

Your CSV is expected to be well-formed, and to have a header row (headers become the keys of each JSON object).

It goes something like this - CSV goes in...

```csv
id,first_name,last_name,email
1,Judith,Hunt,jhunt1@google.nl
2,Phyllis,Crawford,pcrawford2@quantcast.com
3,Randy,Davis,
4,Christina,Fowler,cfowler3@tinypic.com
5,Judith,Wagner,jwagner4@noaa.gov
```

...JSON comes out. Note that the IDs are numeric, and Randy doesn't have an `email` property, because we're using the default options here:

```json
[{"id":1,"first_name":"Judith","last_name":"Hunt","email":"jhunt1@google.nl"},
{"id":2,"first_name":"Phyllis","last_name":"Crawford","email":"pcrawford2@quantcast.com"},
{"id":3,"first_name":"Randy","last_name":"Davis"},
{"id":4,"first_name":"Christina","last_name":"Fowler","email":"cfowler3@tinypic.com"},
{"id":5,"first_name":"Judith","last_name":"Wagner","email":"jwagner4@noaa.gov"}]
```

(Mock data via [mockaroo.com](http://www.mockaroo.com/).)

## License

MIT. Copyright 2014 Rich Harris
