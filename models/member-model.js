const {Schema, model } = require('mongoose');

const MemberSchema = new Schema({
  User:{type: Schema.Types.ObjectId, ref: 'User'},
  Project: {type: Schema.Types.ObjectId, ref: 'Project'},
  role:{type:String,enum:['admin','user']},
  request: {
    Update:{type:Boolean,required:true},
    Delete:{type:Boolean,required:true},
    Write:{type:Boolean,required:true},
    Read:{type:Boolean,required:true}
  }
})

module.exports = model('Member',MemberSchema) 