const projectService = require('../service/project-service');
const memberService = require('../service/member-service');
const tokenService = require('../service/token-service');

class ProjectController {
  async create(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const { project_name, project_description } = req.body;
      if(!refreshToken || !project_name || !project_description) return res.status(400).send('something went wrong');

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      await projectService.createProject( token.user, project_name, project_description );

      return res.status(201).send('created');
    }
    catch(err) {
      console.log(err);
      res.status(500).send(err).send('please try again or connect with us');
      
    }
  }

  async getAllProject(req, res, next) {
    try{
      const { refreshToken } = req.cookies;
      if(!refreshToken) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized');

      const AllProjects = await projectService.getAllProject(token.user);
      if(!AllProjects) return res.status(204).send('projects not found');
      
      return res.status(200).json(AllProjects);
    }
    catch(err) {
      console.log(err);
      res.json(err);
    }
  }

  async getProject(req, res, next) {
    const { refreshToken } = req.cookies; 
    const { id } = req.params;
    if(!refreshToken || !id) res.status(400).send('something went wrong')
    const token = await tokenService.findToken(refreshToken);
    if(!token) return res.status(401).send('unavthorized')

    const permission = await projectService.checkPermission(id, token.user,'r');
    if(!permission) return res.status(403).send('you are not allowed this action');
    const project = await projectService.findProject(id);

    if(!project) {
      return res.status(204).send("project not found");
    }

    return res.status(200).json(project)
  }

  async updateProject(req, res, next) {
    try{
      const { refreshToken } = req.cookies;
      const { project_name, project_description } = req.body;
      const { id } = req.params;
      if(!refreshToken || !project_name || !project_description || !id) return res.status(400).send('BadRequestError')

      if(!refreshToken || !project_name || !project_description || !id) { 
        return res.status(403).send('something went wrong')
      }

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')
      const permission = await projectService.checkPermission(id, token.user,'u');
      if(!permission) return res.status(403).send('you are not allowed this action');

      const updatedProject = await projectService.updateProject(id, project_name, project_description);

      if(!updatedProject) {
        res.send("something went wrong! Check your requests and try again");
      }
      return res.status(200).send('updated succesfully');
    }
    catch(err){
      console.log(err);
    }
  }

  async deleteProject(req, res, next) {
    try{
      const { refreshToken } = req.cookies;
      const { id } = req.params;
      if(!refreshToken || !id) return res.status(400).send('BadRequestError')


      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'d');
      if(!permission) return res.status(403).send('you are not allowed this action');

      const project = await projectService.deleteProject(id);
      await memberService.deleteAllMembers(id);
      return res.status(200).send('project deleted successfully');
    }
    catch(err) {
      console.log(err);
      res.json(err);
    }
  }

  async addMember(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const { id } = req.params;
      const { email , role, request } = req.body;
      if(!refreshToken || !email || !role || !request || !id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'a');
      if(!permission) return res.status(403).send('you are not allowed this action');

      await memberService.newMember(email, id, role, request)

      return res.status(201).send('member added successfully');
    }
    catch(err) {
      console.error(err);
    } 
  }

  async getAllMebers(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const { id } = req.params;
      if(!refreshToken || !id) return res.status(400).send('BadRequestError')

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized');

      const permission = await projectService.checkPermission(id, token.user,'r');
      if(!permission) return res.status(403).send('you are not allowed this action');

      const membersData = await memberService.projectMembership(id);
      if(!membersData) return res.status(203).send('this project has not any member');

      return res.status(200).json(membersData);
    }
    catch(err) {
      console.error(err);
    }
  }

  async getMember(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const { id, member_id } = req.params
      if(!refreshToken || !member_id || !id) return res.status(400).send('BadRequestError')
      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'a');
      if(!permission) return res.status(403).send('you are not allowed this action');

      const memberData = await memberService.getUser(member_id);
      console.log(memberData);
      if(!memberData) return res.status(204).send('Member not found');

      return res.status(200).json(memberData);
    }
    catch(err) {
      console.error(err);
    }
  }

  async updateMember(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const { id, member_id} = req.params;
      const { role, request } = req.body;

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'a');
      if(!permission) return res.status(403).send('you are not allowed this action');

      await memberService.updateMember(member_id, role, request);

      return res.status(200).send('updated successfully');
    }
    catch(err) {
      console.error(err);
    }
  }

  async deleteMember(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const { id, member_id } = req.params

      const token = await tokenService.findToken(refreshToken);
      if(!token) return res.status(401).send('unavthorized')

      const permission = await projectService.checkPermission(id, token.user,'a');
      if(!permission) return res.status(403).send('you are not allowed this action');

      await memberService.deleteMember(member_id);

      return res.status(200).send('deleted successfully');
    }
    catch(err) {
      console.error(err);
    }
  }
}

module.exports = new ProjectController();