const {Schema, model } = require('mongoose');

const FileSchema = new Schema({
  data:{type:String, required:true},
})

module.exports = model('File',FileSchema);