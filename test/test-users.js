
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

            it('should redirect to /login', function (done) {

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

    describe("create android client", function () {

        it("create android client", function (done) {

            agent.post('/users/client')
                    .field('name', 'AClient')
                    .field('username', 'AClient')
//                        .field('email', 'foobar@example.com')
                    .field('password', 'foobar')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .expect(/true/)
                    .end(done);
        });

        it("check android client", function (done) {

            agent.get('/users/client')
                    
                    
                    .expect(200)
                    
                    .end(done);
        });

    });

    describe("select client user", function () {
        before(function (done) {
            // create a user
            var user = new User({
                email: 'foobar@example.com',
                name: 'AClient',
                username: 'AClient',
                password: 'foobar',
                provider: "client"
            });
            user.save(done);
        });
        context('When logged in', function () {
            before(function (done) {
                // login the user
                agent
                        .post('/users/session')
                        .field('email', 'foobar@example.com')
                        .field('password', 'foobar')
                        .end(done);
            });
            it("fuzzy select android client should response json object", function (done) {
                agent.get('/users/select/ac')

                        .expect(200)
                        .expect('Content-Type', /json/)
                        .expect(/true/)
                        .end(done);
            });
        });
    });

    describe("User detail", function () {

        context("When logined in", function () {
            before(function (done) {
                // login the user
                agent
                        .post('/users/session')
                        .field('email', 'foobar@example.com')
                        .field('password', 'foobar')
                        .end(done);
            });
            it("Load user detail responsed user detail info", function (done) {
                agent.get("/users/detail/557d8a27f155b8b54e1b1845")
                        .expect('Content-Type', /html/)
                        .expect(200)
//                        .expect(//)
                        .end(done);
            });
            
            it("Edit user detail redrect user detail edit", function (done) {
                agent.get("/users/detail/557d8a27f155b8b54e1b1845/edit")
                        .expect('Content-Type', /html/)
                        .expect(200)
                        .end(done);
            });

            it("Save user detail responsed sucess message", function (done) {

                agent.post("/users/detail/557d8a27f155b8b54e1b1845/edit/123")
                        .field("sex","1")
                        .field("address","深圳")
                        .field("phone","12345678912")
                        .field("comment","测试")
                        .field("relusers","AClient")
                        .expect('Content-Type', /plain/)
                        .expect('Location', /\//)
                        .expect(302)
                        .expect(/Moved Temporarily/)
                        .end(done);
            });
        });

    });

    after(function (done) {
        require('./helper').clearDb(done);
    });
});
