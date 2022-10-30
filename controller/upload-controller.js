const tokenService = require('../service/token-service');
const projectService = require('../service/project-service');
const UploadService = require('../service/upload-service');
const MessageService = require('../service/message-service'); 
const UserService = require('../service/user-service');
var stream = require('stream');

class Format64 {
  async getBase64(file) {
    // let data = 'stackabuse.com';
    let base64data = await file.buffer.toString('base64');
    
    return base64data;
 }
}

class UploadController {
  async create(req, res, next) {
    try {
      const refreshToken = req.headers.authorization;

      const { id } = req.params;
      const { base64data,name } = req.body;
      if(!refreshToken || !base64data || !name || !id) return res.status(400).send('something went wrong');

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized');

      let [brokenType,data] = base64data.split(','); 
      let type = brokenType.split(':')[1].split(';')[0];
      const result = await UploadService.create(id,name,type,data);
      res.status(200).send("created succesfully");
    }
    catch(err) {
      console.log(err);
      res.status(500).send(err).send('please try again or connect with us');
    }
  }

  async getAll(req, res, next) {
    try{
      const refreshToken = req.headers.authorization;

      const { id } = req.params
      if(!refreshToken || !id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized');
      
      const AllResponse = await UploadService.getAll(id);
      if(!AllResponse) return res.status(404).send('there are any files in this project')

      return res.status(200).json(AllResponse);
    }
    catch(err) {
      console.log(err);
      res.json(err);
    }
  }

  async find(req, res, next) {
    // const { refreshToken } = req.cookies; 
    const { id, upload_id } = req.params;
    if(!id || !upload_id) res.status(400).send('something went wrong');

    // const token = await tokenService.findToken(refreshToken);
    // if(!token) return res.status(401).send('unavthorized')

    // const permission = await projectService.checkPermission(id, token.user,'r');
    // if(!permission) return res.status(403).send('you can not access this task');
    const file = await UploadService.find(upload_id);
    let bufferData = Buffer.from(file.data,'base64');
    // console.log(bufferData);
    var readStream = new stream.PassThrough();
    readStream.end(bufferData);
  
    res.set('Content-disposition', 'attachment; filename=' + file.name);
    res.set('Content-Type', file.type);
  
    readStream.pipe(res);

    if(!file) {
      return res.status(204).send("file not found");
    }

    return res.status(200).download(file.data);
  }

  async update(req, res, next) {
    try{
      const refreshToken = req.headers.authorization;

      const { id, upload_id } = req.params;
      const { name } = req.body;
      if(!refreshToken || !upload_id || !name || !id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')
      const permission = await projectService.checkPermission(id, token.user,'u');
      if(!permission) return res.status(403).send('you are not allowed this action');

      const updated = await UploadService.update( upload_id, name);

      if(!updated) {
        res.send("something went wrong! Check your requests and try again");
      }
      return res.status(200).send('updated succesfully');
    }
    catch(err){
      console.log(err);
    }
  }

  async delete(req, res, next) {
    try{
      const refreshToken = req.headers.authorization;

      const { id, upload_id } = req.params;
      if(!refreshToken || !id || !upload_id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'d');
      if(!permission) return res.status(403).send('you are not allowed this action');

      await UploadService.delete(upload_id);
      return res.status(200).send('deleted successfully');
    }
    catch(err) {
      console.log(err);
      res.json(err);
    }
  }
}

module.exports = new UploadController();