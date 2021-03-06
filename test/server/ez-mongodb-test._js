"use strict";
QUnit.module(module.id);

var ez = require('ez-streams');
var MongoClient = require('mongodb').MongoClient;

var URL_PREFIX = "mongodb://" + (process.env.MONGO_HOST || "localhost") + ":" + (process.env.MONGO_PORT || 27017);

asyncTest("initialize database", 0, function(_) {
    var client = MongoClient.connect(URL_PREFIX, {
        w: 1,
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, _);
    client.db('unit_test').dropDatabase(_);
    
    start();
});

asyncTest("mongodb factory test", 2, function(_) {
    // get a mongodb writer
    var wr = ez.factory(URL_PREFIX + "/unit_test/CollectionA").writer(_);
    wr.write(_, {
        a: 1,
        b: "String1"
    });
    var rd = ez.factory(URL_PREFIX + "/unit_test/CollectionA").reader(_);
    var res = rd.read(_);
    strictEqual(res.b, "String1", "Got first document ok");
    res = rd.read(_);
    strictEqual(res, undefined, "End of collection ok");
     
    start();
});

