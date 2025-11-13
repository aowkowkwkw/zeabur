let handler = async (m) => {
    let who;
    let armor = global.db.data.users[m.sender].armor;
    let attack = global.db.data.users[m.sender].attack;
    let damage = global.db.data.users[m.sender].damage;
    let katana = global.db.data.users[m.sender].katana;
    let sword = global.db.data.users[m.sender].sword;
    let skill = global.db.data.users[m.sender].skill;
    let wand = global.db.data.users[m.sender].wand;
    let wizarthat = global.db.data.users[m.sender].wizardhat;
    let shield = global.db.data.users[m.sender].shield;
    let armordurability = global.db.data.users[m.sender].armordurability;
    let katanadurability = global.db.data.users[m.sender].katanadurability;
    let sworddurability = global.db.data.users[m.sender].sworddurability;
    let magicalitem = global.db.data.users[m.sender].magicalitem; // satu tipe untuk topi, tongkat, dan perisai sihir
    let magicalitemdurability = global.db.data.users[m.sender].magicalitemdurability; // satu tipe untuk durabilitas topi, tongkat, dan perisai sihir
    let user = global.db.data.users[m.sender];
    if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
    else who = m.sender;
    if (typeof db.data.users[who] == 'undefined') throw 'Pengguna tidak ada didalam data base';
    
    // Menghitung persentase darah dan mengubah tampilan darah
    let health = global.db.data.users[who].health;
    let hearts = '';
    let count = Math.ceil(health / 100);
    for (let i = 0; i < 5; i++) {
        if (count > 0) {
            hearts += '▬';
            count--;
        } else {
            hearts += '▭';
        }
    }
    let healthDisplay = hearts.trim() + `   ${global.db.data.users[who].health}/500`;
    
    // Menghitung persentase stamina dan mengubah tampilan stamina
    let stamina = global.db.data.users[who].stamina;
    let bars = '';
    count = Math.ceil(stamina / 50); // Assuming stamina max is 100
    for (let i = 0; i < 5; i++) {
        if (count > 0) {
            bars += '▬';
            count--;
        } else {
            bars += '▭';
        }
    }
    let staminaDisplay = bars.trim() + `   ${stamina}/250`;
    
    // Menghitung total jumlah item magical yang dimiliki pengguna
    let totalMagicalItems = wizarthat + wand + shield;

    // Menghitung perbedaan dalam nilai magicalitemdurability sebelum dan setelah pembaruan
    let magicalItemDurabilityDifference = magicalitemdurability - global.db.data.users[m.sender].magicalitemdurability;

    // Jika perbedaan adalah 1, 2, atau 3, tambahkan buff health dan armor durability
    if (magicalItemDurabilityDifference > 0 && magicalItemDurabilityDifference <= 3) {
        magicalitemdurability += 66 * magicalItemDurabilityDifference; // Menambahkan buff durabilitas armor
        health += 166 * magicalItemDurabilityDifference; // Menambahkan buff kesehatan
        // Pastikan health tidak melebihi maksimum (500)
        health = Math.min(health, 500);
        // Pastikan durabilitas armor tidak melebihi maksimum (250)
        magicalitemdurability = Math.min(magicalitemdurability, 250);
        global.db.data.users[m.sender].health = health; // Memperbarui kesehatan pengguna dalam database
        global.db.data.users[m.sender].magicalitemdurability = magicalitemdurability; // Memperbarui durabilitas armor dalam database
    }

    // Menampilkan informasi peralatan dan status pengguna
    m.reply(`乂 *W E A P O N S* 乂\n
- 👑 *User*:  ${user.registered ? user.name : conn.getName(m.sender)}
- 🎗️ *Role*: ${user.role}
- 🥇 *Skill*:  ${user.skill}
- 📊 *Level*:  ${user.level}
- ❤️ *Darah*: ${healthDisplay}
- 🌀 *Stamina*: ${staminaDisplay}
- 🪓 *Attack*: ${user.attack}
- 💣 *Damage*: ${user.damage}
      
- 🧥 *Armor*: ${armor == 0 ? 'Tidak Punya' : '' || armor == 1 ? 'Leather Armor' : '' || armor == 2 ? 'Iron Armor' : '' || armor == 3 ? 'Gold Armor' : '' || armor == 4 ? 'Diamond Armor' : '' || armor == 5 ? 'Netherite Armor' : ''}
- ⚔️ *Sword*: ${sword == 0 ? 'Tidak Punya' : '' || sword == 1 ? 'Wooden Sword' : '' || sword == 2 ? 'Iron Sword' : '' || sword == 3 ? 'Gold Sword' : '' || sword == 4 ? 'Diamond Sword' : '' || sword == 5 ? 'Netherite Sword' : ''}
- 🗡️ *Katana*: ${katana == 0 ? 'Tidak Punya' : '' || katana == 1 ? 'Fubuki' : '' || katana == 2 ? 'Koyuki' : '' || katana == 3 ? 'Mizore' : '' || katana == 4 ? 'Shigure' : '' || katana == 5 ? 'Yukikaze' : ''}
- 🎩 *Magical Item*: ${magicalitem == 0 ? 'Tidak Punya' : '' || magicalitem == 1 ? 'Topi Sihir' : '' || magicalitem == 2 ? 'Topi Sihir || Tongkat Sihir' : '' || magicalitem == 3 ? 'Topi Sihir || Tongkat Sihir || Perisai Sihir' : ''}
      
- 🛡️ *ArmorDurability*:  ${armordurability}/250
- ⚔️ *SwordDurability*: ${sworddurability}/250
- 🗡️ *KatanaDurability*: ${katanadurability}/250`);
}

handler.help = ['weapon'];
handler.tags = ['rpg'];
handler.command = /^(weapon|weapons|wepon)$/i;
export default handler;