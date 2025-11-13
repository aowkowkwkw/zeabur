import moment from '../modules/moment.js';

// Fungsi membuka grup pada waktu tertentu (atau update data jika sudah ada)
const open = (name, id, clock, _dir) => {
  const position = _dir.findIndex(item => item.id === id);
  if (position !== -1) {
    // Update data
    _dir[position].opened = false; // Reset dulu kalau sebelumnya sudah terbuka
    _dir[position].timeOpen = clock;
    _dir[position].id = id;
  } else {
    // Tambah data baru
    _dir.push({
      name,
      id,
      opened: false,
      closed: false,
      timeOpen: clock,
      timeClose: ''
    });
  }
};

// Fungsi menutup grup pada waktu tertentu (atau update data jika sudah ada)
const close = (name, id, clock, _dir) => {
  const position = _dir.findIndex(item => item.id === id);
  if (position !== -1) {
    // Update data
    _dir[position].closed = false; // Reset dulu kalau sebelumnya sudah ditutup
    _dir[position].timeClose = clock;
    _dir[position].id = id;
  } else {
    // Tambah data baru
    _dir.push({
      name,
      id,
      opened: false,
      closed: false,
      timeOpen: '',
      timeClose: clock
    });
  }
};

// Fungsi loop otomatis menjalankan open/close grup sesuai waktu yang diatur
const running = async (_dir) => {
  let setTime = db.data.others['setTime'];
  if (!setTime) db.data.others['setTime'] = [];

  if (setTime.length > 0) {
    setInterval(async () => {
      const time = moment().tz('Asia/Jakarta').format('HH:mm');

      // Ambil semua grup yang sedang aktif / diikuti
      const getGroups = await conn.groupFetchAllParticipating();
      const groupIds = Object.values(getGroups).map(v => v.id);

      // Loop mundur supaya aman kalau ada yang dihapus saat loop
      for (let i = setTime.length - 1; i >= 0; i--) {
        const group = setTime[i];
        if (!group) continue;

        // Jika waktu buka tercapai dan grup belum dibuka
        if (!group.opened && group.timeOpen && time === group.timeOpen) {
          if (!groupIds.includes(group.id)) {
            // Grup sudah tidak ada, hapus data
            setTime.splice(i, 1);
            console.log("menghapus auto open/close time pada group yang sudah tidak ada");
            continue;
          }

          group.opened = true;
          group.closed = false; // Reset closed jika ada

          // Buka pengaturan grup dan kirim notifikasi
          await conn.groupSettingUpdate(group.id, 'not_announcement');
          const text = `Waktu buka grup telah tiba sesuai jam ${group.timeOpen} WIB.\nGrup akan ditutup kembali pada jam ${group.timeClose}.`;
          await conn.sendMessage(group.id, { text });

        // Jika waktu tutup tercapai dan grup belum ditutup
        } else if (!group.closed && group.timeClose && time === group.timeClose) {
          if (!groupIds.includes(group.id)) {
            // Grup sudah tidak ada, hapus data
            setTime.splice(i, 1);
            console.log("menghapus auto open/close time pada group yang sudah tidak ada");
            continue;
          }

          group.closed = true;
          group.opened = false; // Reset opened jika ada

          // Tutup pengaturan grup dan kirim notifikasi
          await conn.groupSettingUpdate(group.id, 'announcement');
          const text = `Waktu tutup grup telah tiba sesuai jam ${group.timeClose} WIB.\nGrup akan dibuka kembali pada jam ${group.timeOpen}.`;
          await conn.sendMessage(group.id, { text });

        // Reset status opened/closed jika waktu sudah tidak sesuai
        } else {
          if (group.opened && time !== group.timeOpen) group.opened = false;
          if (group.closed && time !== group.timeClose) group.closed = false;
        }
      }
    }, 2000);
  }
};

// Hapus data grup dari _data berdasarkan id
const del = (userId, _data) => {
  const position = _data.findIndex(item => item.id === userId);
  if (position !== -1) {
    _data.splice(position, 1);
    return true;
  }
  return false;
};

// Ambil data grup berdasarkan id
const getIndex = (userId, _dir) => {
  return _dir.find(item => item.id === userId) || null;
};

// Ambil waktu buka grup berdasarkan id
const getOpen = (userId, _dir) => {
  const group = _dir.find(item => item.id === userId);
  return group ? group.timeOpen : null;
};

// Ambil waktu tutup grup berdasarkan id
const getClose = (userId, _dir) => {
  const group = _dir.find(item => item.id === userId);
  return group ? group.timeClose : null;
};

// Cek apakah grup dengan id tertentu ada di _dir
const check = (userId, _dir) => {
  return _dir.some(item => item.id === userId);
};

export default {
  open,
  close,
  getOpen,
  getClose,
  running,
  check,
  getIndex,
  del
};
