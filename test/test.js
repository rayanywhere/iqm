const assert = require('assert');
const Iqm = require('../index.js');
Iqm.config({
	srcPath: `${__dirname}/../examples`
});
const IndexUser = Iqm.Index('user');
const Query = Iqm.Query;
const TermClause = Query.TermClause;
const BooleanClause = Query.BooleanClause;

describe("index", function() {
	it("add - should return without error", async function() {
		global.documentId = await IndexUser.add({
			name:"ray",
			age: 18
		});
	});

	it("update - should return without error", async function() {
		assert(documentId !== undefined, "need a documentId first");
		
		await IndexUser.update(documentId, {
			name:"mandy",
			age: 17
		});
	});

	it("count - should return without error", async function() {
		const clause = new BooleanClause(BooleanClause.Logic.OR);
		clause.add(new TermClause({
			field:"name", 
			comparator: TermClause.Comparator.EQ,
			value: "mandy"
		}));
		clause.add(new TermClause({
			field:"age",
			comparator: TermClause.Comparator.GT,
			value: 29
		}));

		const query = new Query({
			clause: clause
		});
		const number = await IndexUser.count(query);
		assert(number >= 1, 'number should be >= 1');
	});

	it("collect - should return without error", async function() {
		const clause = new BooleanClause(BooleanClause.Logic.OR);
		clause.add(new TermClause({
			field:"name", 
			comparator: TermClause.Comparator.EQ,
			value: "mandy"
		}));
		clause.add(new TermClause({
			field:"age",
			comparator: TermClause.Comparator.GT,
			value: 29
		}));

		const query = new Query({
			clause: clause
		});
		const documents = await IndexUser.collect(query);
		assert(documents.length >= 1, 'number should be >= 1');
	});

	it("delete - should return without error", async function() {
		assert(documentId !== undefined, "need a documentId first");
		await IndexUser.delete(documentId);
	});
});