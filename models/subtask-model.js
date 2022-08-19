const {Schema, model } = require('mongoose');

const SubtaskSchema = new Schema({
  subtask_name: {type: String,required: true},
  is_done: {type:Boolean,required: true,default: false},
  Task: {type: Schema.Types.ObjectId, ref: 'Task'}
})

module.exports = model('Subtask',SubtaskSchema);