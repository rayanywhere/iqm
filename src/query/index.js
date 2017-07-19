const Clause = require('./clause');
const BooleanClause = require('./clause/boolean');
const TermClause = require('./clause/term');
const Range = require('./range');
const Sort = require('./sort');
const assert = require('assert');

module.exports = class {
	static get BooleanClause() { return BooleanClause; }
	static get TermClause() { return TermClause; }
	static get Sort() { return Sort; }
	static get Range() { return Range; }

	constructor({clause, sort, range}) {
		if (clause !== undefined) {
			assert(clause instanceof Clause, 'clause must be an instance of Clause class');
			this._clause = clause;
		}
		if (sort !== undefined) {
			assert(sort instanceof Sort, 'sort must be an instance of Sort class');
			this._sort = sort;
		}
		if (range !== undefined) {
			assert(range instanceof Range, 'range must be an instance of Range class');
			this._range = range;
		}
	}

	toSQL() {
		let partialSQL = '';
		if ((this._clause !== undefined) && this._clause.valid) {
			partialSQL += ` WHERE ${this._clause.toSQL()}`;
		}
		if ((this._sort !== undefined) && this._sort.valid) {
			partialSQL += ` ORDER BY ${this._sort.toSQL()}`;
		}
		if ((this._range !== undefined) && this._range.valid) {
			partialSQL += ` ${this._range.toSQL()}`;
		}
		return partialSQL;
	}
}