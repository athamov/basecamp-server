const projectService = require('../service/project-service');
const tokenService = require('../service/token-service');
const TaskService = require('../service/task-service');
const SubtaskService = require('../service/subTask-service');

class TaskController {
  async create(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const { id } = req.params;
      const { task } = req.body;
      if(!refreshToken || !task || !id) return res.status(400).send('something went wrong');

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      await TaskService.create(id, task );

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
      const { id } = req.params;
      if(!refreshToken || !id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized');

      const AllTasks = await TaskService.getAll(id);
      if(!AllTasks) return res.status(204).send('tasks not found');
      
      return res.status(200).json(AllTasks);
    }
    catch(err) {
      console.log(err);
      res.json(err);
    }
  }

  async find(req, res, next) {
    const { refreshToken } = req.cookies; 
    const { id,task_id } = req.params;
    if(!refreshToken || !id || !task_id) res.status(400).send('something went wrong');
    const token = await tokenService.findToken(refreshToken);
    if(!token) return res.status(401).send('unavthorized')

    const permission = await projectService.checkPermission(id, token.user,'r');
    if(!permission) return res.status(403).send('you can not access this task');
    const task = await TaskService.find(task_id);

    if(!task) {
      return res.status(204).send("project not found");
    }

    return res.status(200).json(task)
  }

  async ChangeIsDone(req, res) {
    const { refreshToken } = req.cookies;
    const { id,task_id } = req.params;
    if(!refreshToken || !id || !task_id) return res.status(400).send('BadRequestError')
    // console.log("something");
    const token = await tokenService.findToken(refreshToken);
    if(!token) return res.status(401).send('unavthorized')
    const permission = await projectService.checkPermission(id, token.user,'u');
    if(!permission) return res.status(403).send('you are not allowed this action');

    const task = await TaskService.changeIsDone(task_id);
    if(task=='err') res.send(500).send('something went wrong with is done function');
    console.log(task)
    res.status(200).send('success');
  }

  async update(req, res, next) {
    try{
      const { refreshToken } = req.cookies;
      const { task } = req.body;
      const { id, task_id } = req.params;
      if(!refreshToken || !task_id || !task || !id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized');
      const permission = await projectService.checkPermission(id, token.user,'u');
      if(!permission) return res.status(403).send('you are not allowed this action');

      const updatedProject = await TaskService.update( task_id, task);

      if(!updatedProject) {
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
      const { id, task_id } = req.params;
      if(!refreshToken || !id || !task_id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')
 
      const permission = await projectService.checkPermission(id, token.user,'d');
      if(!permission) return res.status(403).send('you are not allowed this action');

      await TaskService.delete(task_id);
      return res.status(201).send('task deleted successfully');
    }
    catch(err) {
      console.log(err);
      res.json(err);
    }
  }

  async addSubtask(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const { id, task_id } = req.params;
      const { subtask } = req.body;
      if(!refreshToken || !task_id || !subtask || !id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'a');
      if(!permission) return res.status(403).send('you are not allowed this action');

      await SubtaskService.create(task_id, subtask)

      return res.status(200).send('subtask added successfully');
    }
    catch(err) {
      console.error(err);
    }
  }

  async getAllSubtasks(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const { id, task_id } = req.params;
      if(!refreshToken || !id || !task_id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized');

      const subtask = await SubtaskService.getAll(task_id);
      if(!task_id) return res.status(203).send('this task has not any subtask');

      return res.status(200).json(subtask);
    }
    catch(err) {
      console.error(err);
    }
  }

  async getSubtask(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const { id, subtask_id } = req.params;
      if(!refreshToken || !subtask_id || !id) return res.status(400).send('BadRequestError')
      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'r');
      if(!permission) return res.status(403).send('you are not allowed this action');

      const subtask = await SubtaskService.find(subtask_id);
      if(!subtask) return res.status(204).send('Member not found');

      return res.status(200).json(subtask);
    }
    catch(err) {
      console.error(err);
    }
  }

  async ChangeSubIsDone(req, res) {
    const { refreshToken } = req.cookies;
    const { id, subtask_id } = req.params;
    if(!refreshToken || !id || !subtask_id) return res.status(400).send('BadRequestError')
    
    const token = await tokenService.findToken(refreshToken);
    if(!token) return res.status(401).send('unavthorized')
    const permission = await projectService.checkPermission(id, token.user,'u');
    if(!permission) return res.status(403).send('you are not allowed this action');

    const subtask = await SubtaskService.changeIsDone(subtask_id);
    if(subtask=='err') res.send(500).send('something went wrong with is done function');

    res.status(200).send('success');
  }

  async updateSubtask(req, res, next) {
    try{
      const { refreshToken } = req.cookies;
      const { subtask } = req.body;
      const { id, subtask_id } = req.params;
      if(!refreshToken || !subtask_id || !subtask || !id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')
      const permission = await projectService.checkPermission(id, token.user,'u');
      if(!permission) return res.status(403).send('you are not allowed this action');

      const updated = await SubtaskService.update( subtask_id, subtask);

      if(!updated) {
        res.send("something went wrong! Check your requests and try again");
      }
      return res.status(200).send('updated succesfully');
    }
    catch(err){
      console.log(err);
    }
  }

  async deleteSubtask(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const { id, subtask_id } = req.params
      if(!refreshToken || !subtask_id || !id) return res.status(400).send('BadRequestError');

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'a');
      if(!permission) return res.status(403).send('you are not allowed this action');

      await SubtaskService.delete(subtask_id);

      return res.status(200).send('deleted successfully');
    }
    catch(err) {
      console.error(err);
    }
  }
}

module.exports = new TaskController();