const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Listen for driver location updates
    socket.on('driverLocationUpdate', (data) => {
        console.log('Driver location:', data);
        // Broadcast location to all clients
        io.emit('driverLocation', data);
    });

    // Listen for traffic updates
    socket.on('trafficUpdate', (data) => {
        console.log('Traffic update:', data);
        // Broadcast traffic data to all clients
        io.emit('trafficData', data);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
