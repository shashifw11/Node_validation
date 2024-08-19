const connect = require("./configs/db");
const app = require("./index")

app.listen(2345,async()=>{
    try{
      await connect()
      console.log("Listening on port 2345")
    }catch(err){
          console.log(err.message)
    }
 })