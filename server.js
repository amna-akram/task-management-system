const jsonServer = require('json-server');
const http = require('http');
const server = http.createServer();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults(); // Use jsonServer.defaults() correctly
const io = require('socket.io')(server);

router.db._.id = 'id';

io.on('connection', (socket) => {
  console.log('A client connected.');

  const watcher = router.db.watch();
  watcher.on('change', () => {
    io.emit('data', router.db.getState().tasks);
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected.');
  });
});

server.on('request', (req, res) => {
  // Add your JSON Server middlewares here
  middlewares(req, res, () => {
    router(req, res);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
