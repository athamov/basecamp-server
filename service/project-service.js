const memberService = require('./member-service');
const ProjectModel = require('../models/project-model');
const Apierror = require('../exceptions/api-error');

const callback = (err, result) => {
  if (err) {return err;}
}

class ProjectService {
  async createProject( id, project_name, project_description ) {
    const project = await ProjectModel.create({project_name: project_name, description: project_description});
    await memberService.newMember(id, project._id, 'admin');

    return project;
  }

  async getAllProject(user_id) {
    const joinedMember = await memberService.userMemberships(user_id);
    const projects_id =  joinedMember.map(member =>{
      if(member.Project != undefined) return member.Project
    })

    const allProjects = await ProjectModel.find({ '_id': { $in: projects_id } });

    return allProjects;
  }

  async findProject(project_id) {
    const project = await ProjectModel.findById(project_id);
  
    return project;
  }

  async updateProject(project_id, project_name, project_description) {

    const project = await ProjectModel.findByIdAndUpdate(project_id,
      { $set:{project_name:project_name, description:project_description}},
      { returnOriginal: false });
    
    return project;
  }

  async deleteProject(project_id) {
    const project = await ProjectModel.findByIdAndDelete(project_id);
    return project;
  }

  async checkPermission(project_id, user_id, permission) {
    const user = await memberService.findMember(project_id, user_id);
    if(!user) return null;
    switch(permission) {
      case 'r':
        return user.request.Read;
      case 'w':
        return user.request.Write;
      case 'u':
        return user.request.Update;
      case 'd':
        return user.request.Delete;
      case 'a':
        return user.role == 'admin'
    }
  }
}

module.exports = new ProjectService()