// launcher.js by officialdittaz – Optimized by ChatGPT
 

let cmdAdd = function (run, time, _db) {
  let index = _db.findIndex((i) => i.id === run);
  if (index !== -1) {
    _db[index].totalcmd += 1;
  } else {
    _db.push({ id: run, expired: Date.now() + conn.toMs(time), totalcmd: 1 });
  }
};

let expiredCmd = (_dir, _db) => {
  setInterval(() => {
    let index = _dir.findIndex((i) => Date.now() >= i.expired && i.id === "run");
    if (index !== -1) {
      if (_db.length !== 0) {
        console.log("Total hit telah di reset");
        _db.length = 0;
        _dir.splice(index, 1);
        for (let key in db.data.chats) {
          if (db.data.chats[key].hasOwnProperty("hit")) {
            db.data.chats[key].hit = 0;
          }
        }
      }
    }
  }, 2000);
};

let getHit = function (run, _db) {
  let found = _db.find((i) => i.id === run);
  return found ? found.totalcmd : 0;
};

let createDataId = (nama, _level) => {
  _level.push({ name: nama, id: [] });
};

let getDataId = function (nama, _db) {
  let found = _db.find((i) => i.name === nama);
  return found ? found.id : [];
};

let addDataId = function (idgc, nama, _db) {
  let found = _db.find((i) => i.name === nama);
  if (found) found.id.push(idgc);
};

let removeDataId = function (nama, idgc, _db) {
  let found = _db.find((i) => i.name === nama);
  if (found) found.id = found.id.filter((id) => id !== idgc);
};

let checkDataId = function (nama, idgc, _db) {
  let found = _db.find((i) => i.name === nama);
  return found ? found.id.includes(idgc) : false;
};

let checkDataName = function (nama, idgc, claim) {
  return claim.some((i) => i.name === nama);
};

let Succes = function (cmd, _db, allcommand) {
  if (!allcommand.includes(cmd)) allcommand.push(cmd);
  let found = _db.find((i) => i.cmd === cmd);
  if (found) {
    found.succes += 1;
  } else {
    _db.push({ cmd: cmd, succes: 1, failed: 0 });
  }
};

let Failed = function (cmd, _db) {
  let found = _db.find((i) => i.cmd === cmd);
  if (found) {
    found.succes = Math.max(0, found.succes - 1);
    found.failed += 1;
  } else {
    _db.push({ cmd: cmd, succes: 0, failed: 1 });
  }
};

let Nothing = function (cmd, _db, allcommand) {
  let index = allcommand.indexOf(cmd);
  if (index !== -1) allcommand.splice(index, 1);
  let cmdIndex = _db.findIndex((i) => i.cmd === cmd);
  if (cmdIndex !== -1) _db.splice(cmdIndex, 1);
  return true;
};

export default {
  Nothing,
  Failed,
  Succes,
  checkDataName,
  createDataId,
  addDataId,
  removeDataId,
  checkDataId,
  getHit,
  cmdAdd,
  expiredCmd,
};

 