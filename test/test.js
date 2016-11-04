"use strict"
var outcsv = require('../index.js');
var fs = require('fs');
require("should");


describe('01.Tsake out unformat data', function () {
    var testData01;
    var errThrowed = false;

    this.slow(20);

    before(function () {
        testData01 = [
            ['no', 'year', 'name', 'place', 'author', 'photo', 'doc', 'master'],
            ['1', '1999', 'bobenut', 'shanghai', 'bobenut', '5', 'ok', 'head']
        ];
    });

    it('01-01.Take out datas in each line', function (done) {
        var csv = outcsv.outLine('test/test-data-01.csv', {col: 8});
        csv.on('data', function (index, data, err) {
            var baseData;
            if (!testData01[index]) {
                baseData = "";
            }
            else {
                baseData = testData01[index].toString();
            }

            baseData.should.be.equal(data.toString());
        });

        csv.on('end', function () {
            done();
        })
    });

    it('01-02.Take out all datas ', function (done) {
        outcsv.outAll('test/test-data-01.csv', {col: 8}, function (index, datas, err) {

            testData01.toString().should.be.equal(datas.toString());

            done();
        });
    });
});

describe('02.Tsake out format data that is wrapped with double quote', function () {
    var testData01;

    this.slow(10);

    before(function () {
        testData01 = [
            ['"data01-01"', 'data01-02', 'data01-03', '"data01-04"', 'data01-05'],
            ['data02-01-01,data02-01-02', ',data02-02', 'data02-03,', 'data02-04', 'data02-05'],
            ['"data03-01-01,data03-01-02"', '","data03-02', 'data03-03,', 'data03-04-01","data03-04-02', '"data03-05"']
        ];
    });

    it('02-01.Take out datas in each line ', function (done) {
        var csv = outcsv.outLine('test/test-data-02.csv', {col: 5});
        csv.on('data', function (index, data, err) {
            var baseData;
            if (!testData01[index]) {
                baseData = "";
            }
            else {
                baseData = testData01[index].toString();
            }

            var sData = data.toString();

            sData.should.be.equal(baseData);
        });

        csv.on('end', function () {
            done();
        })
    });

    it('02-01.Take out all datas ', function (done) {
        outcsv.outAll('test/test-data-02.csv',null, function (index, datas, err) {

            testData01.toString().should.be.equal(datas.toString());

            done();
        });
    });
});
