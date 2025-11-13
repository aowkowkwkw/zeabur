import fs from 'fs/promises'
import path from 'path'
import natural from 'natural'

const CLASSIFIER_DIR = path.resolve('./database') // pastikan folder ini benar, bukan 'databse'
const CLASSIFIER_FILE = path.join(CLASSIFIER_DIR, 'classifier.json')

/**
 * Latih classifier dari data respon
 * @param {Object} respon Format: { label1: [sentence1, sentence2], label2: [...] }
 * @returns {natural.BayesClassifier}
 */
export function trainClassifierFromRespon(respon = {}) {
  const classifier = new natural.BayesClassifier()
  // Debug cek tipe respon
  if (typeof respon !== 'object' || Array.isArray(respon)) {
    console.warn('⚠️ Parameter respon bukan object yang valid, gunakan object kosong saja')
    return classifier
  }
  for (const label in respon) {
    const sentences = respon[label]
    if (!Array.isArray(sentences)) continue
    for (const sentence of sentences) {
      if (typeof sentence === 'string' && sentence.trim()) {
        classifier.addDocument(sentence.toLowerCase(), label.toLowerCase())
      }
    }
  }
  classifier.train()
  return classifier
}

/**
 * Simpan classifier ke file JSON
 * @param {natural.BayesClassifier} classifier
 */
export async function saveClassifierToFile(classifier) {
  try {
classifier.save('database/classifier.json', function(err, classifierSaved) {
if (err) console.error(err);
else console.log('Classifier berhasil disimpan!');
});
    // if (typeof classifier.toJson !== 'function') {
    //   console.error('❌ classifier.toJson bukan fungsi. Pastikan ini instance BayesClassifier')
    //  // console.log('Objek classifier:', classifier)
    //   return
    // }
    // const jsonStr = JSON.stringify(classifier.toJson())
    // await fs.mkdir(CLASSIFIER_DIR, { recursive: true })
    // await fs.writeFile(CLASSIFIER_FILE, jsonStr, 'utf-8')
    // console.log('✅ Classifier berhasil disimpan di', CLASSIFIER_FILE)
  } catch (err) {
    console.error('❌ Gagal menyimpan classifier:', err)
  }
}

/**
 * Load classifier dari file JSON
 * @returns {Promise<natural.BayesClassifier|null>}
 */
export async function loadClassifierFromFile() {
  try {
    const data = await fs.readFile(CLASSIFIER_FILE, 'utf-8')
    const parsed = JSON.parse(data)
    return natural.BayesClassifier.restore(parsed)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn('⚠️ File classifier.json belum ditemukan, perlu training ulang')
    } else {
      console.warn('⚠️ Gagal load classifier dari file:', err)
    }
  }
  return null
}

/**
 * Pastikan global.classifier tersedia, load dari file atau training baru
 */
export async function ensureClassifier() {
  global.classifier = await loadClassifierFromFile()
  if (!global.classifier) {
const dataRespon = global.db?.data?.respon || {}
if (!Object.keys(dataRespon).length) console.warn('⚠️ Tidak ada data respon ditemukan untuk training.')
    console.log('⚠️ Classifier tidak ditemukan, melakukan training ulang...')
    global.classifier = trainClassifierFromRespon(global.db?.data?.respon || {})
    //console.log('Tipe global.classifier:', typeof global.classifier, global.classifier instanceof natural.BayesClassifier)
    await saveClassifierToFile(global.classifier)

 
  }
}