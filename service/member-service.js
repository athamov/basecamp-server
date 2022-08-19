const MemberModel = require('../models/member-model');
const UserService = require('./user-service');

const adminRequest = {
  Update:true,
  Delete:true,
  Write:true,
  Read:true
}

class memberService{
  async newMember(email, project_id, role, request) {
    const user = await UserService.getUser(email);

    if(role == 'admin') {
      request = adminRequest
    }

    const member = await MemberModel.create({User:user.id,Project:project_id ,role:role,request:request});
    MemberModel.findOne(member._id).
    populate('User').
    populate('Project').
    exec(function (err) {
      if (err) return handleError(err);
    });
    return member;
  }

  async projectMembership(project_id) {
    const members = await MemberModel.find({Project: project_id});
    let users = []
    for(let member of members) {
      let user = await UserService.getUserById(member.User);
      users.push({user: user,member:member})
    }
    // members.map(async member=>{
    //   let user = await UserService.getUserById(member.User);
      // member = Object.assign(member, {user_name: user.name});
      // let name = {name:user.name}
      // member = {...member, ...name}
      // console.log(member);
    //   return {member:member,user:user};
    // })
    console.log(users)
    return users
  }

  async getUser(member_id) {
    const member = await MemberModel.findById(member_id);
    if(!member) return ;
    const  user = await UserService.getUserById(member.User)
    return {user:user,member:member};
  }

  async findMember(project_id, user_id) {
    const member = await MemberModel.findOne({User:user_id,Project:project_id});
    return member;
  }

  async userMemberships(user_id) {
    const members = await MemberModel.find({User:user_id});
    return members;
  }

  async updateMember(member_id, role, request) {
    const updatedMember = await MemberModel.findOneAndUpdate({_id:member_id},
      { $set:{role:role, request:request}},
      { returnOriginal: false });
    
    return updatedMember;
  }

  async deleteMember(member_id) {
    const deleteMember = await MemberModel.findOneAndDelete({_id:member_id});

    return deleteMember;
  }

  async deleteAllMembers(project_id) {
    const deleteAllMembers = await MemberModel.deleteMany({Project:project_id});

    return deleteAllMembers;
  }
}

module.exports = new memberService();