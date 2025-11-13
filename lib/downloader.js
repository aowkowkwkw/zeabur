import { igdl, fbdl, ttdl } from 'ruhend-scraper';
import { twitter } from 'btch-downloader';

/**
 * Fungsi untuk mengunduh media dari berbagai platform
 * @param {string} url - URL video dari IG/FB/TikTok/Twitter
 * @returns {Promise<Object>} - Objek berisi data hasil download
 */
async function downloadMedia(url) {
  try {
    let lower = url.toLowerCase();
    
    if (lower.includes('instagram.com')) {
      const res = await igdl(url);
      return { platform: 'instagram', data: res.data };
    }

    if (lower.includes('facebook.com') || lower.includes('fb.watch')) {
      const res = await fbdl(url);
      return { platform: 'facebook', data: res.data };
    }

    if (lower.includes('tiktok.com')) {
      const {
        title, author, username, published,
        like, comment, share, views, bookmark,
        video, cover, music, video_hd, profilePicture
      } = await ttdl(url);
      return {
        platform: 'tiktok',
        data: {
          title, author, username, published,
          like, comment, share, views, bookmark,
          video, cover, music, video_hd, profilePicture
        }
      };
    }

    if (lower.includes('twitter.com') || lower.includes('x.com')) {
      const data = await twitter(url);
      const videoUrl = data.url[0]?.hd || data.url[1]?.sd;
      return { platform: 'twitter', data: { ...data, videoUrl } };
    }

    throw new Error('Platform tidak dikenali atau belum didukung!');
  } catch (error) {
    return { error: true, message: error.message };
  }
}

export default downloadMedia