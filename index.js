"use strict"
var fs = require('fs');
var readline = require('readline');
var EventEmitter = require('events');

var csv = {};
module.exports = csv;

csv.outline = function (path, options) {
    var event = new EventEmitter();
    readFileLine(path, function (index, data, err) {
        if (!data.isEnd) {
            event.emit('data', index, handleWithOptioins(resolveLine(data.line), options));
        } else {
            event.emit('end');
        }
    });

    return event;
};

csv.outAll = function (path, callback, options) {
    var datas = [];
    readFileLine(path, function (index, data, err) {
        if (!data.isEnd) {
            datas.push(handleWithOptioins(resolveLine(data.line), options));
        } else {
            if (callback) {
                callback(null, datas);
            }
        }
    });
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

function resolveLine(data) {
    var chunks = [];
    var findFuncs = [findChunkHeadDefautl, findChunkHeadDQuote];
    while (data && data.length > 0) {
        for (var i = 0, findFunc; findFunc = findFuncs[i++];) {
            var context = findFunc(data);
            if (!context) {
                continue;
            }

            context.tailFinder(data);
            var chunk = takeoutChunk(data, context);

            data = cutChunk(data, context);

            if (context.decoder) {
                chunk = context.decoder(chunk);
            }

            chunks.push(chunk);
        }
    }

    return chunks;
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
        this.tailDataIndex = index - 1;
        break;
    }
}

function findChunkHeadDQuote(data) {
    var result = createDefaultFindContext();
    var index = 0;

    if (data[index] !== '"') {
        return null;
    }

    result.headIndex = index;
    result.headDataIndex = index + 1;
    result.tailFinder = findChunkTailDQuote;
    result.decoder = decodeDQuote;

    return result;
}

function findChunkTailDQuote(data) {
    var endCharStack = [];
    var index = this.headDataIndex;

    for (var c; c = data[index]; index++) {
        if (c !== ',' &&
            c !== '"') {

            continue;
        }

        endCharStack.push(c);

        if (endCharStack.length === 2) {
            if (endCharStack[0] === '"' && endCharStack[1] === '"') {
                endCharStack = [];
                continue;
            }
            else if (endCharStack[0] === '"' && endCharStack[1] === ',') {
                endCharStack = [];
                this.tailIndex = index;
                this.tailDataIndex = index - 2;
                return;
            }

            endCharStack.shift();
        }

    }
}

function decodeDQuote(data) {
    return data.replace(/\"{2}/g, '"');
}


function takeoutChunk(data, context) {
    if (context.headIndex === -1 &&
        context.headDataIndex === -1 &&
        context.tailIndex === 0 &&
        context.tailDataIndex === -1) {

        return '';
    }

    return data.substring(context.headDataIndex, context.tailDataIndex + 1);
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
        tailFinder: null,
        decoder: null
    };
}

function handleWithOptioins(data, options) {
    if (!options) {
        return data;
    }

    var handlers = [cutData];
    for (var i = 0, h; h = handlers[i++];) {
        data = h(data, options);
    }

    return data;
}

function cutData(data, options) {
    if (!options.col) {
        return data;
    }

    if (options.col >= data.length) {
        return data;
    }

    data.splice(options.col, data.length - options.col);

    return data;
}