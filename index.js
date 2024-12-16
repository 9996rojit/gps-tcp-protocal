// Import necessary modules
const net = require("net");
const Gt06 = require('gt06')

const tcpPort = 8090;
// Create a TCP server
const server = net.createServer((socket) => {
  const gt06 = new Gt06();
  console.log("New client connected:", socket.remoteAddress);

  // Event: Data received from client
  socket.on('data', (data) => {
    try {
      console.log(data.toString('hex'))
      gt06.parse(data);
    }
    catch (e) {
      console.log('err', e);
      return;
    }

    if (gt06.expectsResponse && gt06.event?.string === 'login') {
      socket.write(gt06.responseMsg)
    }
    if (gt06.expectsResponse && gt06.event?.string === 'status') {
      socket.write(gt06.responseMsg)
    }

    gt06.msgBuffer.forEach(msg => {
      console.log(msg);
    });

    gt06.clearMsgBuffer();
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

