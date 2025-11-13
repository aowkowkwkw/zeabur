import mongoose from 'mongoose';
import chalk from './chalk.js';

const { Schema, connect, model: _model } = mongoose;

export class mongoDB {
  constructor(url, dbName = 'mydatabase') {
   // console.log(chalk.green(`Connecting to MongoDB...`));
    this.url = url;
    this.dbName = dbName;
    this.data = this._data = {};
    this._schema = {};
    this._model = {};
    this.db = connect(this.url, { dbName: this.dbName })
      .then(() => {
        console.log(chalk.green(`✅ MongoDB is Connected`));
      })
      .catch(console.error);
  }

  async read() {
  //  console.log(chalk.yellow(`✅ Reading data from MongoDB...`)); // Pesan tambahan saat membaca
    this.conn = await this.db;
    let schema = this._schema = new Schema({
      data: {
        type: Object,
        required: true,
        default: {}
      }
    });
    try {
      this._model = _model('data', schema);
    } catch {
      this._model = _model('data');
    }
    this._data = await this._model.findOne({});
    if (!this._data) {
      this.data = {};
      const [_, _data] = await Promise.all([
        this.write(this.data),
        this._model.findOne({})
      ]);
      this._data = _data;
    } else this.data = this._data.data;
    console.log(chalk.yellow(`✅ Data read from MongoDB success`)); // Pesan tambahan setelah membaca
    return this.data;
  }

  write(data) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!data) return reject(new Error('Data is required'));

        if (!this._data) {
          const newData = new this._model({ data });
          const savedData = await newData.save();
          resolve(savedData);
        } else {
          const existingData = await this._model.findById(this._data._id);

          if (!existingData) {
            reject(new Error('Data not found'));
            return;
          }

          existingData.data = data;
          const savedData = await existingData.save();
          resolve(savedData);
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }
}








//
//
//




 
