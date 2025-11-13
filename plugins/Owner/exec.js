import cp, { exec as _exec } from "child_process";
import { promisify } from '../../modules/util.js'
let exec = promisify(_exec).bind(cp);
let handler = async (m, { conn, isOwner, q,setReply, command, text }) => {
  if (!m.fromMe && !isOwner) return setReply(mess.only.ownerB);
  await setReply("_Executing..._");
  exec(q, async (err, stdout) => {
    if (err) return setReply(`${copyright}:~ ${err}`);
    if (stdout) {
      await setReply(`*>_ Console*\n\n${stdout}`);
    }
  });
};

handler.command = ["$","exec"];
export default handler;
