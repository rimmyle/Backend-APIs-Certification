const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))

const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
})

const exercsiseSchema = new mongoose.Schema({
  userId: {
    type: String
  },
  username: {
    type: String
  },
  date: {
    type: Date
  },
  duration: {
    type: Number
  },
  description: {
    type: String
  }
})

const User = mongoose.model('User', userSchema)
const Exercise = mongoose.model('Exercise', exercsiseSchema)

app.post('/api/users', function (req, res) {
  const newUser = new User({
    username: req.body.username
  })

  newUser.save()
  res.json(newUser)
})

app.get('/api/users', async function (req, res) {
  const response = await User.find()
  res.json(response)
})

app.post('/api/users/:_id/exercises', async function (req, res) {
  const id = req.params._id
  const user = await User.findById(id)

  const newExercise = new Exercise({
    userId: id,
    date: req.body.date ? req.body.date : new Date(),
    duration: Number(req.body.duration),
    description: req.body.description
  })
  await newExercise.save()

  const response = {
    _id: newExercise.userId,
    username: user.username,
    date: new Date(newExercise.date).toDateString(),
    duration: newExercise.duration,
    description: newExercise.description
  }
  res.json(response)
})

app.get('/api/users/:_id/logs', async function (req, res) {
  const range = req.query
  const id = req.params._id
  
  let findCondition = { userId: req.params._id };

  if (req.query.from || req.query.to) {
    let newDate = new Object();
    newDate["$lte"] = new Date(req.query.to);
    newDate["$gte"] = new Date(req.query.from);
    findCondition = {
      userId: req.params._id,
      date: newDate
    }
  }

  const exercises = await Exercise.find(findCondition).limit(req.query.limit);

  const user = await User.findById(id)
  const dateFiltered = []

  exercises.forEach((exercise) => {
    dateFiltered.push({
      description: exercise.description,
      duration: exercise.duration,
      date: exercise.date.toDateString()
    })
  })

  console.log(dateFiltered, range)
  res.json({
    user,
    count: exercises.length,
    log: dateFiltered
  })
})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

