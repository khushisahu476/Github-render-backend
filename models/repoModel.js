const mongoose = require('mongoose');
const {Schema} = mongoose;

const RepositorySchema = new Schema({
    name:{
        type :String,
        required:true,
        unique:true,
    },
    description:{
        type:String,
    },
    content:[
        {
          type : String,
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        required:true,
        ref :'User',

    },
     visibility :{
        type :Boolean,      
    },
    issues:[{
        type:Schema.Types.ObjectId,
        ref:"Issue",
    }],
    
  starRepos: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
},
    { timestamps: true },
);

const Repository = mongoose.model("Repository",RepositorySchema);
module.exports = Repository;