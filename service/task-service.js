const TaskModel = require('../models/task-model');

class TaskService {
  async create( project_id, task_name ) {
    const task = await TaskModel.create({task_name: task_name,Project:project_id});

    return task;
  }

  async getAll(project_id) {
    const allTasks = await TaskModel.find({Project:project_id});
    return allTasks;
  }

  async find(task_id) {
    const task = await TaskModel.findById(task_id);
    return task;
  }

  async changeIsDone(task_id) {
    const task = TaskModel.updateOne(
      { _id: task_id},
      [ { "$set": { "is_done": { "$eq": [false, "$is_done"] } } } ]
    )
  return task;
  }

  async update(task_id, task_name) {
    const task = await TaskModel.findByIdAndUpdate(task_id,
      { $set:{task_name:task_name,is_done:false}},
      { returnOriginal: false });
    
    return task;
  }

  async delete(task_id) {
    const task = await TaskModel.findByIdAndDelete(task_id);
    return task;
  }
}

module.exports = new TaskService()