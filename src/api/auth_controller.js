const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {registerValidator, loginValidator} = require('../validators/auth_validator');

router.post('/register', async (req, res) => {

    const {error} = registerValidator(req.body);
    if (error) return res.status(400).send({error: error.details[0]});

    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(409).send({error: {message: 'Email already exists'}});

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        email: req.body.email,
        password: hashPassword,
        name: req.body.name
    });
    try {
        var savedUser = await user.save();
        const token = jwt.sign({_id: savedUser._id}, process.env.TOKEN_SECRET);
        res.header('Authorization', token).send(savedUser);
    } catch(err) {
        res.status(500).send({error: {message: err}});
    }
});

router.post('/login', async (req, res) => {

    const {error} = loginValidator(req.body);
    if (error) return res.status(400).send({error: error.details[0]});

    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(401).send({error: {message: 'Email or password incorrect'}});

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).send({error: {message: 'Email or password incorrect'}});

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('Authorization', token).send(user);
});

module.exports = router;