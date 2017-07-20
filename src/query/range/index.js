const assert = require('assert');

module.exports = class Sort {
	constructor({offset = 0, number}) {
		assert(Number.isInteger(offset), 'offset should be an integer');
		assert(Number.isInteger(number), 'number should be an integer');
		this._offset = offset;
		this._number = number;
	}

	get valid() {
		return (Number.isInteger(this._offset) && Number.isInteger(this._number));
	}

	toSQL() {
		if (!this.valid) {
			throw new Error(`Range was not setup properly`);
		}
		return `LIMIT ${this._offset}, ${this._number}`;
	}
}