const UploadModel = require('../models/upload-model');
const FileModel = require('../models/file-model');

class UploadService {
  async create( project_id, name,type, data ) {
    // bufferData = new Buffer(data.split(",")[1],"base64");
    const file = await FileModel.create({data:data});
    const upload = await UploadModel.create({name: name,type:type,Project:project_id,data:file._id});

    return upload;
  }

  async getAll(project_id) {
    const allUploads = await UploadModel.find({Project:project_id});
    return allUploads;
  }
 
  async find(upload_id) { 
    const upload = await UploadModel.findById(upload_id);
    const file = await FileModel.findById(upload.data);
    return {name:upload.name,type:upload.type,data:file.data,Project:upload.Project,};
  }

  async update(upload_id, name) {
    const upload = await UploadModel.findByIdAndUpdate(upload_id,
      { $set:{name:name}},
      { returnOriginal: false });
    
    return upload;
  }

  async delete(upload_id) {
    const upload = await UploadModel.findByIdAndDelete(upload_id);
    return upload;
  }
}

module.exports = new UploadService()