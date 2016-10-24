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

readFileLine('test/demo2-1.csv', function (index, data, err) {
    if (!data.isEnd) {
        console.log(index + " : " + data.line);
        resolveLine(data.line);
        console.log('');
    } else {
        console.log("end");
    }
});

function resolveLine(data) {
    findChunk(data);
}

function findChunk(data) {
    var chunks = [];
    var findFuncs = [findChunkHeadDefautl, findChunkHeadDQuote];
    while (data.length > 0) {
        for (var i = 0, findFunc; findFunc = findFuncs[i++];) {
            var context = findFunc(data);
            if (!context) {
                continue;
            }

            context.tailFinder(data);
            var chunk = takeoutChunk(data, context);
//            console.log('headIndex: ' + context.headIndex + ', headDataIndex:' + context.headDataIndex + ', tailIndex:' + context.tailIndex + ', tailDataIndex:' + context.tailDataIndex)

            data = cutChunk(data, context);
            chunks.push(chunk);
        }
    }

    console.log(chunks);
}

function findChunkHeadDQuote(data) {


}

function findChunkHeadDefautl(data) {
    var result = createDefaultFindContext();
    var index = 0;

    if (data[index] === '"') {
        return null;
    }

    result.tailFinder = findChunkTailDefault;
    if (data[index] === ',') {
        return result;
    }

    result.headDataIndex = 0;

    return result;
}

function findChunkTailDefault(data) {
    var index = 0;
    if (data[index] === ',') {
        this.tailIndex = index;
        return;
    }

    for (var c; c = data[index]; index++) {
        if (c !== ',') {
            continue;
        }

        this.tailIndex = index;
        this.tailDataIndex = index;
        break;
    }
}


function takeoutChunk(data, context) {
    if (context.headIndex === -1 &&
        context.headDataIndex === -1 &&
        context.tailIndex === 0 &&
        context.tailDataIndex === -1) {

        return '';
    }

    return data.substring(context.headDataIndex, context.tailDataIndex);
}

function cutChunk(data, context) {
    return data.substring(context.tailIndex + 1, data.length - 1);
}

function createDefaultFindContext() {
    return {
        headIndex: -1,
        headDataIndex: -1,
        tailIndex: -1,
        tailDataIndex: -1,
        tailFinder: null
    };

}
