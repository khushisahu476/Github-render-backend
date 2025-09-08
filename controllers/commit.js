const fs = require("fs").promises;
const path = require("path");
const {v4 :uuid} = require("uuid");
async function commitRepo(message){
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const stagingPath = path.join(repoPath, "staging");
    const commitPath = path.join(repoPath, "commits");
    
    try{
        const commitID = uuid();     
        const commitDir = path.join(commitPath, commitID);
        await fs.mkdir(commitDir, { recursive: true });
        const files = await fs.readdir(stagingPath);
        for(const file of files){
            await fs.copyFile(
                path.join(stagingPath, file),
                path.join(commitDir, file)
            );
        }
        await fs.writeFile(
            path.join(commitDir,'commit.json'),
            JSON.stringify({message, Date:new Date().toISOString()})
        );
        console.log(`Commit ${commitID} successful created with ID :", ${message})`);
    }catch(err){
        console.error("Error during commit:", err.message);
        return;
    }
}
module.exports = {commitRepo};