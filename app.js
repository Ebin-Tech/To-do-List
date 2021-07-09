const express = require("express");
const bodyParser = require("body-parser");
// const date=require(__dirname+"/date.js");
const _ =require("lodash")
const mongoose = require("mongoose");
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb+srv://ebin:Ebin@123@cluster0.e6emc.mongodb.net/todolistDB?retryWrites=true&w=majority",{useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false },()=>{
  console.log("Connected to database");
})
// mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true, useUnifiedTopology: true})
const todolistSchema={
  name:String
}
const item= mongoose.model("item",todolistSchema);
const item1 = new item({
  name:"Take book"
})
const item2 = new item({
  name:"Write story"
})
const item3 = new item({
  name:"Have food"
})
const defaultItems=[item1,item2,item3];

const itemSchema = {
  name:String,
  items:[todolistSchema]
};
const list = mongoose.model("list",itemSchema);

app.get("/", function(req, res) {
// let day = date.getDate();
item.find({},function (err,foundItems){
  if(foundItems.length === 0){
    item.insertMany(defaultItems,function(err){
      if(err){
        console.log(err);
      }
      else{
        console.log("Saved to mongodb successfully");
      }
    });
    res.redirect("/")
  }else{
    res.render('list', {listTitle: "Today",newListItem: foundItems});
  }
});

});
app.post("/",(requ,resp)=>{
  const itemname = requ.body.AddList
  const itemList = requ.body.List
// const itemList = listNam.charAt(0).toLowerCase() + listNam.slice(1)
 const Item = new item({
   name:itemname
 })
 if(itemList==="Today"){
   Item.save();
   resp.redirect("/");

 }
 else
 {
   list.findOne({name:itemList},(err,foundLists)=>{
     foundLists.items.push(Item);
     foundLists.save();
     resp.redirect("/"+itemList)
   })
 }
})
app.post("/delete",(req,res)=>{
  const checkedItemId=req.body.checkbox;
  const ListName=req.body.Listname;

  if(ListName==="Today"){
  item.findByIdAndRemove(checkedItemId,(err)=>{
    if(err){
      console.log(err);
    }else{
      console.log("deleted successfully");
    }
  });
  res.redirect("/");
}
else{
  list.findOneAndUpdate({name:ListName},{$pull:{items:{_id:checkedItemId}}},(err)=>{
    if(err){
      console.log(err);
    }else{
      console.log("deleted successfully");
    }
  });
  res.redirect("/"+ListName);
}
})
app.get("/:customList",(req,res)=>{
  const coustomLisName=_.capitalize(req.params.customList);
  list.findOne({name:coustomLisName},(err,foundList)=>{
    if(!err){
      if(!foundList){
        const List =new list({
          name:coustomLisName,
          items:defaultItems
        });
        List.save();
        res.redirect("/"+coustomLisName);
      }else{
        const listName=foundList.name;
        // const listNames = listName.charAt(0).toUpperCase() + listName.slice(1)
         res.render('list', {listTitle: listName , newListItem: foundList.items});
      }
    }
  })

})

app.get("/about",(req,res)=>{
  res.render('about');
})
app.listen(3000,(err) => {
  console.log("server is running")
});
