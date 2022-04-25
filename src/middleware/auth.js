//var app = require("express")();
const jwt = require("jsonwebtoken");
// const userModel = require("../models/userModel");

const mid1 = async function (req, res, next) {
  let token = req.headers["x-Auth-token"];
  if (!token) token = req.headers["x-auth-token"];
  if (!token) return res.send({ status: false, msg: "token must be present" });

// //----------------------method 2 to verify token-----------------//
  try{
    let decodedToken = jwt.verify(token,"functionup-uranium")
//  req["decodedToken"]=decodedToken
 next();
 }
catch(error){return res.send({ status: false, msg: "token is invalid"})}


  //------------------------method 1 to verify token-------------------//
  // let decodedToken = jwt.verify(token,"functionup-uranium",(err, decoded) => {
  //     // err
  //     console.log(err);
  //     // decoded 
  //     console.log(decoded);
  //     if (!decoded) {
  //       return res.send({ status: false, msg: "token is invalid" });
  //     } else {
  //       next();
  //     }
  //   });
};

const mid2 =function(req,res,next){
try{
  let token = req.headers["x-auth-token"];
  let decodedToken = jwt.verify(token,"functionup-uranium")
  console.log(decodedToken)
    let userToBeModified = req.params.userId
    let userLoggedIn = decodedToken.userId
    if(userToBeModified != userLoggedIn) {return res.send({status: false, msg: 'User logged is not allowed to modify the requested users data'})
    }else{
    next();
    }
  }catch(err){
    res.status(500).send({msg:err.message})
  }
}

module.exports.mid1 = mid1;
module.exports.mid2 = mid2;