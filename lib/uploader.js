import axios from "axios";
import fs from "fs-extra";
import FormData from "form-data";
import { fileTypeFromBuffer } from "file-type";
import { load } from "cheerio";
import { fileURLToPath } from "url";
 
const __filename = fileURLToPath(import.meta.url);
 


export async function AnonFiles(path) {
  const form = new FormData();
  form.append("file", fs.createReadStream(path));
  const res = await fetch("https://anonfiles.com/upload", { method: "POST", body: form });
  return await res.json();
}

export async function FileIo(path) {
  const form = new FormData();
  form.append("file", fs.createReadStream(path));
  const res = await fetch("https://file.io", { method: "POST", body: form });
  return await res.json();
}

export async function FileUgu(path) {
  const form = new FormData();
  form.append("files[]", fs.createReadStream(path));
  const res = await fetch("https://uguu.se/upload.php", { method: "POST", body: form });
  return await res.json();
}

export async function FileUgu2(buffer) {
  const form = new FormData();
  form.append("files[]", buffer, "upload.jpg");
  const res = await fetch("https://uguu.se/upload.php", { method: "POST", body: form });
  const json = await res.json();
  return json.files?.[0]?.url;
}

export async function FileDitch(path) {
  const form = new FormData();
  form.append("files[]", fs.createReadStream(path));
  const res = await fetch("https://up1.fileditch.com/upload.php", { method: "POST", body: form });
  return await res.json();
}

export async function PomF2(path) {
  const form = new FormData();
  form.append("files[]", fs.createReadStream(path));
  const res = await fetch("https://pomf2.lain.la/upload.php", { method: "POST", body: form });
  return await res.json();
}

export async function Top4top(buffer) {
  const { ext } = await fileTypeFromBuffer(buffer) || {};
  const form = new FormData();
  form.append("file_1_", buffer, { filename: `${Date.now()}.${ext}` });
  form.append("submitr", "[ رفع الملفات ]");

  try {
    const { data } = await axios.post("https://top4top.io/index.php", form, {
      headers: {
        ...form.getHeaders(),
        "User-Agent": "Mozilla/5.0 (BlackBerry; U; BlackBerry 9900; en) AppleWebKit/534.11+ (KHTML, like Gecko) Version/7.0.0.585 Mobile Safari/534.11+"
      }
    });

    const $ = load(data);
    const result = $('div.alert.alert-warning > ul > li > span a').attr("href");

    if (!result) {
      return { status: "error", msg: "Maybe file not allowed or try another file" };
    }

    return { status: "success", result };
  } catch (err) {
    console.error("[TOP4TOP ERROR]", err);
    return { status: "error", msg: "An error occurred during the upload process." };
  }
}

export async function tmpFile(buffer) {
  const { ext, mime } = await fileTypeFromBuffer(buffer);
  const form = new FormData();
  form.append("file", buffer, { filename: `${Date.now()}.${ext}`, contentType: mime });

  try {
    const { data } = await axios.post("https://tmpfiles.org/api/v1/upload", form, {
      headers: form.getHeaders(),
    });
    const url = new URL(data.data.url);
    return `https://tmpfiles.org/dl${url.pathname}`;
  } catch (err) {
    return err?.response || null;
  }
}

export async function catbox(buffer) {
  try {
    const { ext } = await fileTypeFromBuffer(buffer);
    const form = new FormData();
    form.append("fileToUpload", buffer, `file.${ext}`);
    form.append("reqtype", "fileupload");

    const res = await fetch("https://catbox.moe/user/api.php", {
      method: "POST",
      body: form
    });

    return await res.text();
  } catch (err) {
    console.error("[CATBOX ERROR]", err);
    return null;
  }
}

 