const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const http = require("http");
const {Server} = require("socket.io");
const mainRouter = require('./routes/main.routes.js');

const  yargs = require("yargs");
const {hideBin} = require('yargs/helpers');


const {initRepo} = require("./controllers/init");
const {addRepo} = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");
const { Socket } = require("dgram");

dotenv.config();

yargs(hideBin(process.argv))
  .command("start","server started successfully!",{},startServer)
  .command("init","Initialize a new  repository!",{},initRepo)
  .command("add <file>"," add a file to the repository!",(yargs)=>{
    yargs.positional("file", {
        describe: "File to add",
        type: "string"
    });
  },
  (argv) => {
     addRepo(argv.file);
  })
  .command("commit <message>","commite a new  changes!",(yargs)=>{
    yargs.positional("commitID", {
        describe: "Commit ID",
        type: "string"
    });
  },(argv)=>{
    commitRepo(argv.message);
  })


  .command("push","push commit to S3!",{},pushRepo)
  .command("pull","pull commit from S3",{},pullRepo)
  .command("revert <commitID>","revert to a specific commit !",(yargs)=>{
    yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string"
    });
  },(argv)=>{
    revertRepo(argv.commitID);
  })
.demandCommand(1, "You need at least one command before moving on")
.help().argv;

function startServer(){
  const app = express();
  const PORT = process.env.PORT || 3000;
  app.use(bodyParser.json());
  app.use(express.json());

  app.use(cors({origin : "*"}))

  const mongoURI = process.env.MONGODB_URI;
  mongoose
   .connect(mongoURI)
   .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });

 

  const httpServer = http.createServer(app);
  const io = new Server(httpServer,{
    cors:{
      origins :"*",
      methods :['GET','POST']
    }
  }) 
  

 app.use('/',mainRouter);

  io.on("connection",(socketIo)=>{
    socketIo.on("joinRoom",(userID)=>{
      user = userID;
      console.log("======");
      console.log(user);
      console.log("======");
      socketIo.join(user);
    })

  })

   const db = mongoose.connection;
    db.once("open",async()=>{
       console.log("MongoDB connection is stablished successfully");
        //CRUD Operation 
    })

    httpServer.listen(PORT,()=>{
      console.log(`server is running on port ${PORT}`);
    })
}