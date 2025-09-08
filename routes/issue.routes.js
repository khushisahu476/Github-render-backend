const express = require("express");
const IssueController = require('../controllers/issueController.js');

const IssueRouter = express.Router();

IssueRouter.post('/issue/create/:id',IssueController.createIssue);
IssueRouter.put('/issue/update/:id',IssueController.updateIssue);
IssueRouter.delete('/issue/delete/:id',IssueController.deleteIssue);
IssueRouter.get('/issue/all/:id',IssueController.getAllIssues);
IssueRouter.get('/issue/:id',IssueController.getIssueById);

module.exports = {IssueRouter};