const express = require('express')
const user = require('./routes/user')
const connectDB = require('./db/connect')

const cors = require('cors')

const app = express()



require('dotenv').config()
// middleware
app.use(express.json())

app.use(cors())

// routes
app.get('/hello',(req,res)=>{
  res.send('user auth')
})

app.use('/api/v1/user',user)


const PORT = process.env.PORT || 4000;

const start = async() =>{
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT,console.log(`server is listening on port ${PORT}...`))
  } catch (error) {
   console.log(error); 
  }
}

start()