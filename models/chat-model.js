const {Schema, model } = require('mongoose');

const ChatSchema = new Schema({
  chat_name: {type: String,required: true},
  Project: {type: Schema.Types.ObjectId, ref: 'Project'}
})

module.exports = model('Chat',ChatSchema);