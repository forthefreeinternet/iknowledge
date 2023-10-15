const dexpress = require('./dexpress/index.js')
const path = require('path')
// const dotenv = require('dotenv')
// const colors = require('colors')
// const morgan = require('morgan')
const cookieParser = require('cookie-parser')
// const mongoSanitize = require('express-mongo-sanitize')
const fileupload = require('express-fileupload')
const helmet = require('helmet')
// const xss = require('xss-clean')
// const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')

const errorHandler = require('./middleware/error')

// const DBConnection = require('./config/db')

// dotenv.config({ path: './config/.env' })
console.log('env', process.env)
// DBConnection()

const authRoutes = require('./routes/auth')
// const userRoutes = require('./routes/users')
const categoryRoutes = require('./routes/categories')
const videoRoutes = require('./routes/videos')
// const commentRoutes = require('./routes/comments')
// const replyRoutes = require('./routes/replies')
// const feelingRoutes = require('./routes/feelings')
// const subscriptionRoutes = require('./routes/subscriptions')
// const historiesRoutes = require('./routes/histories')
// const searchRoutes = require('./routes/search')

const app = dexpress()

app.use(dexpress.json())
app.use((req, res, next) => {
	if (req?.data && req.data){
		try {
			// 尝试将变量解析为 JSON 对象
			const jsonData = JSON.parse(req.data);
			req.body = jsonData
			req.query = req.params
			if (req.params){
				console.log('test in app!!!!!!!', req.params.id)
			}
			
		} 
			catch (error) {
			if (req.files){
				console.log(req.files)
			} else{
				req.files ={video: req.body.get('video') } 
			}
		}
		
	}

    next()
})

app.use(cookieParser())

// if (process.env.NODE_ENV === 'development') {
// 	app.use(morgan('dev'))
// }

// File uploading
app.use(
	fileupload({
		createParentPath: true,
	})
)

// // Sanitize data
// app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// // Prevent XSS attacks
// app.use(xss())

// Enable CORS
app.use(cors())

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 10 * 60 * 1000, // 10 mins
//   max: 100 // 100 request per 10 mins
// })

// app.use(limiter)

// Prevent http param pollution
app.use(hpp())

app.use(dexpress.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  setTimeout(() => {
    next()
  }, 1000)
})

const versionOne = (routeName) => `/api/v1/${routeName}`

app.use(versionOne('auth'), authRoutes)
app.use('test', (req, res) => {console.log('tet', req); res.send('test')})
// app.use(versionOne('users'), userRoutes)
app.use(versionOne('categories'), categoryRoutes)
app.use(versionOne('videos'), videoRoutes)
// app.use(versionOne('comments'), commentRoutes)
// app.use(versionOne('replies'), replyRoutes)
// app.use(versionOne('feelings'), feelingRoutes)
// app.use(versionOne('subscriptions'), subscriptionRoutes)
// app.use(versionOne('histories'), historiesRoutes)
// app.use(versionOne('search'), searchRoutes)

app.use(errorHandler)

const PORT = process.env.PORT

const server = app.listen('clientRequest', () => {
	console.log(
		`We are live on ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
	)
})

console.log('server:', server);
// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
// 	console.log(`Error: ${err.message}`.red)
// 	// Close server & exit process
// 	server.close(() => process.exit(1))
// })
