const express = require('express');

const router = express.Router();

const Note = require('../models/note');
const auth = require('../middlewares/auth');

// create note
router.post('/', auth, async (req, res) => {
    try{
        const userId = req.user._id;
        const {title, content} = req.body;
        const newNote = new Note({
            title,
            content,
            owner: userId
        })
        const note = await newNote.save();
        res.status(201).json({note});
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
} )

// get notes
router.get('/', auth, async (req, res) => {
    try{
        const userId = req.user._id;
        const notes = await Note.find({owner: userId});
        res.status(200).json({notes});
    } catch(err) {
        return res.status(500).json({error: err.message});
    }
} )

// get one note
router.get("/:id", auth, async (req, res) => {
    try {
        const {id} = req.params;
        const note = await Note.findById(id);
        if (!note) {
            return res.status(404).send("not found...");
        }
        res.status(200).json({note});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

// delete note
router.delete("/:id", auth, async (req, res) => {
    try {
        const {id} = req.params;
        const userId = req.user._id;
        const note = await Note.findOneAndDelete({ _id: id, owner: userId });

        if (!note) {
            return res.status(404).json({message:'note not found'});
        }
        res.status(200).send({ message: "Note was deleted" });
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

module.exports = router;