const {Schema, model } = require('mongoose');

const MessageSchema = new Schema({
  message: {type: String,required: true},
  Chat: {type: Schema.Types.ObjectId, ref: 'Chat'},
  message_owner: {type: String, required: true}
})

module.exports = model('Message',MessageSchema);