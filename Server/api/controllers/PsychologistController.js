
/* eslint-disable max-len */
/* eslint-disable max-statements */

var mongoose = require('mongoose');
var Request = mongoose.model('PsychologistRequest');
var Psychologists = mongoose.model('Psychologist');


module.exports.editPsychologists = function (req, res, next) {
  if (req.user.username === req.params.username) {
    Psychologists.findOne({ _id: req.body.idd }).exec(function (err, prodRequests) {
      if (err) {
        return next(err);
      }

      return res.status(200).json({
        data: prodRequests,
        err: null,
        msg: 'Edited successfully.'
      });
    });
  } else {
    return res.status(403).json({
      data: null,
      err: 'not such Id Exists',
      msg: null
    });
  }
};

module.exports.addRequest = function (req, res, next) {
  var valid =
    req.body.firstName &&
    req.body.lastName &&
    req.body.email;
  if (!valid) {
    return res.status(422).json({
      data: null,
      err: null,
      msg: 'firstName(String) lastName(String) and email(String)' +
        ' are required fields.'
    });
  }

  var user = req.user;

  var isAdmin = false;

  if (typeof user !== 'undefined') {
    isAdmin = user.isAdmin;
  }

  if (isAdmin) {
    Psychologists.create(req.body, function (err, request) {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        data: request,
        err: null,
        msg: 'Psychologist added successfully.'
      });
    });
  } else {
    Request.create(req.body, function (err, request) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: request,
        err: null,
        msg: 'Request was created successfully.'
      });
    });
  }
};

module.exports.editRequest = function (req, res, next) {
  var valid =
    req.body.firstName &&
    req.body.lastName &&
    req.body.email;
  if (!valid) {
    return res.status(422).json({
      data: null,
      err: null,
      msg: 'firstName(String) lastName(String) and email(String)' +
        ' are required fields.'
    });
  }

  var user = req.user;

  var isAdmin = false;

  if (typeof user !== 'undefined') {
    isAdmin = user.isAdmin;
  }

  if (isAdmin) {
    Psychologists.updateOne({ '_id': req.body.editID }, { $set: req.body }, function (err, request) {
      if (err) {
        return next(err);
      }
      res.status(201).json({
        data: request,
        err: null,
        msg: 'Psychologist updated successfully.'
      });
    });
  } else {
    Request.create(req.body, function (err, request) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: request,
        err: null,
        msg: 'Request was created successfully.'
      });
    });
  }
};

var limits = function (toFind) {
  var limiters = { '$text': { '$search': toFind.search } };
  if (toFind.address) {
    limiters.address = new RegExp(toFind.address, 'i');
  }
  if (toFind.search === '') {
    delete limiters.$text;
  }

  return limiters;
};
var options = function (toFind) {

  var ret = {

    limit: Number(toFind.entriesPerPage),
    page: Number(toFind.pageNumber),
    sort: {}
  };
  if (toFind.sort) {
    if (toFind.sort === 'cheapest') {
      ret.sort.priceRange = 1;
    }
    if (toFind.sort === 'a-z') {
      ret.sort.firstName = 1;
      ret.sort.lastName = -1;
    }
  }

  return ret;
};
// get the psyhcologists page(given entries per page and page number)
// search can be on address, name, sorted by price or lexographically
module.exports.getPsychologists = function (req, res, next) {
  // extract limiters out of header
  var toFind = JSON.parse(req.params.limiters);
  // get the search options (sort, entries/page, page #)
  var opt = options(toFind);
  // get the non null limiters
  var limiters = limits(toFind);
  Psychologists.paginate(
    limiters,
    opt,
    function (err, psychologists) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: psychologists,
        err: null,
        msg: 'psychologists retrieved successfully'
      });
    }
  );
};

module.exports.getPsychologistData = function (req, res, next) {
  Psychologists.findOne({ _id: req.params.id }).exec(function (err, psych) {
    if (err) {
      return next(err);
    }

    return res.status(200).json({
      data: psych,
      err: null,
      msg: 'psych retrieved successfully.'
    });
  });
};

module.exports.getRequests = function (req, res, next) {
  if (req.user.isAdmin) {
    Request.find({}).exec(function (err, requests) {
      if (err) {
        return next(err);
      }
      res.status(200).json({
        data: requests,
        err: null,
        msg: 'Requests retrieved successfully.'
      });
    });
  } else {
    res.status(403).json({
      data: null,
      err: 'You are not an admin to do that',
      msg: null
    });
  }
};

module.exports.evaluateRequest = function (req, res, next) {
  if (req.user && req.user.isAdmin) {
    if (req.body.result) {
      // Ensure the request still exists
      Request.findById(req.body._id).exec(function (err, psychReq) {
        if (err) {
          return next(err);
        }
        if (!psychReq) {
          return res.status(404).json({
            data: null,
            err: null,
            msg: 'Request not found.'
          });
        }
        // If found, make the newPsych to insert
        var newPsych = {
          address: req.body.address,
          daysOff: req.body.daysOff,
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          priceRange: req.body.priceRange
        };
        // Delete the request
        Request.deleteOne({ _id: req.body._id }, function (err1) {
          if (err1) {
            return next(err1);
          }
          // Insert the Psychologist
          Psychologists.create(newPsych, function (err2) {
            if (err2) {
              return next(err2);
            }
            res.status(201).json({
              data: newPsych,
              err: null,
              msg: 'Request accepted and psychologist added to database.'
            });
          });
        });
      });
    } else {
      // Simply delete the request and notify the applicant
      Request.findByIdAndRemove(req.body._id, function (err) {
        if (err) {
          return res.status(404).json({
            data: null,
            err: null,
            msg: 'Request not found.'
          });
        }
        // TODO Notify applicant

        // When done, send response
        return res.status(201).json({
          data: null,
          err: null,
          msg: 'Request rejected and applicant notified.'
        });
      });
    }
  } else {
    res.status(403).json({
      data: null,
      err: 'You are not an admin to do that OR You are not signed in',
      msg: null
    });
  }
};


module.exports.deletePsych = function (req, res, next) {
  if (req.user.isAdmin) {
    Psychologists.findOne({ _id: req.params.id }).exec(function (err, psych) {
      if (err) {
        return next(err);
      }
      if (psych) {
        Psychologists.remove({ _id: req.params.id }, function (err1, msg) {
          if (err1) {
            return next(err1);
          }

          return res.status(200).json({
            data: msg,
            err: null,
            msg: 'Psychologist deleted successfully.'
          });
        });
      } else {
        return res.status(404).json({
          data: null,
          err: null,
          msg: 'Psychologist not found.'
        });
      }
    });
  } else {
    res.status(403).json({
      data: null,
      err: 'You are not an admin to do that OR You are not signed in',
      msg: null
    });
  }
};
