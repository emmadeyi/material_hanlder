
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup_user = (req, res, next) => {
    User.find({ staff_id: req.body.staff_id })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: "Staff ID Already Registered"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err,
                            message: "Unable to hash password. Try again"
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            name: req.body.name,
                            email: req.body.email,
                            staff_id: req.body.staff_id,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                res.status(201).json({
                                    message: "User Created",
                                    result
                                })
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    success: false,
                                    error: err
                                })
                            })
                    }
                })
            }
        })

}

exports.login_user = (req, res, next) => {
    User.find({ staff_id: req.body.staff_id })
        .exec()
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: "Auth Failed"
                });
            }
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth Failed"
                    });
                }
                if (result) {
                    const token = jwt.sign({
                        staff_id: user[0].staff_id,
                        userId: user[0]._id
                    },
                        "secret_key",
                        {
                            expiresIn: "1h"
                        });
                    return res.status(200).json({
                        message: "Auth Successful",
                        token: token
                    });
                }

                return res.status(401).json({
                    message: "Auth Failed"
                });
            });
        })
        .catch()
}

exports.delete_user = (req, res, next) => {
    User.deleteOne({ _id: req.params.id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: "User Deleted",
                result
            });
        })
        .catch(err => {
            console.log(err);

            return res.status(500).json({
                success: false,
                error: err
            })
        })
}