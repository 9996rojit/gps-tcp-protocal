// Import necessary modules
const net = require("net");

// TCP server configuration
const tcpPort = 8090;

function decodeGT06(buffer) {
  if (buffer[0] !== 0x7E || buffer[buffer.length - 1] !== 0x7E) {
    console.log('Invalid GT06 packet start or end marker');
    return;
  }

  // Extract the device's information from the buffer
  const protocolId = buffer.readUInt8(1);  // Protocol ID (often 1 for GT06)
  console.log('Protocol ID:', protocolId);

  const gpsFlag = buffer.readUInt8(2);  // GPS flag: 0x01 means GPS data is present
  console.log('GPS Flag:', gpsFlag);

  const latitude = buffer.readInt32LE(16) / 1000000;  // Latitude (scaled by 1,000,000)
  const longitude = buffer.readInt32LE(20) / 1000000;  // Longitude (scaled by 1,000,000)
  console.log('Latitude:', latitude);
  console.log('Longitude:', longitude);

  const speed = buffer.readUInt16LE(24);  // Speed in km/h
  console.log('Speed (km/h):', speed);

  const course = buffer.readUInt16LE(26);  // Course/heading in degrees
  console.log('Course (degrees):', course);

  const timestamp = new Date(buffer.readUInt32LE(8) * 1000);  // Timestamp in seconds (Unix format)
  console.log('Timestamp:', timestamp);

  // Additional data can be extracted similarly depending on the protocol format
  // Example: Battery voltage, status, and other telemetry can also be decoded
}

// Create a TCP server
const server = net.createServer((socket) => {
  console.log("New client connected:", socket.remoteAddress);

  // Event: Data received from client
  socket.on("data", (data) => {
    try {
      const message = data.toString('hex');
      const messageBuffer = Buffer.from(message, 'hex')
      console.log("🚀 ~ socket.on ~ messageBuffer:", messageBuffer)
      console.log("Data received from client:", decodeGT06(messageBuffer));

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

