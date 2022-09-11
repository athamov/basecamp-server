const {Schema, model } = require('mongoose');

const UploadSchema = new Schema({
  name: {type: String,required: true},
  type: {type: String,enum:['image/png','image/jpg','application/pdf','text/plain'],required: true},
  // data: {type:String,required: true},
  data:{type:Schema.Types.ObjectId, ref: 'File'},
  Project: {type: Schema.Types.ObjectId, ref: 'Project'}
})

module.exports = model('Upload',UploadSchema);