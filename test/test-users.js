
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
        , should = require('should')
        , request = require('supertest')
        , app = require('../server')
        , context = describe
        , User = mongoose.model('User')
        , agent = request.agent(app);

var cookies, count;

/**
 * Users tests
 */

describe('Users', function () {
    describe('POST /users', function () {
        describe('Invalid parameters', function () {
            before(function (done) {
                User.count(function (err, cnt) {
                    count = cnt;
                    done();
                });
            });
            function contain(content, res) {
                if (!(content in res.body))
                    return content;

            }
            it('no email - should respond with errors', function (done) {
                
                        agent.post('/users')
                        .field('name', 'Foo bar')
                        .field('username', 'foobar')
                        .field('email', '')
                        .field('password', 'foobar')
                        .expect('Content-Type', /html/)
                        .expect(200)
                        .expect(/EU0002/)
                        .end(done);

            });


            it('no name - should respond with errors', function (done) {
                
                        agent.post('/users')
                        .field('name', '')
                        .field('username', 'foobar')
                        .field('email', 'foobar@example.com')
                        .field('password', 'foobar')
                        .expect('Content-Type', /html/)
                        .expect(200)
                        .expect(/EU0001/)
                        .end(done);
            });

            it('should not save the user to the database', function (done) {
                User.count(function (err, cnt) {
                    count.should.equal(cnt);
                    done();
                });
            });
        });

        describe('Valid parameters', function () {
            before(function (done) {
                User.count(function (err, cnt) {
                    count = cnt;
                    done();
                });
            });

            it('should redirect to /articles', function (done) {
                
                        agent.post('/users')
                        .field('name', 'Foo bar')
                        .field('username', 'foobar')
                        .field('email', 'foobar@example.com')
                        .field('password', 'foobar')
                        .expect('Content-Type', /plain/)
                        .expect('Location', /\//)
                        .expect(302)
                        .expect(/Moved Temporarily/)
                        .end(done);
            });

            it('should insert a record to the database', function (done) {
                User.count(function (err, cnt) {
                    cnt.should.equal(count + 1);
                    done();
                });
            });

            it('should save the user to the database', function (done) {
                User.findOne({username: 'foobar'}).exec(function (err, user) {
                    should.not.exist(err);
                    user.should.be.an.instanceOf(User);
                    user.email.should.equal('foobar@example.com');
                    done();
                });
            });
        });
    });

    after(function (done) {
        require('./helper').clearDb(done);
    });
});
