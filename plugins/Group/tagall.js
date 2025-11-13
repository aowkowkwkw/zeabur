let handler = async (m, { q, conn, isOwner, setReply }) => {
  if (!m.isGroup) return setReply(mess.only.group);
  if (!q) {
    var inpo = "No inpo";
  } else var inpo = q;
  let members_id = [];
  let tes = "\n";
  await m.groupMembers.map((i) => {
    tes += `┣ ⬣@${i.id.split("@")[0]}\n`;
    members_id.push(i.id);
  });
   let users = m.groupMembers.map(v => v.id).filter(v => v !== conn.user.jid).slice(0, 50); // ⛔️ Max 100 tag
  setReply(
`
*From :* ${m.pushname}
        
Info :  ${inpo}
        
Total Member : ${m.groupMembers.length}
        
┏━⬣` +
tes +
`┗━⬣`,
users
);
};
handler.help = ["query"];
handler.tags = ["no"];
handler.command = ["tagall"];
handler.group = true;
export default handler;
