const fs  = require("fs").promises;
const path = require("path");


const {s3, S3_BUCKET} = require('../config/awsconfig');
async function pushRepo() {
   const repoPath = path.resolve(process.cwd(),".apnaGit");
   const commitsPath = path.join(repoPath,"commits");

    try{
      const commitDirs =await fs.readdir(commitsPath);
       for(const commitDir of commitDirs){
            const commitPath = path.join(commitsPath,commitDir);
            const commitFiles = await fs.readdir(commitPath);
            for(const file of commitFiles){
                const filePath = path.join(commitPath,file);
                const fileContent = await fs.readFile(filePath);
                const params = {
                    Bucket : S3_BUCKET,
                    Key : `commits/${commitDir}/${file}`,
                    Body : fileContent
                }
                await s3.upload(params).promise();
                console.log(`File ${file} from commit ${commitDir} pushed to S3 bucket`);
            }

       }
    }
    catch(err){
       console.error("Error during push:", err);
    }
}
module.exports = {pushRepo};