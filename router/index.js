const Router = require('express').Router
const UserController = require('../controller/user-controller');
const ProjectController = require('../controller/project-controller');
const TaskController = require('../controller/task-controller');
const ChatController = require('../controller/chat-controller');
const fileController = require('../controller/file-controller')
const {body} = require('express-validator');
const authMiddleware = require('../middleware/auth-middleware')

const router = new Router(); 

//! AuthMiddleware checks your header there must be 'Authorization':`Bearer ${user's accesToken}`

// * Auth
router.post('/registration',
body('email').isEmail(),
body('password').isLength({min:3,max:20}),
UserController.registration); 
router.post('/login',UserController.login);
router.post('/logout',UserController.logout);
router.get('/activate/:link',UserController.activate);
router.get('/refresh',UserController.refresh);

/** 
 * * User
 * *update 
 * @param req.cookies = {refreshToken}
 * @param req.body = { name, email, newPassword, oldPassword }
 * @param return = { }
 */
router.get('/users',authMiddleware,UserController.sendAllUsers);
router.get('/user',authMiddleware,UserController.sendUser);
router.put('/user',authMiddleware,UserController.update);
router.delete('/user',authMiddleware,UserController.delete);

// * Project
/** 
 * *Post Create
 * @param req.cookies = { refreshToken }
 * @param req.body == { project_name:string, project_description:string } 
 * 
 * *Get All Project
 * @param req.cookies = { refreshToken }
 * 
 * *Get Project 
 * @param req.cookies = {refreshToken}
 * @param req.body = { project_id }
 * 
 * *Put update project
 * @param req.cookies = {refreshToken}
 * @param req.body = { project_name, project_description }
 * 
 * *Delete delete project
 * @param req.cookies = {refreshToken}
 * @param req.body = { project_id }
 * 
*/
router.post('/project',authMiddleware,ProjectController.create);
router.get('/project/:id',authMiddleware,ProjectController.getProject);
router.put('/project/:id',authMiddleware,ProjectController.updateProject);
router.delete('/project/:id',authMiddleware,ProjectController.deleteProject);
router.get('/all-project',authMiddleware,ProjectController.getAllProject);

// * Member
/** 
 * * Post Member  for new member
 * @param req.cookies = {refreshToken}
 * @param req.params = { id } id is project's id
 * @param req.body = { user_email , role, request }  role must be 'admin' or 'user' and request =  request: {
    Update:true false,
    Delete:true false,
    Write:true false,
    Read:true false,
  }
  * * Get Member  
  * @param return {
  * member:{
  * _id;
  * User;
  * Project;
  * role;
  * }
  * user:{
  * user_data
  * }
  * }

 * * Put Member for update member 
  @param req.cookies = { refreshToken }
  @param req.params = { id, member_id }
  @param req.body = { role, request }  
 
 * * Delete Member
  @param req.cookies = { refreshToken }
  @param req.params = { id, member_id}
 */
router.post('/project/:id/member', authMiddleware, ProjectController.addMember);
router.get('/project/:id/member',authMiddleware, ProjectController.getAllMebers);
router.get('/project/:id/member/:member_id', authMiddleware, ProjectController.getMember);
router.put('/project/:id/member/:member_id', authMiddleware,ProjectController.updateMember);
router.delete('/project/:id/member/:member_id', authMiddleware,ProjectController.deleteMember);

