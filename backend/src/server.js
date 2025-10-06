require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const initProctoringSocket = require('./services/proctoringSocket');

const port = process.env.PORT || 4000;

const server = http.createServer(app);

(async () => {
  await connectDB();
  initProctoringSocket(server);
  server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${port}`);
  });
})();

process.on('unhandledRejection', (err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
