require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
});

// REFERENCE https://www.chaijs.com/ TO SOLVE THESE TESTS. :)

describe('Message API endpoints', () => {
    beforeEach((done) => {
        let message = new Message({
            title: "hello",
            body: "whats up",
            author: new User()
        })
        message.save()
        done()
    })

    afterEach((done) => {
        mongoose.models = {}
        mongoose.modelSchemas = {}
        done()
    })

    it('should load all messages', (done) => {
        chai
        .request(app)
        .get('/messages/')
        .end((err, res) => {
            res.should.have.status(200)
            res["body"].should.be.a('object')
        })
        done()
    })

    it('should get one specific message', (done) => {
        chai
        .request(app)
        .get('/messages/1')
        .end((err, res) => {
            res.should.have.status(200)
            res.body.should.be.a('object')
        })
        done()
    })

    it('should post a new message', (done) => {
        const author = new User({
            username: 'user',
            password: 'pass'
        })
        author.save()
        
        chai
        .request(app)
        .post('/messages')
        .type('form')
        .send({
            'title': 'Hello',
            'body': 'oh my blahd hi',
            'author': author.id
        })
        .auth('user', 'pass')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
         });
        done()
    })

    it('should update a message', (done) => {
        const author = new User()
        chai
        .request(app)
        .put('/messages/0')
        .type('form')
        .send({
            'title': 'Hello',
            'body': 'oh my blahd hi',
            'author': author.id
        })
        .auth('user', 'pass')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
         });
        done()
    })

    it('should delete a message', (done) => {
        chai
        .request(app)
        .delete('/messages/1')
        .end((err, res) => {
            res.should.have.status(200);
            Message.estimatedDocumentCount()
            .then(function (newDocCount) {

                newDocCount.should.to.be.equal(1)
            })
            .catch(function (err) {
                console.log(err.message)
            });
        })
        done()
    })
})