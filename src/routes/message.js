const express = require('express')
const router = express.Router();

const User = require('../models/user')
const Message = require('../models/message');
const { json } = require('express');

/** Route to get all messages. */
router.get('/', (req, res) => {
    Message
    .find({})
    .lean()
    .then(messages => {
        res.send(json(messages))
    })
    .catch(err => {
        console.log(err.message);
      })
})

/** Route to get one message by id. */
router.get('/:messageId', (req, res) => {
    // using `findOne`
    Message
    .findOne({_id: req.params.id})
    .then(message => {
        res.send(json(message))
    })
    .catch((err) => {
        console.log(err.message)
    })

})

/** Route to add a new message. */
router.post('/', (req, res) => {
    let message = new Message(req.body)
    message.save()
    .then(user => {
        user.messages.unshift(message)
        return user.save()
    })
    .catch(err => {
        throw err.message
    })
})

/** Route to update an existing message. */
router.put('/:messageId', (req, res) => {
    Message
    .findByIdAndUpdate(req.params.id, req.body, (err, result) => {
        if(err){
            res.send(err)
        }
    })
})

/** Route to delete a message. */
router.delete('/:messageId', (req, res) => {

    Message.findByIdAndDelete(req.params.id, (err, result) => {
        if(err){
            res.send(err)
        }
        else{
            res.send(result)
        }
    })
    
})

module.exports = router