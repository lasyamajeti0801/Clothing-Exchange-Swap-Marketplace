import http from 'http';
import app from './app.js';
import { initSocket } from './socket.js';
import { ENV } from './config/env.js';

const server = http.createServer(app);

// Initialize real-time Socket.IO
initSocket(server);

const PORT = ENV.PORT;

server.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🌿 ReWear Server running on port ${PORT}`);
  console.log(`🌐 Mode: ${ENV.NODE_ENV}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
  console.log(`=============================================`);
});
