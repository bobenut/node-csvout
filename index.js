"use strict"
var fs = require('fs');
var readline = require('readline');

var csv = {};
module.exports = csv;

csv.out = function (data) {

};

csv.outEachLine = function (data, callback) {

};

csv.outAll = function (data, callback) {

}

var readFileLine = (path) => {
    var inEnd = true;
    var index = 0;

    var fReadStream = fs.createReadStream(path,{encoding:'utf8'});

    var objReadline = readline.createInterface({
        input: fReadStream
    });

    fReadStream.on('end', function () {
        console.log('end');
        inEnd = true;
    });

    objReadline.on('line', function (line) {
        console.log(index++, line);
    });
}

readFileLine('test/demo2.csv');