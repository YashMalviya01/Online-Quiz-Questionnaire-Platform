const { WebSocketServer } = require('ws');
const jwt = require('jsonwebtoken');
const Result = require('../models/Result');
const ProctoringEvent = require('../models/ProctoringEvent');

const clients = new Map();

const initProctoringSocket = (httpServer) => {
  const wss = new WebSocketServer({ server: httpServer, path: '/ws/proctor' });

  wss.on('connection', (ws) => {
    let context = null;

    const closeWith = (code, message) => {
      try {
        ws.send(JSON.stringify({ type: 'ERROR', message }));
      } catch (err) {
        // ignore send failures
      }
      ws.close(code, message);
    };

    ws.on('message', async (raw) => {
      try {
        const data = JSON.parse(raw.toString());
        if (data.type === 'AUTH') {
          if (!data.token || !data.resultId) {
            return closeWith(4001, 'Authentication payload missing');
          }
          const decoded = jwt.verify(data.token, process.env.JWT_SECRET);
          const result = await Result.findById(data.resultId).populate('user');
          if (!result) {
            return closeWith(4002, 'Result not found');
          }
          if (result.status !== 'in-progress') {
            return closeWith(4003, 'Exam session already submitted');
          }
          if (result.user._id.toString() !== decoded.id) {
            return closeWith(4004, 'Forbidden');
          }

          context = {
            userId: decoded.id,
            resultId: result._id
          };
          clients.set(ws, context);
          ws.send(JSON.stringify({ type: 'ACK', message: 'Authenticated' }));
        } else if (data.type === 'EVENT') {
          if (!context) {
            return closeWith(4005, 'Authenticate first');
          }
          const { eventType, severity, eventData = {} } = data.payload || {};
          if (!eventType || !severity) {
            return closeWith(4006, 'Invalid event payload');
          }

          const event = await ProctoringEvent.create({
            session: context.resultId,
            eventType,
            eventData,
            severity
          });

          await Result.findByIdAndUpdate(context.resultId, {
            $push: { proctoringLog: event._id }
          });

          ws.send(
            JSON.stringify({
              type: 'EVENT_RECORDED',
              eventId: event._id,
              timestamp: event.timestamp
            })
          );
        } else if (data.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
        }
      } catch (error) {
        if (error.name === 'JsonWebTokenError') {
          return closeWith(4007, 'Invalid token');
        }
        if (process.env.NODE_ENV !== 'test') {
          // eslint-disable-next-line no-console
          console.error('WebSocket error', error);
        }
        return closeWith(4000, 'Server error');
      }
      return undefined;
    });

    ws.on('close', () => {
      if (context) {
        clients.delete(ws);
      }
    });
  });

  return wss;
};

module.exports = initProctoringSocket;
