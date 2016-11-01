"use strict"
var outcsv = require('../index.js');

/*read data in eachline from csv file.data is array*/
var csv = outcsv.outline('../test/test-data-01.csv', {col: 8});
console.log('read eachline start');
csv.on('data', function (index, data, err) {
    console.log(data);
});

csv.on('end', function () {
    console.log('read eachline end');
});

/*read all data from csv file.data is dimensional array*/
outcsv.outAll('../test/test-data-01.csv', {col: 8}, function (index, datas, err) {
    console.log('\nread all start');
    console.log(datas);
    console.log('read all end');
});
