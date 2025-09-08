const mongoose = require("mongoose");
const Repository = require("../models/repoModel.js");
const  Issue = require("../models/issueModel.js");
const User = require("../models/userModel.js");

async function createIssue(req,res){
    const {id} = req.params;
    const {title,description} = req.body;

    try{
        const newIssue = new Issue({
            title,
            description,
            repository :id
        })
        await  newIssue.save();
        res.status(201).json({newIssue})
    }
    catch(err){
        console.error("Error during creating issue!",err);
        res.status(500).json({message:"Server Error"});
    
    }

}
async function updateIssue(req,res){
    const {id} = req.params;
    const {title,description,status} = req.body;
    try{
        const updatedIssue = await Issue.findById(id);
        if(!Issue){
            return res.status(404).json({message:"Issue not found!"});
        }
        updatedIssue.title = title;
        updatedIssue.description = description;
        updatedIssue.status = status;
        await updatedIssue.save();

        res.json(Issue,{message:"Issue is updated successfully!"});
    }
     catch(err){
        console.error("Error during updating issue!",err);
        res.status(500).json({message:"Server Error"});
    
    }

}
async function deleteIssue(req,res){
    const {id} = req.params;
    try{
        const issue = await Issue.findByIdAndDelete(id);
        if(!issue){
            return res.status(404).json({message:"Issue not found!"});
        }

        res.json({message:"Issue deleted !"});
    }
    catch(err){
        console.error("Error during deleting issue!",err);
        res.status(500).json({message:"Server Error"});
    
    }
}
async function getAllIssues(req,res){
    const {id} = req.params;

    try{
        const issues = await Issue.find({repository:id});
        if(!issues){
            return res.status(404).json({message:"Issues are not found"});
        }
        res.status(200).json(issues);
    }
    catch(err){
        console.error("Error during fetching issues!",err);
        res.status(500).json({message:"Server Error"});
    
    }
}
async function getIssueById(req,res){
   const {id} = req.params;
    try{
      const issue = await Issue.findById(id);
      if(!issue){
        return res.status(404).json({message:"Issue is not found!"});
      }
      res.json(issue);
    }
    catch(err){
        console.error("Error during fetching issue!",err);
        res.status(500).json({message:"Server Error"});
    
    }
}
module.exports = {
    createIssue,
    updateIssue,
    deleteIssue,
    getAllIssues,
    getIssueById
}