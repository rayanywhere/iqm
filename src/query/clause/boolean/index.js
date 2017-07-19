const Clause = require('../');
const mysql = require('mysql');
const assert = require('assert');

const Logic = {
	AND: 'AND',
	OR: 'OR'
};

module.exports = class BooleanClause extends Clause {
	static get Logic () {
		return Logic;
	}

	constructor(logic) {
		super();
		assert(Object.values(Logic).includes(logic), `logic must be one of ${JSON.stringify(Object.values(Logic))}`);
		this._clauses = [];
		this._logic = logic;
	}

	add(clause) {
		assert(clause instanceof Clause, "clause should be an instance of Clause");
		this._clauses.push(clause);
	}

	get valid() {
		return ((this._logic !== undefined) && (this._clauses instanceof Array) && (this._clauses.length > 0));
	}

	toSQL() {
		if (!this.valid) {
			throw new Error(`BooleanClause was not setup properly`);
		}
		return '(' + this._clauses.map(clause => `${clause.toSQL()}`).join(this._logic) + ')';
	}
}