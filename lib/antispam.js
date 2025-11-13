
import fs from 'fs-extra'
 

// Message Filter / Message Cooldowns
const usedCommandRecently = new Set();

const isFiltered = (from) => {
  return !!usedCommandRecently.has(from);
};

const addFilter = (from) => {
  usedCommandRecently.add(from);
  setTimeout(() => {
    return usedCommandRecently.delete(from);
  }, 5000); // 5sec is delay before processing next command
};

const add = (nama, userId, expired, _data) => {
  let success = false;
  if (expired === undefined) {
    expired = "PERMANENT";
  } else {
    expired = expired;
  }

  let expired_at = "PERMANENT";

  if (expired === "PERMANENT") {
    expired_at = "PERMANENT";
  } else {
    expired_at = Date.now() + conn.toMs(expired);
  }

  let obj = { name: nama, id: userId, expired: expired_at };
  _data.push(obj);
  //fs.writeFileSync('./database/antispam.json', JSON.stringify(_data))
};

/**
 * Unbanned someone.
 * @param {String} userId
 * @param {Object} _dir
 * @returns {Number}
 */
const del = (userId, _data) => {
  let position = null;
  Object.keys(_data).forEach((i) => {
    if (_data[i].id === userId) {
      position = i;
    }
  });
  if (position !== null) {
    _data.splice(position, 1);
    //fs.writeFileSync('./database/antispam.json', JSON.stringify(_data))
  }
  return true;
};

const Expired = (senderNumber, nama, _db) => {
  var found = false;
  var status = false;

  Object.keys(_db).forEach((i) => {
    if (Date.now() >= _db[i].expired) {
      found = i;
      status = false;
    }
  });

  if (found !== false) {
    if (_db[found].expired === "PERMANENT") {
      status = null;
    } else if (Date.now() >= _db[found].expired) {
      console.log(`Anti Spam ${nama} expired: ${_db[found].id}`);
      status = true;
      _db.splice(found, 1);
      //fs.writeFileSync('./database/antispam.json', JSON.stringify(_db))
    }
  }

  return status;
};

const check = (nama, userId, _db) => {
  var found = false;
  var status = false;
  Object.keys(_db).forEach((i) => {
    if (_db[i].name == nama && _db[i].id == userId) {
      status = true;
    }
  });
  return status;
};

export default {
  isFiltered,
  addFilter,
  add,
  del,
  Expired,
  check,
};

 