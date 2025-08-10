import mongoose  from "mongoose"
const mongo_db_string =process.env.MONGO_DB
 
export const connectDB=async()=>{
    await mongoose.connect(`${mongo_db_string}/chatapp`).then(()=>{
        console.log('Database connected')
    })
}