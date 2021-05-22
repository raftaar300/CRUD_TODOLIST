const express = require('express');
const route = express.Router()
const services = require('../services/render');
const controller = require('../controller/controller');
var jwt = require('jsonwebtoken');
var Userdb = require('../model/model');
var User = require('../model/log');
const { findOneAndUpdate } = require('../model/log');

const accessTokenSecret = 'youraccesstokensecret';


if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}



function checktoken(req, res, next) {
  var accessToken = localStorage.getItem('mytoken');

  try {


    jwt.verify(accessToken, "youraccesstokensecret")
  } catch (err) {


    res.render('login');
  }
  next();
}





route.get('/', checktoken, function (req, res, next) {
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var item_list = Userdb.find({ email: em, password: pas });
  item_list.exec(function (err, data) {
    if (err) throw err;
    res.render('index', { users: data });
  })
});


//login page
route.get('/login/', function (req, res) {
  res.render('login');
})

//Post LOGIN
route.post('/loggg/', (req, res) => {
  var password = req.body.password;
  var email = req.body.email;
  User.findOne({ email: req.body.email }, function (err, result) {
    if (result !== null && (result.password === password)) {
      localStorage.setItem('email', req.body.email);
      localStorage.setItem('password', req.body.password);
      const accessToken = jwt.sign({ foo: "bar" }, "youraccesstokensecret");
      localStorage.setItem('mytoken', accessToken);
      res.redirect('/')
    }
    else { res.redirect('/') }

  });




})

//class Page
route.get('/class/:clas/', checktoken, function (req, res, next) {
  var clas = req.params.clas;
  var sub = "physics";
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var item_list = Userdb.find({ email: em, password: pas, classs: clas, subject: sub });
  item_list.exec(function (err, data) {
     var counts = [];
     var count = 0;
     console.log("data : " , data);
     if(data!== undefined)
     {for(var i=0;i<data.length;i++)
         {
           if((data[i].topic !== undefined) && (data[i].topic !== null))
           {for(var j=0;j<data[i].topic.length;j++)
              {
                count = count  + data[i].topic[j].hour;
              }
          }
         
         }
  

    }
     counts.push(count);
    var sub2 = "chemistry";
    var item_list2 = Userdb.find({ email: em, password: pas, classs: clas, subject: sub2 });
    item_list2.exec(function (err2, data2) {
       var count2 = 0;
       console.log("data2 : " , data2);
       if(data2!== undefined)
       {for(var i=0;i<data2.length;i++)
           {
             if((data2[i].topic !== undefined) && (data2[i].topic !== null))
             {for(var j=0;j<data2[i].topic.length;j++)
                {count2 = count2  + data2[i].topic[j].hour;}
              }
           }
      
        } 
         counts.push(count2);
        var sub3 = "math";
        var item_list3 = Userdb.find({ email: em, password: pas, classs: clas, subject: sub3 });
        item_list3.exec(function (err, data3) {
           var count3 = 0;
           console.log("data : " , data3);
           if(data3!== undefined)
           {for(var i=0;i<data3.length;i++)
               {
                 if((data3[i].topic !== undefined) && (data3[i].topic !== null))
                 {for(var j=0;j<data3[i].topic3.length;j++)
                    {
                      count3 = count3  + data3[i].topic[j].hour;
                    }
                }
               
               }
           
          }counts.push(count3);
        res.render('class', { clas: clas , counts : counts});
        })


    })


  })

})


// subject page
route.get('/class/:clas/:sub', checktoken, function (req, res, next) {
  var clas = req.params.clas;
  var sub = req.params.sub;
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var item_list = Userdb.find({ email: em, password: pas, classs: clas, subject: sub });
  item_list.exec(function (err, data) {
     var counts = [];
     console.log("data : " , data);
     if(data!== undefined)
     {for(var i=0;i<data.length;i++)
         {var count = 0;
           if((data[i].topic !== undefined) && (data[i].topic !== null))
           {for(var j=0;j<data[i].topic.length;j++)
              {
                count = count  + data[i].topic[j].hour;
              }
          }
          counts.push(count);
         }
    
    }res.render('subject', { chapters: data, clas: clas, subject: sub , counts : counts});
  })

})


