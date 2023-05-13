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
    // console.log('REQ body :', req.body);

    User.findOne({
            where: { email: req.body.email }
        })
        .then(user => {
            if (!user) {
                return res.status(200).send({
                    message: "User Not found.",
                    userExist: false
                });
            }

            const passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(200).send({
                    pwdinvalid: true,
                    accessToken: null,
                    message: "Auth failed ! Invalid Password!"
                });
            }

            const token = jwt.sign({ id: user.id }, config.secret, {
                expiresIn: config.jwtexpiresIn
            });

            res.status(200).send({
                userExist: true,
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

exports.resetpwd = async(req, res) => {
    try {
        //find a document with such email address
        const user = await User.findOne({ email: req.body.email })
            //check if user object is not empty
        if (user) {
            //generate hash
            const hash = new User(user).generatePasswordResetHash()
                //generate a password reset link
            const resetLink = `http://localhost:4200/reset?email=${user.email}?&hash=${hash}`
                //return reset link
            return res.status(200).json({
                    resetLink
                })
                //remember to send a mail to the user
        } else {
            //respond with an invalid email
            return res.status(400).json({
                message: "Email Address is invalid"
            })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}