const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");

const createBlog = async function (req, res) {
  //try-statement defines a code-block to run if there is an error or undefined variable then it handle catch-statement to handle the error.
  try {
    let data = req.body;
    let author = req.body.authorId;
    //console.log(author)

    //findById is used to find the single author _id, that matches the given id, given by the frontend.
    let Id = await authorModel.findById({ _id: author });
    //console.log(Id)
    if (Id) {
      let dataCreated = await blogModel.create(data);
      res.status(201).send({ data: dataCreated });
    } else {
      res.status(400).send({ msg: "Bad Request" });
    }
  } catch (err) {
    res.status(500).send({ msg: "error", error: err.message });
  }
};

//get API first part executed
const getBlog = async function (req, res) {
  try{
    let paramCat = req.query.category;
    let paramSub = req.query.subCategory;
    let paramId = req.query.authorId;
    let paramTag = req.query.tags;

    let division = await blogModel.find({
        $or: [
          { authorId: paramId },
          { category: paramCat },
          { subCategory: paramSub },
          { tags: paramTag },
        ],
      });

      let keys = Object.keys(division)

if(keys.length!=0){
      let data = division.filter(x => x.ispublished===true && x.isDeleted===false )

    if(data){
     res.status(200).send({ msg: data });
    }
    else { 
        res.status(404).send({msg : "Not Found"})
    } 
  }else {
    let blog = await blogModel.find({ ispublished: true, isDeleted: false });
   // console.log(blog)
    res.send({ msg: blog })
  }
    
  } catch (err) {
    res.status(500).send({ msg: "error", error: err.message });
  }
};



const updateBlog = async function(req,res){
  let blogId = req.params.blogId;
  let Body = req.body;
  const{title,body,tags,subCategory}=Body
  let blog = await blogModel.findOne({_id:blogId})
  
   if(!blog){
     return res.status(404).send({status:false,message:"No such title found"})
   }
  
  const updateBlogs =await blogModel.findOneAndUpdate({_id:req.params.blogId},{
    title: title,
    body : body,
    $addToSet:{tags:tags, subCategory: subCategory},
    ispublished:true
  
  },
  {new:true}
  )
  if(updateBlog.ispublished=true){
    updateBlog.ispublished = new Date()
    console.log(updateBlogs)
    res.status(200).send({status:true,message:"blog sccessfully",date:updateBlogs})
  }
  }


  
const deleteBlog = async function(req,res){
  let blogId = req.params.blogId;
  let blog = await blogModel.findOne({_id:blogId})
  
   if(!blog){
      res.status(404).send({status:false,message:"No such blog found"})
   }else{
    const deleteBlogs =await blogModel.findOneAndUpdate({_id:req.params.blogId},
    {isDeleted : true},
    {new : true}
   )
   res.send({status : true, msg:deleteBlogs})
}
}


module.exports.createBlog = createBlog;
module.exports.getBlog = getBlog;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlog = deleteBlog;




