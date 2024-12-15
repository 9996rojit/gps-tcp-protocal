// Import necessary modules
const net = require("net");

// TCP server configuration
const tcpPort = 8090;

// Create a TCP server
const server = net.createServer((socket) => {
  console.log("New client connected:", socket.remoteAddress);

  // Event: Data received from client
  socket.on("data", (data) => {
    try {
      const message = data.toString('hex');
      console.log("Data received from client:", message);

      // Respond to the client
      socket.write("Data received successfully!\n");
    } catch (error) {
      console.error("Error processing data:", error);
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
