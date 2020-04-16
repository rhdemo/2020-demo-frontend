const { v4: uuidv4 } = require('uuid');
const log = require('../utils/log')('models/model');

class Model {

  constructor() {
  }

  get type() {
    return 'Model';
  }

  get key() {
    return this.id;
  }

  get attributes() {
    return ['id'];
  }

  get jsonAttributes() {
    return this.attributes;
  }

  beforeSave() {

  }

  async save() {
    this.beforeSave();
    if (!this.id) {
      this.id = uuidv4();
    }

    const startTime = new Date();
    let result;
    try {
      result = await this.dataClient.put(this.key, this.toJSON());
    } catch (error) {
      log.error(`Error saving ${this.type}`);
    }

    const endTime = new Date();
    const timeDiff = endTime - startTime;

    if (timeDiff > 200) {
      log.warn(` ${this.type} save took ${timeDiff} ms`);
    }

    return result;
  }

  async delete() {
    return this.dataClient.remove(this.key);
  }

  updateAttributes(dict) {
    for (const [key, value] of Object.entries(dict)) {
      this[key] = value;
    }
    return this;
  }

  toDict() {
    let dict = {};
    if (this.attributes) {
      this.attributes.forEach(a => {
        dict[a] = this[a];
      });
    }

    return dict;
  }

  toJSON() {
    return JSON.stringify(this.toDict());
  }

  get related() {
    return {};
  }

  serialize() {
    return JSON.stringify({...this.toDict(), ...this.related});
  }

  static fromJSON(json) {
    let obj = new this();
    let dict = JSON.parse(json);
    for (const [key, value] of Object.entries(dict)) {
      obj[key] = value;
    }
    return obj;
  }

  static async find(key) {
    try {
      const startTime = new Date();

      let json = await this.dataClient.get(key);

      const endTime = new Date();
      const timeDiff = endTime - startTime;

      if (timeDiff > 200) {
        log.warn(`Find ${key} took ${timeDiff} ms`);
      }

      return json ? this.fromJSON(json) : null;
    } catch {
      log.error(`Error finding ${this.type} ${key}`);
    }
  }

  static async deleteAll() {
    return this.dataClient.clear();
  }
}

module.exports = Model;
