const SubtaskModel = require('../models/subtask-model');

class SubtaskService {
  async create( task_id, subtask_name ) {
    const subtask = await SubtaskModel.create({subtask_name: subtask_name,Task:task_id});

    return subtask;
  }

  async getAll(task_id) {
    const allSubtask = await SubtaskModel.find({Task:task_id});
    return allSubtask;
  }

  async find(subtask_id) {
    const subtask = await SubtaskModel.findById(subtask_id);
    return subtask;
  }

  async changeIsDone(subtask_id) {
    const subtask = SubtaskModel.updateOne({ _id: subtask_id }, [ { "$set": { "is_done": { "$eq": [false, "$is_done"] } } } ]
    );
  return subtask;
  }

  async update(subtask_id, subtask_name) {
    const subtask = await SubtaskModel.findByIdAndUpdate(subtask_id,
      { $set:{subtask_name:subtask_name}},
      { returnOriginal: false });
    
    return subtask;
  }

  async delete(subtask_id) {
    const subtask = await SubtaskModel.findByIdAndDelete(subtask_id);
    return subtask;
  }
}

module.exports = new SubtaskService()