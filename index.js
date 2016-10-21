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

function readFileLine(path, callback) {
    var isEnd = true;
    var index = 0;

    var fReadStream = fs.createReadStream(path, {encoding: 'utf8'});

    var objReadline = readline.createInterface({
        input: fReadStream
    });

    fReadStream.on('end', function () {
        isEnd = true;
        callback(index, {isEnd: isEnd, line: ""}, null);
    });

    objReadline.on('line', function (line) {
        callback(index++, {isEnd: false, line: line}, null);
    });
}

readFileLine('test/demo2.csv', function (index, data, err) {
    if (!data.isEnd) {
        console.log(index + " : " + data.line);
    } else {
        console.log("end");
    }
});

function resolveLine(data) {

}

function findChunkHead(data) {
    var findFunc = [findChunkHeadDQuote, findChunkHeadDQuote];

}

function findChunkHeadDQuote(data) {

}

function findChunkHeadNone(data) {

}

function decideChunkTail(data) {

}

function takeoutChunk(){

}

