const {Schema, model } = require('mongoose');

const ProjectSchema = new Schema({
  project_name: {type: String,required: true},
  description: {type: String,required: true},
})

module.exports = model('Project',ProjectSchema);