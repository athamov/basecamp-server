const ChatModel = require('../models/chat-model');
const MessageModel = require('../models/message-model');
class ChatService {
  async create( project_id, chat_name ) {
    const chat = await ChatModel.create({chat_name: chat_name,Project:project_id});

    return chat;
  }

  async getAll(project_id) {
    const allChats = await ChatModel.find({Project:project_id});
    return allChats;
  }

  async find(chat_id) {
    const chat = await ChatModel.findById(chat_id);
    const messages = await MessageModel.find({Chat:chat_id});
    return {chat, messages:messages};
  }

  async update(chat_id, chat_name) {
    const chat = await ChatModel.findByIdAndUpdate(chat_id,
      { $set:{chat_name:chat_name}},
      { returnOriginal: false });
    
    return chat;
  }

  async delete(chat_id) {
    const chat = await ChatModel.findByIdAndDelete(chat_id);
    return chat;
  }
}

module.exports = new ChatService()