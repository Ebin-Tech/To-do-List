const express = require("express");
const bodyParser = require("body-parser");
// const date=require(__dirname+"/date.js");
const mongoose = require("mongoose");
var app = express();
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/todolistDB",{userNewUrlParser:true})
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
item.insertMany(defaultItems,function(err){
  if(err){
    console.log("error");
  }
  else{
    console.log("Saved to mongodb successfully");
  }
})
app.get("/", function(req, res) {
// let day = date.getDate();
  res.render('list', {listTitle: "Today",newListItem: items});
})
app.post("/",(requ,resp)=>{
  let item=requ.body.AddList
  if(requ.body.list==="Work"){
    workLIst.push(item);
    resp.redirect("/work")
  }
  if(item===""){
    resp.redirect("/")
  }
else{
   items.push(item);
resp.redirect("/")
}

})
let workLIst=[];
app.get("/work",(req,res)=>{
  res.render('list', {listTitle: "Work List",newListItem: workLIst});
})

app.get("/about",(req,res)=>{
  res.render('about');
})
app.listen(3000,(err) => {
  console.log("server is running")
});
