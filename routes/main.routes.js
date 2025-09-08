
const express = require("express");

const mainRouter = express.Router();

const {UserRouter} = require('./user.routes.js');
const {repoRouter} = require('./repo.routes.js');
const {IssueRouter} = require('./issue.routes.js');


mainRouter.use(UserRouter);
mainRouter.use(repoRouter);
mainRouter.use(IssueRouter);


mainRouter.get("/", (req, res) => {
    res.send("welcome!");
});

module.exports = mainRouter;
