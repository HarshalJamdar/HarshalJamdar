
const bookModel = require("../models/bookModel");
const { isValidRequestBody, isValid, isValidDate, isValidISBN } = require("../utilities/validator");
const userModel = require("../models/userModel");
const { isValidObjectId } = require("mongoose");



//---REGISTER USER
    const createBook = async function (req, res) {
    try {
    //==validating request body==//
        let requestBody = req.body
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: "Invalid request, please provide details" })
        let {title,excerpt ,userId, ISBN,category,subcategory,reviews,deletedAt,isDeleted, releasedAt } = requestBody

    //==validating title==//
        if (!isValid(title)) return res.status(400).send({ status: false, msg: "Title is a mendatory field" })
        let isUniqueTitle = await bookModel.findOne({ title: title})
        if (isUniqueTitle) return res.status(400).send({ status: false, msg: `${title} is already exist` })

    //==validating excerpt==//
        if (!isValid(excerpt)) return res.status(400).send({ status: false, msg: "Excerpt is a mendatory field" })

    //==validating userId==//
        if (!isValid(userId)) return res.status(400).send({ status: false, msg: "UserId is a mendatory field" })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, msg: `${userId}  is not a valid` })
        let isUniqueUserId= await userModel.findOne({ _id: userId})
        if(!isUniqueUserId)return res.status(404).send({status:false, msg:"User not found"})

    //==validating ISBN==//
        if (!isValid(ISBN)) return res.status(400).send({ status: false, msg: "ISBN is a mendatory field" })
        if(!isValidISBN(ISBN)) return res.status(400).send({ status: false, msg: "ISBN is invalid " })
        let isUniqueISBN= await bookModel.findOne({ ISBN: ISBN})
        if (isUniqueISBN) return res.status(400).send({ status: false, msg: `${ISBN} is already exist` })

    //==validating category==//   
        if (!isValid(category)) return res.status(400).send({ status: false, msg: "category is a mendatory field" })

    //==validating subcategory==//
        if (!isValid(subcategory)) return res.status(400).send({ status: false, msg: "subcategory is a mendatory field" })

    //==validating releasedAt==//
        if(!isValid(releasedAt))return res.status(400).send({status:false,msg:"releasedAt is mandatory field"})
        if(!isValidDate(releasedAt))return res.status(400).send({status:false,msg:"Please provide date in YYYY-MM-DD format"})
           
    //==Creating Book Document==//   
        const bookData = { title,excerpt ,userId, ISBN,category,reviews,subcategory,deletedAt,isDeleted, releasedAt } ;
        const saveBook = await bookModel.create(bookData)
        return res.status(201).send({ status: true, message: "Success", data: saveBook })

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }

}

//**********************************************************************//

//---GET BOOKS BY FILTERS
    const getBookList= async function(req,res){
    try {
    //==getting sorted book-list without query params==//    
        let list = await bookModel.find({ isDeleted: false}).sort({'title': 1})
        if (!list.length) { res.status(404).send({ status: false, msg: "Books not found" }) }
        if(!req.query)return  res.status(200).send({ status: true, data: list })

    //==getting sorted book-list with query params==// 
        let id = req.query.userId
        let category = req.query.category
        let sub = req.query.subCategory

        //--finding and sorting books--//
        let booklist = await bookModel.find({ isDeleted: false,  $or: [{ userId: id }, { category: category },  { subCategory: sub }] },{_id:1,title:1,excerpt:1,userId:1,category:1,reviews:1,releasedAt:1}).sort({'title': 1})

        if (!booklist.length) return res.status(404).send({ status: false, msg: "Books not found." })
       
        res.status(200).send({ status: true,message: "Success", data: booklist })  

    } catch (err) { return res.status(500).send({ status: false, msg: err.message }) }

}

//**********************************************************************//

//---GET BOOK BY BOOK-ID
    const getBookById = async function(req,res){
    try{
          let bookId = req.params.bookId
    //==validating bookId==//
          if (!isValid(bookId)) return res.status(400).send({ status: false, msg: "Book Id Required." }) 
          if (!isValidObjectId(bookId)) return res.status(400).send({ status: false, msg: `${bookId}  is not a valid.` })

     //==-getting book by book id==//     
          let bookList = await bookModel.find({_id : bookId, isDeleted: false })

          if(!bookList.length) return res.status(404).send({ status: false, msg: "Books not found." })

          res.status(200).send({ status: true,message: "Success", data: bookList })

    }catch (err) { return res.status(500).send({ status: false, msg: err.message }) }
}

//**********************************************************************//

module.exports={createBook,getBookList,getBookById}

