let handler = async (m, { q, conn, isOwner, command, setReply }) => {
    if (! m.mention) return setReply("reply/tag targetnya");
    if (!m.isAdmin && !isOwner) return setReply(mess.only.admin);
    if (!m.isGroup) return setReply(mess.only.group);
    if (!m.isBotAdmin) return setReply(mess.only.Badmin);
    await conn
      .groupParticipantsUpdate(m.chat, [ m.mention], "demote")
      .then((res) => setReply(`Sukses Promote ${ m.mention}`))
      .catch((err) => setReply(jsonformat(err)));
  };
  
  handler.tags = ["admin"];
  handler.command = ["unadmin","demote"];
  handler.group = true;
 
  export default handler;
  