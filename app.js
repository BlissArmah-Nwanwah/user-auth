const express = require('express')
const user = require('./routes/user')
const connectDB = require('./db/connect')

// extra security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const app = express()



require('dotenv').config()
// middleware
app.use(express.json())

app.set('trust proxy', 1)
app.use(rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}))
app.use(express.json());
app.use(helmet())
app.use(cors())
app.use(xss())

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