const tokenService = require('../service/token-service');
const projectService = require('../service/project-service');
const ChatService = require('../service/chat-service');
const MessageService = require('../service/message-service');
const UserService = require('../service/user-service');

class ChatController {
  async create(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const { id } = req.params;
      const { name } = req.body;
      if(!refreshToken || !name || !id) return res.status(400).send('something went wrong');

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      await ChatService.create(id, name );

      return res.status(201).send('created');
    }
    catch(err) {
      console.log(err);
      res.status(500).send(err).send('please try again or connect with us');
    }
  }

  async getAll(req, res, next) {
    try{
      const { refreshToken } = req.cookies;
      const { id } = req.params
      if(!refreshToken || !id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized');
 
      const chats = await ChatService.getAll(id);
      if(!chats) return res.status(204).send('chats not found');
      
      return res.status(200).json(chats);
    }
    catch(err) {
      console.log(err);
      res.json(err);
    }
  }

  async find(req, res, next) {
    const { refreshToken } = req.cookies; 
    const { id, chat_id } = req.params;
    if(!refreshToken || !id || !chat_id) res.status(400).send('something went wrong');

    const token = await tokenService.findToken(refreshToken);
    if(!token) return res.status(401).send('unavthorized')

    const permission = await projectService.checkPermission(id, token.user,'r');
    if(!permission) return res.status(403).send('you can not access this task');
    const chat = await ChatService.find(chat_id);

    if(!chat) {
      return res.status(204).send("project not found");
    }

    return res.status(200).json(chat)
  }

  async update(req, res, next) {
    try{
      const { refreshToken } = req.cookies;
      const { id, chat_id } = req.params;
      const { name } = req.body;
      if(!refreshToken || !chat_id || !name || !id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')
      const permission = await projectService.checkPermission(id, token.user,'u');
      if(!permission) return res.status(403).send('you are not allowed this action');

      const updated = await ChatService.update( chat_id, name);

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
      const { refreshToken } = req.cookies;
      const { id, chat_id } = req.params;
      if(!refreshToken || !id || !chat_id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'d');
      if(!permission) return res.status(403).send('you are not allowed this action');

      await ChatService.delete(chat_id);
      return res.status(200).send('project deleted successfully');
    }
    catch(err) {
      console.log(err);
      res.json(err);
    }
  }

  async addMessage(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const { chat_id ,id } = req.params;
      const { message } = req.body;
      if(!refreshToken || !chat_id || !message || !id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'a');
      if(!permission) return res.status(403).send('you are not allowed this action');
      const user = await UserService.getUserById(token.user);
      await MessageService.create(chat_id, message,user.name);

      return res.status(201).send('message send successfully');
    }
    catch(err) {
      console.error(err);
    }
  }

  async getAllMessages(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const { chat_id, id } = req.params;
      if(!refreshToken || !id || !chat_id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized');

      const subtask = await MessageService.getAll(chat_id);
      if(!chat_id) return res.status(203).send('this task has not any subtask');

      return res.status(200).json(subtask);
    }
    catch(err) {
      console.error(err);
    }
  }

  async findMessage(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const { message_id,id } = req.params;
      if(!refreshToken || !message_id || !id) return res.status(400).send('BadRequestError')
      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'r');
      if(!permission) return res.status(403).send('you are not allowed this action');

      const subtask = await MessageService.find(message_id);
      if(!subtask) return res.status(204).send('Member not found');

      return res.status(200).json(subtask);
    }
    catch(err) {
      console.error(err);
    }
  }

  async updateSubtask(req, res, next) {
    try{
      const { refreshToken } = req.cookies;
      const { message_id, id } = req.params;
      const { message } = req.body;
      if(!refreshToken || !message_id || !message || !id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')
      const permission = await projectService.checkPermission(id, token.user,'u');
      if(!permission) return res.status(403).send('you are not allowed this action');

      const updated = await MessageService.update( message_id, message);

      if(!updated) {
        res.send("something went wrong! Check your requests and try again");
      }
      return res.status(200).send('updated succesfully');
    }
    catch(err){
      console.log(err);
    }
  }

  async deleteMessage(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const { message_id, id } = req.params
      if(!refreshToken || !message_id || !id) return res.status(400).send('BadRequestError');

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'a');
      if(!permission) return res.status(403).send('you are not allowed this action');

      await MessageService.delete(message_id);

      return res.status(200).send('deleted successfully');
    }
    catch(err) {
      console.error(err);
    }
  }
}

module.exports = new ChatController();