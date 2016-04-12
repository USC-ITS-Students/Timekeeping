// require models so that they are loaded into mongoose
var models = require('../models'),
    expect = require('chai').expect, // load chai.expect for BDD style testing
    mongoose = require('mongoose'); // load mongoose

describe('Models', function(){
    before(function(done){
        mongoose.connect('mongodb://testuser:password@ds011238.mlab.com:11238/timesheets');
        done();
    });

    after(function(done){
        mongoose.disconnect();
        done();
    });

    // describe('UserModel', function(){
    //     describe('#login(empid, user, callback)', function(){
    //         var User = models.UserModel;
    //         it('should return user upon succesful login', function(done){
    //             var empid = '1234567',
    //                 password = 'test123';
    //             User.login(empid, password, function(err, user){
    //                 expect(err).to.not.be.ok;
    //                 expect(user).to.be.ok;
    //                 done();
    //             });
    //         });

    //         it('should return null upon unsuccesful login', function(done){
    //             var empid = '1234567',
    //                 password = 'wrongpassword';
    //             User.login(empid, password, function(err, user){
    //                 expect(user).to.not.be.ok;
    //                 expect(err).to.be.ok;
    //                 done();
    //             });
    //         });
    //     });
    // });

    describe('TimsheetModel', function(){
        this.timeout(5000);
        var Timesheet = models.TimesheetModel;
        describe('#getByYear(owner, year, callback)', function(){
            it('should return only timesheets with end dates from the specified year', function(done){
                Timesheet.getByYear('1234567', '2015', function(err, docs){
                    expect(err).to.be.not.ok;
                    expect(docs).to.be.ok;

                    var Jan12015 = new Date(2015, 0, 1, 0, 0, 0, 0);
                    var Jan12016 = new Date(2016, 0, 1, 0, 0, 0, 0);

                    for(var i = 0; i < docs.length; i++){
                        var ts = docs[i];
                        expect(ts.end).to.be.at.least(Jan12015);
                        expect(ts.end).to.be.below(Jan12016);
                    }
                    done();
                });
            });
        });
    });
});
