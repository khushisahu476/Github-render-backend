
const mongoose = require("mongoose");
const Repository = require("../models/repoModel.js");
const  Issue = require("../models/issueModel.js");
const User = require("../models/userModel.js");

async function createRepository(req,res){
    const {owner, name ,description,content,issues,visibility} = req.body;
    try{
        if(!name){
           return  res.status(400).json({messahe:"Repository name is required"});
        }
        if(!mongoose.Types.ObjectId.isValid(owner)){
           return  res.status(400).json({error:"Invalid owner ID"});
        }
        const newRepository = new Repository({
            name,
            description,
            content,
            owner,
            visibility,
            issues
        })

        const result = await newRepository.save();
        res.status(201).json({
            message:"Repository is created!. ",
            RepositoryID : result._id
        })
        // res.status(200).json({message:"Repository is Created!"});
    }
    catch(err){
        console.error("Error during repository creation!",err);
        res.status(500).json({message:"Server Error"});
    }
}
async function fetchAllRepositories(req,res){
    try{
       const Repositories  = await Repository.find({})
       .populate("owner")
       .populate("issues");
       
       res.json(Repositories);
    }
    catch(err){
        console.error("Error during fetching repositories!",err);
        res.status(500).json({message:"Server Error"});
    }
}

async function fetchRepositoryById(req,res){
    const {id} =req.params;

    try{
       const repository = await Repository.find({_id:id})
       .populate("owner")
       .populate("issues")

       res.json(repository);
    }
    catch(err){
        console.error("Error during fetching repository!",err);
        res.status(500).json({message:"Server Error"});
    }
}
async function fetchRepositoryByName (req,res){
   const {name} = req.params;

    try{
       const repository = await Repository.find({name})
       .populate("owner")
       .populate("issues")

       res.json(repository);
    }
    catch(err){
        console.error("Error during fetching repository!",err);
        res.status(500).json({message:"Server Error"});
    }
}

async function fetchRepositoriesForCurrentUser(req, res) {
  console.log(req.params);
  const { userID } = req.params;

  try {
    const repositories = await Repository.find({ owner: userID });

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ error: "User Repositories not found!" });
    }
    console.log(repositories);
    res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).send("Server error");
  }
}

async function updateRepositoryById(req,res){
    const {id} = req.params;
    const {content,description} = req.body;
    try{
       const repository = await Repository.findById(id);
        if(!repository){
           return res.status(404).json({error:"user repository not found!"});
        }
        if (Array.isArray(content)) {
            repository.content.push(...content);
        } else if (typeof content === "string") {
            repository.content.push(content);
        }

       repository.description = description;
       
       const updatedRepository =await  repository.save();
        res.json({
          message:"repository updates successfully!",
          repository:updatedRepository
       })
    }
    catch(err){
        console.error("Error during updating repository!",err);
        res.status(500).json({message:"Server Error"});
    }
}

async function deleteRepositoryById(req,res){
    const {id} = req.params;
    try{
        const repository = await Repository.findByIdAndDelete(id);
        if(!repository){
            return res.status(404).json({ error: "Not found" });
        }
        res.json({
            message:"Repository deleted successfully!"
        })
    }
    catch(err){
        console.error("Error during delteting repository!",err);
        res.status(500).json({message:"Server Error"});
    }
}


async function toggleVisibilityById(req,res){
    const {id} = req.params;
    const {content,description} = req.body;
    try{
       const repository = await Repository.findById(id);
        if(!repository){
           return res.status(404).json({error:"user repository not found!"});
        }
    
        repository.visibility = !repository.visibility;
       
        const updatedRepository = await  repository.save();
        res.json({
          message:"Repository toggeled successfully!",
          repository:updatedRepository
       })
    }
    catch(err){
        console.error("Error during toggeling repository!",err);
        res.status(500).json({message:"Server Error"});
    }
}
async function toggleStarById (req, res){
  try {
    const { repoId } = req.params;
    const userId = req.user.id; // assuming user auth middleware adds req.user

    const repo = await Repository.findById(repoId);
    const user = await User.findById(userId);

    if (!repo || !user) {
      return res.status(404).json({ message: "Repository or User not found" });
    }

    // If already starred → unstar
    if (repo.stars.includes(userId)) {
      repo.stars = repo.stars.filter(id => id.toString() !== userId);
      user.starRepos = user.starRepos.filter(id => id.toString() !== repoId);
    } else {
      // If not starred → star it
      repo.stars.push(userId);
      user.starRepos.push(repoId);
    }

    await repo.save();
    await user.save();

    res.json({
      message: "Star updated",
      starsCount: repo.stars.length,
      isStarred: repo.stars.includes(userId),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports ={
    createRepository,
    fetchAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    updateRepositoryById,
    deleteRepositoryById,
    fetchRepositoriesForCurrentUser,
    toggleVisibilityById,
    toggleStarById
}