let configs = {};
let userSteps = {};

function generateCode() {
  return Math.floor(Math.random() * 100000);
}

module.exports = {
  saveNewConfig(text) {
    const code = generateCode().toString();
    configs[code] = {
      text,
      downloads: 0,
      limit: 10,
      downloadedBy: [],
    };
    return code;
  },
  getConfig(code) {
    return configs[code];
  },
  setStep(userId, step) {
    userSteps[userId] = step;
  },
  getStep(userId) {
    return userSteps[userId] || null;
  },
};
