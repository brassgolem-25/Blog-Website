
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://admin-tushar:tushar99@cluster0.b8emz.mongodb.net/blogDB?retryWrites=true&w=majority', {useNewUrlParser: true});

// let posts = [];


const homeStartingContent = "Hi, welcome to my Blog Website. This is the homepage where you can find all the blog added. Click on Read More.. to get to specific blog. To compose a new blog click on 'Compose' in top-right Corner. To Update or Delete a blog post options are specified as same. Thank You :)";
const aboutContent = "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos .";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = new mongoose.Schema({
  title: String,
  content: String
})

const Post = mongoose.model("Post",postSchema);

app.get("/",function(req,res){
  Post.find({}, function(err, posts){
     res.render('home', {
       startingContent: homeStartingContent,
       posts: posts
       });
   })
});

app.get("/posts/:postId",function(req,res){
      const requestedPostId = req.params.postId;
      Post.findOne({_id:requestedPostId},function(err,post){
        res.render('post',{
          curr_post : post
        })
      })

})

app.get("/about",function(req,res){
  res.render('about',{about:aboutContent});
});

app.get("/contact",function(req,res){
  res.render('contact',{contact:contactContent});
});

app.get("/compose",function(req,res){
  res.render('compose');
})

app.get('/update/:postId',function(req,res){
  const currId = req.params.postId;
  Post.findOne({_id:currId},function(err,result){
    if(!err){
    res.render('update',{curr_post:result})
    }
  })
})

app.post("/",function(req,res){
const title=req.body.postTitle;
  const content = req.body.postBody;
  const post = new Post({
    title:title,
    content: content
  })
  post.save(function(err){
  if (!err){
    res.redirect("/");
  }
});

})

app.post('/update/:post_id',function(req,res){
   const curr_id = req.params.post_id;
   const newTitle = req.body.postTitle;
   const newContent = req.body.postContent;

   console.log(newTitle);
   console.log(newContent);
   Post.updateOne({_id:curr_id},{title:newTitle,content:newContent},function(err){
     if(!err){
       res.redirect('/');
     }
   })

})

app.post('/delete',function(req,res){
  const req_id = req.body.delete;
  Post.deleteOne({_id:req_id},function(err){
    if(!err){
      res.redirect('/');
    }
  })
})

app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Server started at port " + process.env.PORT);
})
