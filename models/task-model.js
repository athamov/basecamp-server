const {Schema, model } = require('mongoose');

const TaskSchema = new Schema({
  task_name: {type: String,required: true},
  is_done: {type: Boolean,required: true,default: false,},
  Project: {type: Schema.Types.ObjectId, ref: 'Project'}
})

module.exports = model('Task',TaskSchema);