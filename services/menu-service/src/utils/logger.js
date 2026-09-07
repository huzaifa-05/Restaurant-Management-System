function log(level, message, meta = {}) {
  console.log(JSON.stringify({ level, message, timestamp: new Date().toISOString(), ...meta }));
}

const logger = {
  info: (message, meta) => log("info", message, meta),
  error: (message, meta) => log("error", message, meta),
  warn: (message, meta) => log("warn", message, meta)
};

module.exports = { logger };
