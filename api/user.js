const express = require('express');

const router = express.Router();
const User= require('../models/user.model');
const mongoose=require('mongoose');
const multer= require('multer');


const storage=multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'public/shop_logo');
    },
    filename: function(req,file,cb){
        cb(null,file.fieldname+'-'+Date.now()+'-'+file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {filesize:200000},
    fileFilter: function(req,file,cb){
        checkFileType(file,cb);
    }
});

function checkFileType(file,cb){
    if(file.mimetype ==='image/jpeg' || file.mimetype==='image/png' || file.mimetype==='image/gif' ||file.mimetype ==='image/jpg'){
        cb(null,true);

        }else
        {
          cb(null,false); //rejects storing a file
        }
    }


    //get user's profile
router.get('/:id',function(req,res,next){
    user_id = req.params.id;
    
    User.findOne({"_id":user_id,"shopkeeper":1},function(err,data){
        if(err){
            response= {"error":true,"message":data}
        }else{
            response = {"error":false,"message":data}
        }
        res.json(response);
    });
    
});


//get shopkeeper's profile for editing
router.get('/:id/edit',function(req,res,next){
    user_id= req.params.id;
    

    User.findOne({"_id":user_id,"shopkeeper":1},function(err,data){
        if(err){
            response= {"error":true,"message":data}
        }else{
            response = {"error":false,"message":data}
        }
        res.json(response);
    });

});

//edit the shopkeeper profile
router.put('/:id/edit',upload.array("images",2),function(req,res,next){
    shopid= req.params.id,
    console.log(req.body);

    User.find({"_id":shopid}).update({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            contact_no : req.body.contact_no,
            images:{
                shop_logo:req.files[0].path,
                shop_picture: req.files[1].path,
            },
            shopname:req.body.shopname,
            updated_at: Date.now(),
    },function(err,data){
        if(err){
            res.json(err);
        }else{
            res.json(data);
        }
    });
    
});


    
//     // User.findOneAndUpdate({"_id":shopid},{
//     //     $set:{
//     //         firstname:req.body.firstname,
//     //         lastname: req.body.lastname,
//     //         pan_no: req.body.pan_no,
//     //         contact_no : req.body.contact_no,
//     //         images:{
//     //             shop_logo:req.files[0].path,
//     //             shop_picture: req.files[1].path,
//     //         },
//     //         shopname:req.body.shopname,
//     //         updated_at: Date.now(),


          
//     //     },
//     // },
        
//     //     {
//     //         upsert:true,
//         //}

//     function(err,data){
//         if(err){
//             console.log(err);
//         }else{
//             res.json(data);
//             console.log(data);
//         }
//     });

    
// })



router.post('/',function(req,res,next){
    const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password : req.body.password,
        location:[req.body.location[0],req.body.location[1]],
        // geo : [{lat:req.body.lat,lng:req.body.lng}],

        shopkeeper: '1',
        created_at: req.body.created_at,
        updated_at : req.body.updated_at

    });
    user.save()
    .then(function(doc){
        console.log(doc);
    })
    .catch(function(err){
        console.error(err);
    })
});

// router.put('/editprofile/:id',upload.array('images',2),function(req,res,next){
//     id= req.params.id;
//     console.log(req.files);
   
//     User.update({_id:id},
    
//         {
//             $set:{
//             shopname: req.body.shopname,
//             pan_no:req.body.pan_no,
//             contact_no:req.body.contact_no,
//             images:{
//                 shop_logo:req.files[0].path,
//                 shop_picture: req.files[1].path,
//             },
           
//         }
//     },
//     {
//         upsert:true,multi:true
//     }).then(doc=>{
//         console.log(doc);
//         res.json(doc);
//     }).catch(err=> 
//             {
//             console.error(err);
//         })
// });



module.exports = router;