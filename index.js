// Import necessary modules
const net = require("net");

// TCP server configuration
const tcpPort = 8090;

function decodeGT06(buffer) {
  // Check start and end byte
  if (buffer[0] !== 0x78 || buffer[buffer.length - 1] !== 0x0A) {
    console.log('Invalid packet start or end marker');
    return;
  }

  // Extract fields from the buffer (using known GT06 structure)
  const protocolId = buffer.readUInt8(1);  // Protocol ID (often 1 for GT06)
  console.log('Protocol ID:', protocolId);

  // Latitude and Longitude (stored as integers in GT06, scaled by 1,000,000)
  const latitude = buffer.readInt32LE(8) / 1000000;
  const longitude = buffer.readInt32LE(12) / 1000000;
  console.log('Latitude:', latitude);
  console.log('Longitude:', longitude);

  // Speed (usually stored as a 2-byte value)
  const speed = buffer.readUInt16LE(16);  // Speed in km/h
  console.log('Speed (km/h):', speed);

  // Course (heading) - often a 2-byte value
  const course = buffer.readUInt16LE(18);  // Course in degrees
  console.log('Course (degrees):', course);

  // Timestamp (usually in Unix time, stored in 4 bytes)
  const timestamp = new Date(buffer.readUInt32LE(4) * 1000);  // Convert from seconds to milliseconds
  console.log('Timestamp:', timestamp);

  // Battery or other data (can vary, depends on GT06 configuration)
  const batteryVoltage = buffer.readUInt16LE(20);  // Example: Read voltage data (if available)
  console.log('Battery Voltage:', batteryVoltage);

}

// Create a TCP server
const server = net.createServer((socket) => {
  console.log("New client connected:", socket.remoteAddress);

  // Event: Data received from client
  socket.on("data", (data) => {
    try {
      console.log("🚀 ~ socket.on ~ messageBuffer:", data)
      console.log("Data received from client:", decodeGT06(data));

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

