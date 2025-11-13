// Define the list of possible food orders
const orders = [
    'nasi goreng', 'ayam bakar', 'mie goreng', 'nasi uduk',
    'sate', 'bakso', 'soto', 'gado-gado', 'rendang', 'burger', 'pizza', 'sosis bakar', 'nasi padang', 'bakso bakar', 'martabak', 'ikan goreng', 'ikan bakar', 'rawon', 'sushi', 'ramen', 'es teh', 'kopi susu', 'kopi hitam', 'teh manis', 'es jeruk', 'es campur', 'coca cola'
];

const cooldown = 30 * 60 * 1000; // 30 minutes in milliseconds

function getRandomReward(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let handler = async (m, { conn, usedPrefix,setReply }) => {
    if (!conn.katering) conn.katering = {}; // Initialize conn.katering if undefined

    if (!m.text || !m.sender || !m.chat) {
        console.error("Invalid message format");
        return;
    }

    let command = m.text.split(' ')[0].toLowerCase();
    let args = m.text.split(' ').slice(1).join(' ').toLowerCase(); // mengambil argumen setelah command
    let user = m.sender;
    let chatId = m.chat;

    if (!conn.katering[chatId]) {
        conn.katering[chatId] = {};
    }

    if (!conn.katering[chatId][user]) {
        conn.katering[chatId][user] = {
            isOpen: false,
            currentOrder: null,
            money: 0,
            exp: 0,
            inventory: {
                common: [],
                uncommon: []
            },
            customerCount: 0,
            timer: null,
            interval: null
        };
    }

    if (!global.db.data.users[user]) {
        global.db.data.users[user] = {
            money: 0,
            exp: 0,
            inventory: {
                common: [],
                uncommon: []
            },
            lastClosed: 0
        };
    }

    const newCustomer = () => {
        if (!conn.katering[chatId][user].isOpen) return;
        let order = orders[Math.floor(Math.random() * orders.length)];
        conn.katering[chatId][user].currentOrder = order;

        let skyid = {
            text: `⟣───「 *PESANAN* 」───⟢
 │🧑🏻‍🍳 [ *Player* : @${user.replace(/@.+/, '')} ]
 │📜 [ *Pesanan Ke* : ${conn.katering[chatId][user].customerCount + 1}/5 ]
 │📝 [ *Makanan* : ${order} ]
⟣──────────⟢

Ketik .pesanan <makanan>`,
mentions:[m.sender],
            contextInfo: {
                mentionedJid:[m.sender],
                externalAdReply: {
                    title: `FᴏᴏᴅTʀᴜᴄᴋ`,
                    body: "",
                    thumbnailUrl: `https://pomf2.lain.la/f/n9bkkw02.jpg`,
                    sourceUrl: `https://whatsapp.com/channel/0029VafEhDUIXnlyGgMSgH2u`,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        };

      
        conn.sendMessage(m.chat,skyid,{quoted:m})

        conn.katering[chatId][user].timer = setTimeout(() => {
            if (conn.katering[chatId][user].isOpen && conn.katering[chatId][user].currentOrder) {
                let teks = `Info @${user.replace(/@.+/, '')}, Katering kamu tutup karena tidak melayani pelanggan tepat waktu.`
                setReply(teks, [m.sender]);
                clearInterval(conn.katering[chatId][user].interval);
                conn.katering[chatId][user].isOpen = false;
                conn.katering[chatId][user].currentOrder = null;
                conn.katering[chatId][user].customerCount = 0;
                global.db.data.users[user].lastClosed = Date.now();
            }
        }, 3 * 60 * 1000); // 3 minutes
    };

    if (command === `${usedPrefix}katering`) {
        if (conn.katering[chatId][user].isOpen) {
           let teks =`Hey @${user.replace(/@.+/, '')}, Katering kamu masih buka. Silakan layani pelanggan.`
            setReply(teks, [m.sender]);
            return;
        }

        let currentTime = Date.now();
        if (global.db.data.users[user].lastClosed && (currentTime - global.db.data.users[user].lastClosed < cooldown)) {
            let remainingTime = cooldown - (currentTime - global.db.data.users[user].lastClosed);
           let teks = `@${user.replace(/@.+/, '')}, Kamu sudah melayani pelanggan seharian, istirahatlah sejenak\n${Math.ceil(remainingTime / 60000)} menit lagi.` 
            setReply(teks,[m.sender]) 
            return;
        }

        conn.katering[chatId][user].isOpen = true;
        conn.katering[chatId][user].customerCount = 0;

        let skyid = {
            text: 'Katering dibuka! Siap-siap melayani pelanggan setiap 3 menit.\n\nKetik .tutup untuk mengakhiri permainan',
            contextInfo: {
                externalAdReply: {
                    title: `FᴏᴏᴅTʀᴜᴄᴋ`,
                    body: "",
                    thumbnailUrl: `https://pomf2.lain.la/f/n9bkkw02.jpg`,
                    sourceUrl: `https://whatsapp.com/channel/0029VafEhDUIXnlyGgMSgH2u`,
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        };
        setReply(skyid, [m.sender]);

        newCustomer();
        conn.katering[chatId][user].interval = setInterval(() => {
            if (conn.katering[chatId][user].isOpen) {
                newCustomer();
            }
        }, 3 * 60 * 1000);
    } else if (command === `${usedPrefix}pesanan`) {
        if (!conn.katering[chatId][user].isOpen) {
            let teks = `Katering belum dibuka, @${user.replace(/@.+/, '')}. Gunakan ${usedPrefix}katering untuk membuka.`
            setReply(teks, [m.sender]);
            return;
        }

        if (args === conn.katering[chatId][user].currentOrder) {
            conn.katering[chatId][user].customerCount += 1;
            conn.katering[chatId][user].currentOrder = null;
            clearTimeout(conn.katering[chatId][user].timer);

            // Reward player for correct order
            let rewardMoney = getRandomReward(10, 50);
            let rewardExp = getRandomReward(5, 20);
            global.db.data.users[user].money += rewardMoney;
            global.db.data.users[user].exp += rewardExp;

            let teks = `Pesanan berhasil diselesaikan! Kamu mendapatkan ${rewardMoney} uang dan ${rewardExp} EXP.\nPesanan selanjutnya akan datang dalam 3 menit, @${user.replace(/@.+/, '')}.`
            setReply(teks, [m.sender]);

            if (conn.katering[chatId][user].customerCount >= 5) {
                m.reply(`Katering kamu telah selesai melayani 5 pelanggan. Tutup otomatis.`);
                clearInterval(conn.katering[chatId][user].interval);
                conn.katering[chatId][user].isOpen = false;
                global.db.data.users[user].lastClosed = Date.now();
            } else {
                newCustomer(); // Generate next customer
            }
        } else {
            m.reply(`Pesanan salah. Pelanggan memesan ${conn.katering[chatId][user].currentOrder}, bukan ${args}`);
        }
    } else if (command === `${usedPrefix}tutup`) {
        if (!conn.katering[chatId][user].isOpen) {
            let teks =`Katering kamu belum buka, @${user.replace(/@.+/, '')}. Gunakan ${usedPrefix}katering untuk membuka.`;
            setReply(teks, [m.sender]);
            return;
        }

        clearInterval(conn.katering[chatId][user].interval);
        clearTimeout(conn.katering[chatId][user].timer);
        conn.katering[chatId][user].isOpen = false;
        conn.katering[chatId][user].currentOrder = null;
        conn.katering[chatId][user].customerCount = 0;
        global.db.data.users[user].lastClosed = Date.now();

        let teks = `Katering kamu telah ditutup, @${user.replace(/@.+/, '')}. Terima kasih telah melayani pelanggan hari ini!`
        setReply(teks, [m.sender]);
    }
};
handler.help = ['katering', 'pesanan <makanan>', 'tutup'];
handler.tags = ['game'];
handler.command = /^(katering|pesanan|tutup)$/i;
handler.rpg = true;
handler.group = true;
handler.register = true;
export default handler;

// Fungsi untuk mengubah milidetik ke format hari, jam, menit, dan detik
function clockString(ms) {
    let d = Math.floor(ms / 86400000);
    let h = Math.floor(ms / 3600000) % 24;
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [d, ' *Hari* ', h, ' *Jam* ', m, ' *Menit* ', s, ' *Detik* '].map(v => v.toString().padStart(2, 0)).join('');
}