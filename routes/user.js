const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Note = require('../models/note');
const auth = require('../middlewares/auth');

// create user
router.post('/', async (req, res) => {
    try {
        const {username, password} = req.body;
        const oldUser = await User.findOne({username});
        if(oldUser) {
            return res.status(400).send('user already exist.. Please login')
        } else {
            const newUser = new User({
                username,
                password
            })

            const user = await newUser.save();
            const token = await newUser.generateAuthToken();
            res.status(201).json({user, token});
        }
    } catch(err) {
        if(err.name = "ValidationError") {
            return res.status(400).json({message: "password is shorter than the minimum allowed length (8)."});
        } else {
            return res.status(500).json({message: err.message});
        }
    }
})

// login user
router.post('/login', async (req, res) => {
    try{
        const {username, password} = req.body;
        const user = await User.findByCredentials(username, password);
        const token = await user.generateAuthToken();
        res.status(200).json({user, token});
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
})

// logout user
router.post('/logout', auth, async (req, res) => {
    try{
        const id = req.user._id;
        const user = await User.findById(id);
        user.tokens = user.tokens.filter((tokenObj) => {return tokenObj.token !== req.token})
        await user.save();
        res.status(200).send('Logged Out');
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
})

// Get User Details
router.get("/me", auth, async (req, res) => {
    try{
        const id = req.user._id;
        const user = await User.findById(id);
        res.status(200).json({user});
    } catch(err) {
        return res.status(500).json({message: err.message});
    }
});

//Delete User
router.delete("/delete", auth, async (req, res) => {
    try {
        const id = req.user._id;
        await User.findByIdAndRemove(id);
        await Note.deleteMany({owner: id})
        res.status(200).send({
            message: "Your account was deleted along with all your data",
        });
    } catch (e) {
        res.status(500).json({message: err.message});
    }
});

module.exports = router;