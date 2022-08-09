const projectService = require('../service/project-service');
const memberService = require('../service/member-service');
const tokenService = require('../service/token-service');

class ProjectController {
  async create(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const { project_name, project_description } = req.body;
      const token = await tokenService.findToken(refreshToken);
      const projectData = await projectService.createProject( token.user, project_name, project_description );

      return res.json(projectData);
    }
    catch(err) {
      console.log(err);
      res.json(err);
    }
  }

  async getAllProject(req, res, next) {
    try{
      const { refreshToken } = req.cookies;
      const token = await tokenService.findToken(refreshToken);
      const AllProjects = await projectService.getAllProject(token.user);

      return res.json(AllProjects);
    }
    catch(err) {
      console.log(err);
      res.json(err);
    }
  }

  async getProject(req, res, next) {
    const { refreshToken } = req.cookies;
    const { id } = req.params;
    console.log(id);
    const token = await tokenService.findToken(refreshToken);
    const permission = await projectService.checkPermission(id, token.user,'r');
    if(!permission) {
      res.send('you are not allowed this action');
    }
    const project = await projectService.findProject(id);

    if(!project) {
      res.status(404).send("project not found");
    }

    return res.json(project)
  }

  async postProject(req, res, next) {
    const { id } = req.params;
    console.log(id);
    next(id);
  }

  async updateProject(req, res, next) {
    try{
      const { refreshToken } = req.cookies;
      const { project_name, project_description } = req.body;
      const { id } = req.params;

      const token = await tokenService.findToken(refreshToken);
      const permission = await projectService.checkPermission(id, token.user,'u');
      if(!permission) {
        res.send('you are not allowed this action');
      }
      const updatedProject = await projectService.updateProject(id, project_name, project_description);

      if(!updatedProject) {
        res.send("something went wrong! Check your requests and try again");
      }
      return res.json(updatedProject);
    }
    catch(err){
      console.log(err);
    }
  }

  async deleteProject(req, res, next) {
    try{
      const { refreshToken } = req.cookies;
      const { id } = req.params;

      const token = await tokenService.findToken(refreshToken);
      console.log(id);
      const permission = await projectService.checkPermission(id, token.user,'d');
      if(!permission) {
        res.send('you are not allowed this action');
      }
      const project = await projectService.deleteProject(id);
      await memberService.deleteAllMembers(id);
      return res.json(project);
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
      const { user_email , role, request } = req.body;
      const token = await tokenService.findToken(refreshToken);
      const permission = await projectService.checkPermission(id, token.user,'a');
      if(!permission) {
        res.send('you are not allowed this action'); 
      } 
      const memberData = await memberService.newMember(user_email, id, role, request)

      return res.json(memberData);
    }
    catch(err) {
      console.error(err);
    }
  }

  async getAllMebers(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const { id } = req.params

      const membersData = await memberService.projectMembership(id);

      return res.json(membersData);
    }
    catch(err) {
      console.error(err);
    }
  }

  async getMember(req, res, next) {
    try {
      const { refreshToken } = req.cookies
      const { id, member_id } = req.params

      const token = await tokenService.findToken(refreshToken);
      const permission = await projectService.checkPermission(id, token.user,'a');
      if(!permission) {
        res.send('you are not allowed this action');
      }
      const memberData = await memberService.getUser(member_id);

      return res.json(memberData);
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
      const permission = await projectService.checkPermission(id, token.user,'a');
      if(!permission) {
        res.send('you are not allowed this action');
      }
      const memberData = await memberService.updateMember(member_id, role, request);

      return res.json(memberData);
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
      const permission = await projectService.checkPermission(id, token.user,'a');
      if(!permission) {
        res.send('you are not allowed this action');
      }
      const memberData = await memberService.deleteMember(member_id);

      return res.json(memberData);
    }
    catch(err) {
      console.error(err);
    }
  }
}

module.exports = new ProjectController();