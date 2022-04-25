const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");





const createUser = async function (abc, pqr) {
  try{
  let data = abc.body;
  let savedData = await userModel.create(data);
  pqr.status(201).send({ msg: savedData });
}catch(err){
  pqr.status(500).send({msg:err.message})
}
};



const loginUser = async function (req, res) {

  let userName = req.body.emailId;
  let password = req.body.password;
try{
  let user = await userModel.findOne({ emailId: userName, password: password });
  if (!user)
    return res.status(200).send({
      status: false,
      msg: "username or the password is incorerct",
    });
 
  let token = jwt.sign(
    {
      userId: user._id.toString(),
      batch: "uranium",
      organisation: "FUnctionUp",
    },
    "functionup-uranium"
  );
  res.setHeader("x-auth-token", token);
  res.send({ status: true, data: token });
 }catch(err){
  res.status(500).send({msg:err.message})
}


};



const getUserData = async function (req, res) {
  try{
  let userId = req.params.userId;
  let userDetails = await userModel.findById(userId);
  if (!userDetails)
    return res.status(404).send({ status: false, msg: "No such user exists" });
  res.send({ status: true, data: userDetails });
}catch(err){
  res.status(500).send({msg:err.message})
}

};



const updateUser = async function (req, res) {
  try{
  let userId = req.params.userId;
  let user = await userModel.findById(userId);
  if (!user) {
    return res.send("No such user exists");
  }

  let userId1= req.params.userId;
  let newAge = req.body.age;
  let updatedUser = await userModel.findOneAndUpdate(
    { _id: userId1 }, 
      {$set:{age : newAge}}
    );
  res.send({ status: true, data: updatedUser });
}catch(err){
  res.status(500).send({msg:err.message})
}

};





let deleteUser = async function(req, res){
try{
  let userId = req.params.userId;
  let user = await userModel.findById(userId);
  if (!user) {
    return res.send("No such user exists");
  }

  let userData = req.params.userId;
  let updatedUser = await userModel.findOneAndUpdate(
    { _id: userData }, 
    {$set : {isDeleted : true}},
    { new: true }
  );

  res.send({ status:true, data: updatedUser });
}catch(err){
  res.status(500).send({msg:err.message})
}

};



const postMessage = async function (req, res) {
try{
    let user = await userModel.findById(req.params.userId)
    if(!user) return res.send({status: false, msg: 'No such user exists'})
    
    //add the message to user's posts
    let message = req.body.posts
    let updatedUser = await userModel.findOneAndUpdate({_id: user._id},{posts:message}, {new: true})

    //return the updated user document
    return res.send({status: true, data: updatedUser})
  }catch(err){
    res.status(404).send({msg:"Not found"})
  }  
}




module.exports.createUser = createUser;
module.exports.getUserData = getUserData;
module.exports.updateUser = updateUser;
module.exports.loginUser = loginUser;
module.exports.deleteUser = deleteUser;
module.exports.postMessage = postMessage;