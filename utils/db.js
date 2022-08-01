const {readFile, writeFile} = require('fs').promises;
const {join} = require('path');
const {v4: uuid} = require('uuid');
const {ClientRecord} = require('../records/cient-record');

class Db {
    constructor (dbFileName) {
        this.dbFileName = join(__dirname, '../data', dbFileName);
        this._load();

    }

    async _load() {
        this._data =JSON.parse(await readFile(this.dbFileName, 'utf-8')).map(obj => new ClientRecord(obj));
    }

    _safe(){
        writeFile(this.dbFileName, JSON.stringify(this._data), 'utf8');
    }

    create(obj) {
        const id = uuid();

        this._data.push(new ClientRecord({
            id,
            ...obj,
        }));
        this._safe(); //debounce

        return id;
    }

    getAll() {
        return this._data.map(obj => new ClientRecord(obj));
    }

    getOne(id) {
        return new ClientRecord(this._data.find(newObj => newObj.id === id));
    }

    update(id, newObj) {
        this._data = this._data.map(oneObj => {
            if(oneObj.id === id) {
                return {
                    ...oneObj,
                    ...newObj,
                };
            }else{
                return oneObj;
            }
        });
        this._safe();
    }

    delete(id) {
        this._data = this._data.filter(oneObj => oneObj.id !== id);
        this._safe();
    }
}

const db = new Db('client.json');


module.exports ={
    db,
}
