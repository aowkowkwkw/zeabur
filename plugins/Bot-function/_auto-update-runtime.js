// Optimized by GitHub Copilot
let handler = (m) => m;

handler.before = async function (m, { conn, isPremium }) {
  // Pastikan interval hanya dibuat sekali
  if (!global.runtimeInterval) {
    global.runtimeInterval = setInterval(() => {
      try {
        const runtimeData = global.db.data.others['runtime'];

        if (runtimeData) {
          const now = Date.now();
          if (now - runtimeData.lastTime > 60 * 60 * 1000) {
            runtimeData.runtime = now;
            runtimeData.lastTime = now;
            console.log(`[${new Date().toISOString()}] Runtime diperbarui`);
          } else {
            runtimeData.lastTime = now;
          }
        } else {
          global.db.data.others['runtime'] = {
            runtime: Date.now(),
            lastTime: Date.now(),
          };
          console.log(`[${new Date().toISOString()}] Runtime baru dibuat`);
        }
      } catch (err) {
        console.error(`[${new Date().toISOString()}] ❌ Error saat memperbarui runtime:`, err);
      }
    }, 60000); // Interval 60 detik
  }
};

export default handler;