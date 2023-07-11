/**
 * Interceptor function used to monkey patch the res.send until it is invoked
 * at which point it intercepts the invokation, executes is logic such as res.contentBody = content
 * then restores the original send function and invokes that to finalize the req/res chain.
 *
 * @param res Original Response Object
 * @param send Original UNMODIFIED res.send function
 * @return A patched res.send which takes the send content, binds it to contentBody on
 * the res and then calls the original res.send after restoring it
 */
const responseSent = (res, send) => (content) => {
  res.contentBody = content;
  res.send = send;
  res.send(content);
};

/**
 * Middleware which takes an initial configuration and returns a middleware which will call the
 * given logger with the request and response content.
 *
 * @param logger Logger function to pass the message to
 * @return Middleware to perform the logging
 */
const requestReceived = ({ logger }) => (req, res, next) => {
  logger(`IN <<< ${req.method} ${req.protocol}://${req.hostname}:${process.env.PORT}${req.originalUrl}`);
  res.send = responseSent(res, res.send);
  res.on('finish', () => {
    logger(`OUT >>> ${res.statusMessage} (${res.statusCode})\n`);
  });
  next();
};

module.exports = { requestReceived };
