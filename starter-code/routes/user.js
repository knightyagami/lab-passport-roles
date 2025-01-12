const express = require("express");
const userRoutes = express.Router();
const User = require("../models/user");
const Course = require('../models/Course');
const ensureLogin = require("connect-ensure-login");





userRoutes.get( "/profiles", ensureLogin.ensureLoggedIn(), (req, res) => {
  if (req.user.role === 'Boss') {
    res.redirect('/boss-profile');
  } else  if(req.user.role === 'Developer'){
    res.render('user/profile', req.user);
  }else if(req.user.role === 'TA'){
    res.render('user/teacherAProfile',req.user);
  }else{
    res.render('user/alumniProfile',req.user);
  }
});


userRoutes.get("/user/:id/edit", (req, res, next) => {
  let userId = req.params.id;

  User.findOne({ _id: userId })
    .then(user => {
      res.render("user/edit", user);
    })
    .catch(next);
});

userRoutes.post("/user/:id/edit", (req, res, next) => {
  let userId = req.params.id;

  var objUser = {
    username: req.body.username,
    role: req.body.role
  };

  User.findByIdAndUpdate(userId, { $set: objUser }, { new: true })
    .then(() => {
      if(req.user.role === 'Boss'){
        res.redirect("/boss-profile");
      }else{
        res.redirect("/profiles");
      }
      
    })
    .catch(next);
});

userRoutes.get("/user/:id/show-profiles", (req, res, next) => {
  User.find()
    .then(users => {
      
      res.render("user/showProfiles", { users });
    })
    .catch(next);
});


userRoutes.get('/user/:id/show-alumni-profiles',(req,res,next)=>{
  const query = { $and:[ {role: 'Alumni'}, {username:{$ne: req.user.username}} ] }
  User.find(query)
    .then(users =>{
      console.log(users);
      res.render("user/showProfiles", { users });
    })
})

userRoutes.get('/user/view-courses', (req,res,next)=>{
  Course.find()
  .then(courses => {
    console.log(courses);
    res.render("user/showCourses",  {courses});
  })
  .catch(next);
})




module.exports = userRoutes;