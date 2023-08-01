const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

const PORT = 3002;

const jsonServer = require('json-server');
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const loadInitialTasks = () => {
  const fs = require('fs');
  const tasks = JSON.parse(fs.readFileSync('./db.json', 'utf8')).tasks;
  return tasks;
};

io.on('connection', (socket) => {
  console.log('A client connected.');

  // Emit initial tasks data to the connected client
  const initialTasks = loadInitialTasks();
  socket.emit('data', initialTasks);

  // Log the emitted tasks data to the server logs
  console.log('Emitted tasks data:', initialTasks);

  const chokidar = require('chokidar');
  const watcher = chokidar.watch('./db.json');
  watcher.on('change', (path) => {
    const updatedTasks = loadInitialTasks();
    console.log('db.json has changed, reloading...');

    io.emit('data', updatedTasks);

    console.log('Emitted updated tasks data:', updatedTasks);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected.');
  });
});

// Add a middleware to intercept POST requests only for the /tasks endpoint
app.use('/tasks', (req, res, next) => {
  if (req.method === 'POST') {
    console.log("kiki");
    console.log(req.body);
    const task = req.body;
    // Emit a socket event for the new task

    // Send a POST request to the JSON server to add the task
    const jsonServerUrl = 'http://localhost:3001/tasks'; // Replace with the appropriate URL for your JSON server
    axios.post(jsonServerUrl, task)
      .then(response => {
        console.log('Task added successfully:', response.data);
        // Optionally, you can emit a success event back to the client if needed
        io.emit('taskAddedSuccess', response.data);
        res.status(200); // Return a status code of 201 (Created) and the added task data
      })
      .catch(error => {
        console.error('Error adding task:', error.message);
        // Optionally, you can emit an error event back to the client if needed
        io.emit('taskAddedError', error.message);
      });
  }
  else if (req.method === 'DELETE') {
    console.log(req);
    console.log("kiki2");
    console.log(req.url.split('/').pop());
    const taskId = req.url.split('/').pop();
    const taskName = req.query.taskName;
    const deletedBy = req.query.deletedBy;
    const groupId = req.query.groupId;
    console.log("taskNAME: " + taskName);
    console.log("deleted by: " + deletedBy);

    // Send a POST request to the JSON server to add the task
    const jsonServerUrl = 'http://localhost:3001/tasks'; // Replace with the appropriate URL for your JSON server
    axios.delete((`${jsonServerUrl}/${taskId}`))
      .then(response => {
        console.log('Task Deleted successfully:', response.data);
        // Optionally, you can emit a success event back to the client if needed
        io.emit('taskDeletedSuccess', { taskName, deletedBy, groupId });
        res.sendStatus(200);
      })
      .catch(error => {
        console.error('Error adding task:', error.message);
        // Optionally, you can emit an error event back to the client if needed
        io.emit('taskAddedError', error.message);
      });
  }
  else {
    next(); // For non-POST requests, call the next middleware or route handler
  }
});

// Use the JSON Server middlewares for the /tasks endpoint
app.use('/tasks', middlewares);
app.use('/tasks', router);

server.listen(PORT, () => {
  console.log(`WebSocket Server is running on port ${PORT}`);
});
