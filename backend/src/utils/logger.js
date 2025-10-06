const morgan = require('morgan');

const stream = {
  write: (message) => {
    if (process.env.NODE_ENV !== 'test') {
      // eslint-disable-next-line no-console
      console.log(message.trim());
    }
  }
};

const skip = () => process.env.NODE_ENV === 'test';

module.exports = {
  requestLogger: morgan('combined', { stream, skip })
};
