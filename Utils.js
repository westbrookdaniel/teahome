let crypto = require('crypto');

const Utils = {

  hashPass: (pass) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(pass, salt, 2048, 32, 'sha512').toString('hex');
    return [salt, hash].join('$');
  },

  verifyHash: (pass, original) => {
    const originalHash = original.split('$')[1];
    const salt = original.split('$')[0];
    const hash = crypto.pbkdf2Sync(pass, salt, 2048, 32, 'sha512').toString('hex');
    return hash === originalHash;
  }
}

module.exports = Utils;
