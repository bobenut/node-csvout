"use strict"
var outcsv = require('../index.js');
var assert = require('assert');

//--------------------------case1----------------------------
//outcsv.outAll('demo2-2.csv', function(err,datas){
//    console.log(datas);
//});

var out = outcsv.outline('demo2-2.csv',{col:13});
out.on('data', function (index, data, err) {
    console.log(index);
    console.log(data);
});
