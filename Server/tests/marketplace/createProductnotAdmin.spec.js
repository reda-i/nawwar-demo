/*eslint max-statements: ["error", 20]*/
var mongoose = require('mongoose');
var chai = require('chai');
var server = require('../../app');
// import your schema here, like this:
var Product = mongoose.model('Product');
var users = mongoose.model('User');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;

chai.use(chaiHttp);

var config = require('../../api/config/config');
var Mockgoose = require('mockgoose').Mockgoose;
var mockgoose = new Mockgoose(mongoose);

// user for authentication
var user = {
    birthdate: '1/1/1980',
    email: 'omar@omar.omar',
    firstName: 'omar',
    lastName: 'Elkilany',
    password: '123456789',
    phone: '0112345677',
    username: 'omar'
};

// authenticated token
var token = null;


describe('CreateProduct  for not an admin', function () {
    this.timeout(120000);

    // --- Mockgoose Initiation --- //
    before(function (done) {
        mockgoose.prepareStorage().then(function () {
            mongoose.connect(config.MONGO_URI, function () {
                done();
            });
        });
    });
    // --- End of "Mockgoose Initiation" --- //

    // --- Clearing Mockgoose --- //
    beforeEach(function (done) {
        mockgoose.helper.reset().then(function () {
            done();
        });
    });
    // --- End of "Clearing Mockgoose" --- //


    it('it should POST product int to product requests', function (done) {
        //here you need to call your schema to construct a document
        //like this:
        var pro1 = {
            acquiringType: 'sell',
            description: 'description description description',
            image: 'https://vignette.wikia.nocookie.net/spongebob/images/' +
            'a/ac/Spongebobwithglasses.jpeg/revision/latest?cb=20121014113150',
            name: 'product2',
            price: 11,
            seller: 'omar'
        };
        //sign up
        chai.request(server).
            post('/api/signUp').
            send(user).
            end(function (err, response) {
                if (err) {
                    return console.log(err);
                }
                response.should.have.status(201);
                token = response.body.token;

                // write your actual test here, like this:

                chai.request(server).
                    post('/api/productrequest/createproduct').
                    send(pro1).
                    set('Authorization', token).
                    end(function (error, res) {
                        if (error) {
                            return console.log(error);
                        }
                        expect(res).to.have.status(200);
                        res.body.should.be.a('object');
                        res.body.should.have.property('msg').
                        eql('ProductRequest was created successfully.');
                        res.body.data.should.have.property('acquiringType');
                        res.body.data.should.have.property('description');
                        res.body.data.should.have.property('image');
                        res.body.data.should.have.property('name');
                        res.body.data.should.have.property('price');
                        res.body.data.should.have.property('seller');
                        // res.body.should.have.property('err').
                        // eql('Product sent to productRequest successfully');

                        done();
                    });

            });
    });
    // --- Mockgoose Termination --- //
    after(function (done) {
        mongoose.connection.close(function () {
            done();
        });
    });
    // --- End of "Mockgoose Termination" --- //
});   

