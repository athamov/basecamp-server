const Router = require('express').Router
const UserController = require('../controller/user-controller');
const ProjectController = require('../controller/project-controller');
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

router.post('/project/:id/member', authMiddleware, ProjectController.addMember);
router.put('/project/:id/member/:member_id', authMiddleware,ProjectController.updateMember);
router.delete('/project/:id/member/:member_id', authMiddleware,ProjectController.deleteMember);



module.exports = router;
