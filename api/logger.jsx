function logger(req, res, next) {
  console.log(
    `\n[${new Date().toISOString()}] ${req.method} to ${
      req.url
    } from \norigin: ${req.get("origin")}`
  );
  if (req.body.username) {
    console.log(`body username: ${req.body.username}`);
  }
  if (req.headers.username) {
    console.log(`header username: ${req.headers.username}`);
  }
  if (req.session.user) {
    console.log(`session username: ${req.session.user.username}`);
  }

  next();
}

module.exports = logger;