/** 
 * *Post Create
 * @param req.cookies = { refreshToken }
 * @param req.params = { id } project id
 * @param req.body == { task_name:string } 
 * 
 * *Get All Tasks in that project
 * @param req.cookies = { refreshToken }
 * @param req.params = { id } project id
 * 
 * *Get task 
 * @param req.cookies = { refreshToken }
 * @param req.params = { id, task_id } id is project id
 * 
 * *ChangeIsDone 
 * @param req.cookies = { refreshToken }
 * @param req.params = { id, task_id } id is project id
 * 
 * *Put update project
 * @param req.cookies = {refreshToken}
 * @param req.params = { id, task_id } id is project id
 * @param req.body = { task_name }
 * 
 * *Delete delete project
 * @param req.cookies = {refreshToken}
 * @param req.params = { id, task_id } id is project id
 * 
*/
router.post('/project/:id/task', authMiddleware, TaskController.create);
router.get('/project/:id/task',authMiddleware, TaskController.getAll);
router.get('/project/:id/task/:task_id', authMiddleware, TaskController.find);
router.post('/project/:id/task/:task_id', authMiddleware,TaskController.ChangeIsDone); 
router.put('/project/:id/task/:task_id', authMiddleware,TaskController.update);
router.delete('/project/:id/task/:task_id', authMiddleware,TaskController.delete);

/** 
 * * Post Create
 * @param req.cookies = { refreshToken }
 * @param req.params = { id } project id
 * @param req.body == { subtask:string } 
 * 
 * * Get All Tasks in that project
 * @param req.cookies = { refreshToken }
 * @param req.params = { id, task_id } project id
 * 
 * * Get task 
 * @param req.cookies = { refreshToken }
 * @param req.params = { id, subtask_id } id is project id
 * 
 * * ChangeIsDone 
 * @param req.cookies = { refreshToken }
 * @param req.params = { id, subtask_id } id is project id
 * 
 * * Put update project
 * @param req.cookies = {refreshToken}
 * @param req.params = { id, subtask_id } id is project id
 * @param req.body = { subtask }
 * 
 * * Delete delete project
 * @param req.cookies = {refreshToken}
 * @param req.params = { id, subtask_id } id is project id
 * 
*/
router.post('/project/:id/task/:task_id/subtask', authMiddleware, TaskController.addSubtask);
router.get('/project/:id/task/:task_id/subtask',authMiddleware, TaskController.getAllSubtasks);
router.get('/project/:id/subtask/:subtask_id', authMiddleware, TaskController.getSubtask);
router.post('/project/:id/subtask/:subtask_id', authMiddleware,TaskController.ChangeSubIsDone);
router.put('/project/:id/subtask/:subtask_id', authMiddleware,TaskController.updateSubtask);
router.delete('/project/:id/subtask/:subtask_id', authMiddleware,TaskController.deleteSubtask);

/** 
 * * Post Create
 * @param req.cookies = { refreshToken }
 * @param req.params = { id } project id
 * @param req.body == { subtask:string } 
 * 
 * * Get All Chat in that project
 * @param req.cookies = { refreshToken }
 * @param req.params = { id, task_id } project id
 * 
 * * Get chat 
 * @param req.cookies = { refreshToken }
 * @param req.params = { id, subtask_id } id is project id
 * 
 * * Put update chat
 * @param req.cookies = {refreshToken}
 * @param req.params = { id, subtask_id } id is project id
 * @param req.body = { subtask }
 * 
 * * Delete delete chat
 * @param req.cookies = {refreshToken}
 * @param req.params = { id, subtask_id } id is project id
 * 
*/
router.post('/project/:id/chat', authMiddleware, ChatController.create);
router.get('/project/:id/chat',authMiddleware, ChatController.getAll);
router.get('/project/:id/chat/:chat_id', authMiddleware, ChatController.find);
router.put('/project/:id/chat/:chat_id', authMiddleware,ChatController.update);
router.delete('/project/:id/chat/:chat_id', authMiddleware,ChatController.delete);

router.post('/project/:id/chat/:chat_id/message', authMiddleware, ChatController.addMessage);
router.get('/project/:id/chat/:chat_id/message',authMiddleware, ChatController.getAllMessages);
router.get('/project/:id/message/:message_id', authMiddleware, ChatController.findMessage);
router.put('/project/:id/message/:message_id', authMiddleware,ChatController.updateSubtask);
router.delete('/project/:id/message/:message_id', authMiddleware,ChatController.deleteMessage);

router.post('/upload',fileController.postFile)
router.get('/upload',fileController.getFIle);

module.exports = router;