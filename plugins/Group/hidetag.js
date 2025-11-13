import fs from "fs-extra";
let handler = async (m, { q, conn, isOwner, command, setReply }) => {
  const isImage = m.type === "imageMessage";
  const isVideo = m.type === "videoMessage";
  const isAudio = m.type == "audioMessage";
  const isQuotedImage =
    m.type === "extendedTextMessage" && m.content.includes("imageMessage");
  const isQuotedVideo =
    m.type === "extendedTextMessage" && m.content.includes("videoMessage");
  const isQuotedAudio =
    m.type === "extendedTextMessage" && m.content.includes("audioMessage");
  const isQuotedText =
    m.type === "extendedTextMessage" && m.content.includes("conversation");

  if (!m.isGroup) return setReply(mess.only.group);
  if (!m.isAdmin && !isOwner) return m.reply(mess.only.admin);
const mentions = m.groupMembers.map(v => v.id).filter(v => v !== conn.user.jid).slice(0, 100); // ⛔️ Max 100 tag



  if (
    !isQuotedText &&
    (isQuotedImage ||
      isQuotedVideo ||
      isImage ||
      isVideo ||
      isQuotedAudio ||
      isAudio)
  ) {
    let p = m.quoted ? m.quoted : m;
    let media = await p.download();


    if (isQuotedImage || isImage) {
      let caption = m.quoted? q? `${q}\n\n${m.quoted.caption}`: m.quoted.caption : q 
      conn.sendMessage(m.chat, {
        image: media,
         caption,
        mentions,
      });
    } else if (isQuotedVideo || isVideo) {
      let caption = m.quoted? q? `${q}\n\n${m.quoted.caption}`: m.quoted.caption : q 
      conn.sendMessage(m.chat, {
        video: media,
        caption,
        mentions,
      });
    } else if (isQuotedAudio || isAudio) {
      conn.sendMessage(m.chat, {
        audio: media,
        mentions,
        mimetype: "audio/mp4",
      });
    }
  } else if (m.quoted && (m.quoted.type == "extendedTextMessage" || m.quoted.type == "conversation")) {
    Log("m.quoted.text");
    conn.sendMessage(m.chat, { text: m.quoted.text, mentions });
  } else {
    Log("nothing");
    conn.sendMessage(m.chat, { text: q ? q : "", mentions });
  }
};

handler.tags = ["admin"];
handler.command = ["hidetag", "tag"];
handler.group = true;
export default handler;
