import { performance } from 'perf_hooks';

let handler = async (m, { setReply }) => {
  const start = performance.now();
  
  // Simulasi tugas async (jika perlu)
  // await new Promise(res => setTimeout(res, 10));
  
  const end = performance.now();
  const latensi = end - start;

  setReply(`🚀 Speed: ${latensi.toFixed(4)} ms`);
};

handler.help = ['speedtest'];
handler.tags = ['spesifikasi'];
handler.command = ['speed'];
export default handler;
