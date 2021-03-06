const express = require('express');
const router= express.Router()

var db= require('../models/db');
var Product= require('../models/product.model');
var Category = require('../models/category.model');
var User = require('../models/user.model');
var Views= require('../models/product_views.model');

//getting the product details //updating the rating of the product
 router.post('/update-rating',function(req,res,next){
    var userid= Auth.user_id;
    
})



router.get('/:id',function(req,res){
    product_id= req.params.id;
    
    
    Product.findOne({"_id":product_id,"status":1}).populate('categories').populate('shop_id').populate('review.user_id').exec(function(err,data){
        // var category = data.categories;
        
        // var categories = new Category();
        // var category_data= [];
        // await Category.find({"_id":category},function(err,data){
            
        //     category_data.push(data);
        //     });
        
        // var shop =data.shop_id;
        // var shops = new User();
        // var shop_data = [];
        // await User.find({"_id":shop,"shopkeeper":1},function(err,data){
        //     shop_data.push(data);
        // });      
        if(err){
            response= {"error":true,"message":data}
        }else{
            // response={"error":false,"message":data,"category_list":category_data,"shop_details":shop_data}
            response={"error":false,"message":data}
        }
        res.json(response);
        
        
      
    });
        
        });

 //updating the rating of the product
 router.post('/update-rating/:id',async function(req,res,next){
    var userid="5ce29c9ca2eb5026b70aca12";    
    console.log(req.body);
    var productid= req.params.id;
    console.log(productid);
    var product=[];
    await Product.findOne({"_id":productid,"status":1},function(err,data){
        product.push(data);
        var shopid= product[0].shop_id;
        rating_userid=[]
        
        rating_userid.push(product[0].rating);
        
        
       
    
        
        if(err){
            console.log("error");
        }else{

                // for (i=0;i<rating_userid[0].length;++i){


                Product.updateOne({"_id":productid,"shop_id":shopid},
                {
                   
                    // $unset:{
                    //     userid:""
                    // },
                   

                    $push:{
                        rating:{
                            userid:userid,
                            values:req.body.values
                        }
                    }
                   
                   
                },{strict:false},
                function(err,data){
                    if(err){
                        console.log(err);
                    }else{
                        
                        res.json(data);
                    }
                });  
        }

    
        
    });
});
 

    //updating the review of the product
    router.post('/update-review/:id',function(req,res,next){
        var productid= req.params.id
        var userid="5ce29c9ca2eb5026b70aca50";
        var product_details=[];

        Product.findOne({"_id":productid},function(err,data){
            product_details.push(data);
            
            if(err){
                res.json(err);
                console.log(err);

            }else{
                shopid=product_details[0].shop_id;
                Product.findOneAndUpdate({'_id':productid,"shop_id":shopid},
                {
                $push:{
                    review:{
                    user_id:userid,
                    comment_details:{
                        comment:req.body.comment
                    }
                }
                }
            },
                function(err,data){
                    if(err){
                        res.json(err);
                    }else{
                        res.json(data);
                        console.log("done");
                    }
                });
        }
        });
    });
 


    //posting the click value of the product to count the views
    router.post('/click/:id',function(req,res,next){
        var productid = req.params.id;
        var click = new Date();
        console.log(click);
        Views.update({"product_id":productid},{
            $push:{
                view:{
                    clickTime:click,
                }
            }
        },{upsert:true},function(err,data){
            if(err){
                res.json(err)
            }else{
                res.json(data);
            }
        });
        
    });
    
    



module.exports= router;