const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
    User.create({
            username: req.body.username,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        }).then(
            result => {
                res.status(201).json({
                    message: "User added successfully",
                    result: result

                });
            })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};



exports.login = (req, res) => {
    console.log('REQ body :', req.body);

    User.findOne({
            where: { email: req.body.email }
        })
        .then(user => {
            if (!user) {
                return res.status(404).send({ message: "User Not found." });
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(401).send({
                    accessToken: null,
                    message: "Auth failed ! Invalid Password!"
                });
            }

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: config.jwtexpiresIn
            });

            res.status(200).send({
                accessToken: token,
                username: user.username,
                message: "OK",
                expiresIn: config.jwtexpiresIn


            });

        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};