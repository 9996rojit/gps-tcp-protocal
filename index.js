// Import necessary modules
const net = require("net");

const tcpPort = 8090;

// Create a TCP server
const server = net.createServer((socket) => {
  console.log("New client connected:", socket.remoteAddress);

  // Event: Data received from client
  socket.on('data', (data) => {
    try {
      console.log(data)
    }
    catch (e) {
      console.log('err', e);
      return;
    }
  });


  // Event: Client disconnected
  socket.on("end", () => {
    console.log("Client disconnected:", socket.remoteAddress);
  });

  // Event: Error handling
  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

// Start the server
server.listen(tcpPort, () => {
  console.log(`TCP server is running on port ${tcpPort}`);
});

