import util from '../../modules/util.js'

let handler = m => m
handler.before = m => {
try{
  let user = global.db.data.users[m.sender]
  if (user.afk > -1) {
    m.reply(`
Kamu Berhenti AFK${user.afkReason ? ' Setelah ' + user.afkReason : ''}
Selama ${(new Date - user.afk).toTimeString()}
`.trim())
    user.afk = -1
    user.afkReason = ''
  }
  let jids = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
  for (let jid of jids) {
    let user = global.db.data.users[jid]
    if (!user) continue
    let afkTime = user.afk
    if (!afkTime || afkTime < 0) continue
    let reason = user.afkReason || ''
    m.reply(`
Jangan Tag Dia!
Dia Sedang AFK ${reason ? 'Dengan Alasan ' + reason : 'Tanpa Alasan'}
Selama ${(new Date - afkTime).toTimeString()}
`.trim())
  }
  return true

} catch(err){
   let e = util.format(err)
 
    log(err)
    //log(m)
    conn.sendMessage(global.nomerOwner+"@s.whatsapp.net", {
      text: `${e}\n\n${global.db.data.users[m.sender]}`
    })

}


}

export default handler
