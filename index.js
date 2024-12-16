// Import necessary modules
const net = require("net");
const Gt06 = require('gt06')

// TCP server configuration
const tcpPort = 8090;

// const byte = new Buffer.from('78781101086961106002852380411f4100007365f0d0a', 'hex')
// const gt06 = new Gt06()
// gt06.parse(byte)
// console.log("++++++++++++++++++++++>", gt06)

// Create a TCP server
const server = net.createServer((socket) => {
  const gt06 = new Gt06();
  console.log("New client connected:", socket.remoteAddress);

  // Event: Data received from client
  socket.on('data', (data) => {
    try {
      gt06.parse(data);
    }
    catch (e) {
      console.log('err', e);
      return;
    }

    if (gt06.expectsResponse) {
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