// PAGE FOR ADDING NEW CHAPTERS 
route.get('/class/:clas/:sub/newchap', checktoken, function (req, res, next) {
  var clas = req.params.clas;
  var sub = req.params.sub;
  res.render('newchap', { clas: clas, subject: sub });
})





//POST TO ADD NEW CHAPTERS
route.post('/class/:clas/:sub/addchap', checktoken, function (req, res, next) {
  var clas = req.params.clas;
  var sub = req.params.sub;
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var name = req.body.name;
  var chapter = new Userdb({
    email: em,
    password: pas,
    classs: clas,
    subject: sub,
    chaptername: name,
    topic: []
  })

  Userdb.findOne({ email: em, subject: sub, chaptername: name }, function (err, result) {
  if (result === null) {chapter.save();}
  res.redirect('/');
  })
})


//EDIT chapter page
route.get('/updatechap/:clas/:subject/:chaptername/' , checktoken , function(req , res , next){
  console.log("edited page")
  var clas = req.params.clas;
  var sub = req.params.subject;
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var chaptername = req.params.chaptername;
  res.render('editchap' , {classs : clas , subject : sub , chaptername : chaptername});

})
//POST edit chapter
route.post('/class/:clas/:subject/:chaptername/editchap' , checktoken , function(req , res , next){
  var edit = req.body.name;
  var clas = req.params.clas;
  var sub = req.params.subject;
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var chaptername = req.params.chaptername;
  var item_list = Userdb.findOne({ email: em, password: pas, classs: clas, subject: sub, chaptername: chaptername });
  item_list.exec(function (err, data) {
  var id = data._id;
  Userdb.findByIdAndUpdate(id, {
    chaptername: edit
  }, (err) => {
    res.redirect('/');
  })

  })

})

//delete chapter
route.get('/class/:clas/:subject/:chaptername/deletechap/'  , checktoken , function(req , res , next){
  var edit = req.body.name;
  var clas = req.params.clas;
  var sub = req.params.subject;
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var chaptername = req.params.chaptername;
  var item_list = Userdb.findOne({ email: em, password: pas, classs: clas, subject: sub, chaptername: chaptername });
  item_list.exec(function (err, data) {
  var id = data._id;
 var del = Userdb.findByIdAndDelete(id, (err) => {

    del.exec(function (err) {
      res.redirect('/');
    })


  });
  })

  
})

//PAGE OF topics
route.get('/class/:clas/:sub/:chaptername/topics', checktoken, function (req, res, next) {
  var clas = req.params.clas;
  var sub = req.params.sub;
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var chaptername = req.params.chaptername;

  var item_list = Userdb.findOne({ email: em, password: pas, classs: clas, subject: sub, chaptername: chaptername });
  item_list.exec(function (err, data) {
    res.render('topic', { topic: data.topic, classs: clas, subject: sub , chaptername : chaptername});
  })

})





// page of making new topic
route.get('/class/:clas/:sub/:chaptername/newtop', checktoken, function (req, res, next) {
  var clas = req.params.clas;
  var sub = req.params.sub;
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var chaptername = req.params.chaptername;
  res.render('newtop', { classs: clas, subject: sub, chaptername: chaptername });
})


// POST OF MAKING NEW TOPIC
route.post('/class/:clas/:sub/:chaptername/addtop', checktoken, function (req, res, next) {
  var clas = req.params.clas;
  var sub = req.params.sub;
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var chaptername = req.params.chaptername;
  var name = req.body.name;
  console.log("chaptername  : ", chaptername)
  var id; 
  var topic;
  var item_list = Userdb.findOne({ email: em, password: pas, classs: clas, subject: sub, chaptername: chaptername });
  item_list.exec(function (err, data) {
    var top = { Body: name, hour: 0 };
    id = data._id;
     topic = data.topic;
      topic.push(top);
      console.log("id : ", id);
      console.log("topic  : " , topic);
      var chapter = new Userdb({
        email: data.email,
        password: data.password,
        classs: data.classs,
        subject: data.subject,
        chaptername: data.chaptername,
        topic: topic
      })

    Userdb.findByIdAndDelete(id , (err)=>{
      chapter.save();
      res.redirect('/')

    });
    })

})


