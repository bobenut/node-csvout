# csvout



## Purpose
A node.js module fro parsing csv file data.
you can use this module when need to read csv file content. this module that it read each line from csv file and then to parse into javascript array.it can make you easier to use csv data.



## Installation

Via npm.
```
npm install csvout
```



## Table of apis
* csvout.outline(path, options)
* csvout.outAll(path, options, callback)



## API
### csvout.outline(path, options)
* path: file path
* options: limit to col that will read. default to read all<br />

Read each line.
In example/demo.js
```
var csv = csvout.outline('../test/test-data-01.csv', {col: 8});
console.log('read eachline start');
csv.on('data', function (index, data, err) {
    console.log(data);
});

csv.on('end', function () {
    console.log('read eachline end');
});
```

### csvout.outAll(path, options, callback)
* path: file path
* options: limit to col that will read. default to read all<br />

Read all line.
In example/demo.js
```
csvout.outAll('../test/test-data-01.csv', null, function (index, datas, err) {
    console.log('\nread all start');
    console.log(datas);
    console.log('read all end');
});
```



## License
csvout  is licensed under the GNU.
