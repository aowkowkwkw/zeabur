//import fs from "fs";
import fs from 'fs-extra'

const add = (msg, _data) => {
  const obj = {
    cmd: msg,
  };
  _data.push(obj);

  return true;
};

const del = (command, _data) => {
  Object.keys(_data).forEach((i) => {
    if (_data[i].cmd === command) {
      _data.splice(i, 1);

    }
  });
  return true;
};

const check = (command, _data) => {
  let status = false;
  Object.keys(_data).forEach((i) => {
    if (_data[i].cmd === command) {
      status = true;
    }
  });

  return status;
};


export default {
  add,
  del,
  check,
};

 