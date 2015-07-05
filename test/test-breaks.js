
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
        , should = require('should')
        , request = require('supertest')
        , app = require('../server')
        , context = describe
        , User = mongoose.model('User')
        , Userdetail = mongoose.model('Userdetail')
        , Breaks = mongoose.model('Breaks')
        , agent = request.agent(app);
var count;


/**
 * Breaks tests
 */

describe('Breaks', function () {

    before(function (done) {
        // create a user
        var user = new User({
            email: 'foobar@example.com',
            name: 'Foo bar',
            username: 'foobar',
            password: 'foobar'
        });
        user.save(done);
        console.log(user.id);
        var detail = new Userdetail({
            user:user.id,
            relusers:"U001"
        });
        detail.save(detail);
    });
    describe('GET /breaks/new', function () {
        context('When not logged in', function () {
            it('should redirect to /login', function (done) {
                agent
                        .get('/breaks/new')
                        .expect('Content-Type', /plain/)
                        .expect(302)
                        .expect('Location', '/login')
                        .expect(/Moved Temporarily/)
                        .end(done);
            });
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
            

            it('should respond with Content-Type text/html', function (done) {
                agent
                        .get('/breaks/new')
                        .expect('Content-Type', /html/)
                        .expect(200)
                        .expect(/New Break/)
                        .end(done);
            });
        });
    });
    describe('GET /breaks', function () {
        context('When logged in', function () {
            before(function (done) {
                // login the user
                agent
                        .post('/users/session')
                        .field('email', 'foobar@example.com')
                        .field('password', 'foobar')
                        .end(done);
            });
            it('should respond with Content-Type text/html', function (done) {
                agent
                        .get('/breaks')
                        .expect('Content-Type', /html/)
                        .expect(200)
                        .expect(/Breaks/)
                        .end(done);
            });
        });
    });

    describe('POST /breaks', function () {
        context('When not logged in', function () {
            it('should redirect to /login', function (done) {
                request(app)
                        .get('/breaks/new')
                        .expect('Content-Type', /plain/)
                        .expect(302)
                        .expect('Location', '/login')
                        .expect(/Moved Temporarily/)
                        .end(done);
            });
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

            describe('Invalid parameters', function () {
                before(function (done) {
                    Breaks.count(function (err, cnt) {
                        count = cnt;
                        done();
                    });
                });

                it('should respond with error', function (done) {
                    agent
                            .post('/breaks')
                            .field('title', '')
                            .field('runtime', '1')
                            .field('breaktime', '1')
                            .field('comment', '1')

                            .expect('Content-Type', /html/)
                            .expect(200)
                            .expect(/EB0011/)//nationalization messagess  title cannot be blank
                            .end(done);
                });

                it('should not save to the database', function (done) {
                    Breaks.count(function (err, cnt) {
                        count.should.equal(cnt);
                        done();
                    });
                });
            });

            describe('Valid parameters', function () {
                before(function (done) {
                    Breaks.count(function (err, cnt) {
                        count = cnt;
                        done();
                    });
                });

                it('should redirect to the new break notify page', function (done) {
                    agent
                            .post('/breaks')
                            .field('title', 'boo')
                            .field('runtime', '1')
                            .field('breaktime', '1')
                            .field('comment', '1')
                            .field('relusers', 'ad1')
                            .expect('Content-Type', /plain/)
                            .expect('Location', /\/breaks\//)
                            .expect(302)
                            .expect(/Moved Temporarily/)
                            .end(done);
                });

                it('should insert a record to the database', function (done) {
                    Breaks.count(function (err, cnt) {
                        cnt.should.equal(count + 1);
                        done();
                    });
                });

                it('should save the break notify to the database', function (done) {
                    Breaks
                            .findOne({title: 'boo'})
                            .populate('user')
                            .exec(function (err, breaks) {
                                should.not.exist(err);
                                breaks.should.be.an.instanceOf(Breaks);
                                'boo'.should.equal(breaks.title);
                                done();
                            });
                });
            });
        });
    });

    describe("Get /breaks/:id", function () {
        context('When logged in', function () {
            before(function (done) {
                // login the user
                agent
                        .post('/users/session')
                        .field('email', 'foobar@example.com')
                        .field('password', 'foobar')
                        .end(done);
            });

            it("load breaks info", function (done) {

                Breaks
                        .findOne({title: 'boo'})
                        .populate('user')
                        .exec(function (err, breaks) {
                            should.not.exist(err);
                            agent.get('/breaks')
                                    .field('id', breaks.id)
                                    .expect('Content-Type', /html/)
                                    .expect(200)
                                    .expect(/boo/)
                                    .end(done);

                        });

            });
        });

    });

    after(function (done) {
        require('./helper').clearDb(done);
    });
});
