const MessageModel = require('../models/message-model');

class MessageService {
  async create( chat_id,message, user_name  ) {
    const chat = await MessageModel.create({message: message,Chat:chat_id,message_owner:user_name});

    return chat;
  }

  async getAll(chat_id) {
    const allmessages = await MessageModel.find({Chat:chat_id});
    return allmessages;
  }

  async find(message_id) {
    const chat = await MessageModel.findById(message_id);
    return chat;
  }

  async update(message_id, message) {
    const updatedmessage = await MessageModel.findByIdAndUpdate(message_id,
      { $set:{message:message}},
      { returnOriginal: false });
    
    return updatedmessage;
  }

  async delete(message_id) {
    const deleted = await MessageModel.findByIdAndDelete(message_id);
    return deleted;
  }
}

module.exports = new MessageService()