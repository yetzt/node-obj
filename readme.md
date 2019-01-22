# opj

persistant objects, that are loaded from and on change saved back to a file.

## usage

``` javascript

var opj = require("opj");

var data = opj("/save/file.json", { // path to savefile
	init: {},      // initial object, if no save file exists
	debounce: 100, // time in ms between saves to debounce multiple changes
});

data.words = [];
data.words.push("hello");
data.words.push("world");

console.log(data);

```