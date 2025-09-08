const fs = require('fs');
const { copyFile } = require('fs/promises');
const path = require('path');
const {promisify} = require('util');

const readDir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

async function revertRepo(commitID) {
    const repoPath = path.resolve(process.cwd(),'.apnaGit');
    const commitPath = path.join(repoPath,"commits");
    try{
       const commitDir = path.join(commitPath, commitID);
       const files = await readDir(commitDir);
       const perentDir = path.resolve(repoPath,'..');

       for(const file of files){
           await copyFile(path.join(commitDir,file),path.join(perentDir,file));
       }
        console.log(`Reverted to commit successfully!: ${commitID}`);
    }
    catch(error) {
        console.error("Error reverting to commit:", error);
        return;
    }
}
module.exports = {revertRepo};