//delete topic
route.get('/class/:clas/:sub/:chaptername/:i/deletetopic/' , checktoken , function(req , res , next){
  var clas = req.params.clas;
  var sub = req.params.sub;
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var chaptername = req.params.chaptername;
  var name = req.body.name;
  var i = req.params.i;
  console.log("chaptername  : ", chaptername)
 
  var item_list = Userdb.findOne({ email: em, password: pas, classs: clas, subject: sub, chaptername: chaptername });
  item_list.exec(function (err, data) {
    var top = { Body: name, hour: 0 };
   var id = data._id;
    var topic = data.topic;
    console.log("topics : ", topic);
    topic.splice(i , i+1);
      console.log("id : ", id);
      console.log("topic  : " , topic);

      var chapter = new Userdb({
        email: data.email,
        password: data.password,
        classs: data.classs,
        subject: data.subject,
        chaptername: data.chaptername,
        topic: topic
      })

    Userdb.findByIdAndDelete(id , (err)=>{
      chapter.save();
      res.redirect('/')

    });
    })

})

//INCREASE NUM
route.get('/class/:clas/:sub/:chaptername/:i/editopic/', checktoken , function(req , res , next){
  var clas = req.params.clas;
  var sub = req.params.sub;
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var chaptername = req.params.chaptername;
  var name = req.body.name;
  var i = req.params.i;
  res.render('inctop' , {clas : clas, sub : sub , chaptername : chaptername , i : i});
})

//post inc
route.post('/class/:clas/:sub/:chaptername/:i/inc', checktoken , function(req , res , next){
  var clas = req.params.clas;
  var sub = req.params.sub;
  var pas = localStorage.getItem('password');
  var em = localStorage.getItem('email');
  var chaptername = req.params.chaptername;
  var name = req.body.no;
  var i = req.params.i;
  console.log("chaptername  : ", name);
 
  var num = Number(name);
  if(Number(name) === NaN)
  {res.redirect('/');}
  var item_list = Userdb.findOne({ email: em, password: pas, classs: clas, subject: sub, chaptername: chaptername });
  item_list.exec(function (err, data) {
   var id = data._id;
    var topic = data.topic;
    console.log("topics : ", topic);
    var body = topic[i].Body;
    topic[i] = {Body : body , hour :  name};
      console.log("id : ", id);
      console.log("topic  : " , topic);

      var chapter = new Userdb({
        email: data.email,
        password: data.password,
        classs: data.classs,
        subject: data.subject,
        chaptername: data.chaptername,
        topic: topic
      })

    Userdb.findByIdAndDelete(id , (err)=>{
      chapter.save();
      res.redirect('/')

    });
    })
})


route.get('/signup/', (req, res) => {
  res.render('signup');
})
route.post('/signupd/', (req, res) => {
  var Userlogin = new User({
    password: req.body.password,
    email: req.body.email,
    name: req.body.name
  })

  User.findOne({ email: req.body.email }, function (err, result) {

    if (result === null) {
      Userlogin.save((error, itemss) => {

        localStorage.setItem('email', req.body.email);
        localStorage.setItem('password', req.body.password);
        const accessToken = jwt.sign({ foo: "bar" }, "youraccesstokensecret");
        localStorage.setItem('mytoken', accessToken);
        res.redirect('/');

      });
    }
    else { res.redirect('/login/') }

  })
})




route.get('/add-user', services.add_user)



route.post('/api/users', controller.create);




route.get('/api/users', controller.find);





route.get("/update-user/:id", (req, res) => {
  var id = req.params.id;

  var edit = Userdb.findById(id);
  edit.exec((err, data) => {
    if (err) throw err
    res.render('update_user', { rec: data });
  })
})






route.post('/edited/', function (req, res) {
  var id = req.body.id;

  Userdb.findByIdAndUpdate(id, {
    gender: req.body.gender
  }, (err) => {
    if (err) throw err
    res.redirect('/');
  })

});





route.get('/delete/:id', (req, res) => {

  var id = req.params.id;

  var del = Userdb.findByIdAndDelete(id, (err) => {

    del.exec(function (err) {
      res.redirect('/');
    })


  });
});




route.get('/logout/', (req, res) => {
  localStorage.removeItem('mytoken');
  localStorage.removeItem('email');
  localStorage.removeItem('password');
  res.redirect('/');
})

module.exports = route