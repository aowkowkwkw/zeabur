import { createRequire } from "module";
const require = createRequire(import.meta.url);

let moment;

try {
  moment = require('moment')
} catch {
  // Fallback ke versi custom
  const convertToTimeZone = (date, timeZone) => {
    return new Date(
      date.toLocaleString('en-US', { timeZone })
    );
  };

  class Moment {
    constructor(date = new Date(), tz) {
      this._tz = tz || moment.tz._default || 'UTC';
      this._date = convertToTimeZone(new Date(date), this._tz);
      this._locale = moment._locale || 'en';
    }

    tz(timeZone) {
      this._tz = timeZone;
      this._date = convertToTimeZone(this._date, timeZone);
      return this;
    }

    locale(locale) {
      this._locale = locale;
      moment._locale = locale;
      return this;
    }

    format(fmt = 'YYYY-MM-DD HH:mm:ss') {
      return formatDate(this._date, fmt);
    }

    add(amount, unit = 'days') {
      switch (unit) {
        case 'days': this._date.setDate(this._date.getDate() + amount); break;
        case 'hours': this._date.setHours(this._date.getHours() + amount); break;
        case 'minutes': this._date.setMinutes(this._date.getMinutes() + amount); break;
        case 'seconds': this._date.setSeconds(this._date.getSeconds() + amount); break;
      }
      return this;
    }

    subtract(amount, unit = 'days') {
      return this.add(-amount, unit);
    }

    toDate() {
      return this._date;
    }

    timezone() {
      return this._tz;
    }
  }

  function formatDate(date, fmt) {
    return fmt
      .replace('DD', String(date.getDate()).padStart(2, '0'))
      .replace('MM', String(date.getMonth() + 1).padStart(2, '0'))
      .replace('YYYY', date.getFullYear())
      .replace('HH', String(date.getHours()).padStart(2, '0'))
      .replace('mm', String(date.getMinutes()).padStart(2, '0'))
      .replace('ss', String(date.getSeconds()).padStart(2, '0'));
  }

  moment = function (date) {
    return new Moment(date);
  };

  moment.tz = Object.assign((tzName) => {
    return moment().tz(tzName);
  }, {
    _default: 'UTC',
    setDefault(tz) {
      this._default = tz;
      return this;
    }
  });

  moment._locale = 'en';
  moment.locale = function (loc) {
    this._locale = loc;
    return this;
  };
}

export default moment;
