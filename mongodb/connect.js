import mongoose from "mongoose";  // it allows to make model easily and schemas

const connectDB=(uri)=>{ 
   mongoose.set('strictQuery',true); //Mongoose will ensure that only the fields that are specified in your Schema will be saved in the database, and all other fields will not be saved (if some other fields are sent).

   mongoose.connect(uri)
   .then(()=>console.log('Database Connected'))
   .catch((error)=>console.log(error)); // Why we use .then and .catch it is going to be an async operation whenever the async operation callled we used it to handle promises
}

export default connectDB;