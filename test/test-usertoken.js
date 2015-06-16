/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var mongoose = require('mongoose')
        , should = require('should')
        , request = require('supertest')
        , app = require('../server')
        , UserToken = mongoose.model('UserToken');



describe('Users: Usertoken', function () {

    //...

    describe('UserToken', function () {

        describe('#new', function () {
            var userId = '000000000000000000000001';
            it("user token is normal", function (done) {
                UserToken.new(userId, function (err, userToken) {
                    // Confirm that that an error does not exist
                    should.not.exist(err);
                    should.exist(userToken.token);
                    // the userId is a Schema.ObjectId so to test against our string
                    // we need to convert it to a string
                    userToken.userId.toString().should.equal(userId);
                });
                done();
            });
        });

    });
});

