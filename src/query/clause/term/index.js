const Clause = require('../');
const assert = require('assert');
const mysql = require('mysql');

const Comparator = {
	EQ: '=',
	NE: '!=',
	GT: '>',
	GE: '>=',
	LT: '<',
	LE: '<=',
	LIKE: 'like'
};

module.exports = class TermClause extends Clause {
	static get Comparator() {
		return Comparator;
	}

	constructor({field, comparator, value}) {
		super();
		assert(typeof field === 'string', 'field must be a string');
		assert(Object.values(Comparator).includes(comparator), `comparator must be one of ${JSON.stringify(Object.values(Comparator))}`);
		assert(value !== undefined, 'value must be provided');
		this._field = field;
		this._comparator = comparator;
		this._value = value;
	}

	get valid() {
		return ((this._field !== undefined) && (this._comparator !== undefined) && (this._value !== undefined));
	}

	toSQL() {
		if (!this.valid) {
			throw new Error(`TermClause was not setup properly`);
		}
		return mysql.format(`(??${this._comparator}?)`, [this._field, this._value]);
	}
}
