"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("Sorry I couldn't find what you're looking for.");
};

// -----------------------------------------------------
const handleHomepage = (req, res) => {
  res.status(200).render("pages/homepage", { users: users });
};

const handleProfilePage = (req, res) => {
  const userId = req.params._id;
  const user = users.find((currentUser) => {
    return currentUser._id == userId;
  });
  const friends = [];
  user.friends.forEach((friendId) => {
    //1007
    let friend = users.find((otherUsers) => {
      return otherUsers._id == friendId;
    });

    if (friend !== undefined) {
      friends.push(friend);
    }
  });
  console.log(friends);
  //res.send(userId);
  res.render(`pages/profile`, { user, friends });
};

const handleSignin = (req, res) => {
  res.render("pages/signin");
};

const handleName = (req, res) => {
  console.log(req.body);
  const firstName = req.body.firstName;
  const nameFinder = users.find((logger) => {
    if (firstName === logger.name) {
      return true;
    } else {
      return false;
    }
  });
  if (nameFinder === undefined) {
    res.status(200).redirect("./signin");
  } else {
    res.status(404).redirect("/users/" + nameFinder._id);
  }
};
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomepage)
  .get("/users/:_id", handleProfilePage)
  .get("/signin", handleSignin)
  .post("/getname", handleName)
  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
