const mysql = require('mysql');
const assert = require('assert');

module.exports = class Sort {
	static get Order() {
		return {
			ASC: 'asc',
			DESC: 'desc'
		};
	}

	constructor() {
		this._items = [];
	}

	get valid() {
		return this._items.length > 0;
	}

	add({field, order}) {
		assert(typeof field === "string", "field must be a string");
		assert(Object.values(Sort.Order).includes(order), `order must be one of ${Object.values(Sort.Order)}`);
		this._items.push({field, order});
	}

	toSQL() {
		if (!this.valid) {
			throw new Error(`Sort was not setup properly`);
		}
		const partialSql = this._items.map(item => `?? ${item.order}`).join(',');
		return mysql.format(partialSql, this._items.map(item => item.field));
	}
}
