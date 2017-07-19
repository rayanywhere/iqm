const fs = require('fs');
const Schema = require('./schema');
const Router = require('./router');
const Media = require('./media');

class IndexStorage {
	constructor(schema, router) {
		this._schema = schema;
		this._media = Media.create(router.connParam);
	}

	async add(document) {
		this._schema.validate(document);
		return await this._media.add(document);
	}

	async update(id, document) {
		this._schema.validate(document);
		await this._media.update(id, document);
	}

	async delete(id) {
		await this._media.delete(id);
	}

	async count(query) {
		return await this._media.count(query.toSQL());
	}

	async collect(query) {
		return await this._media.collect(query.toSQL());
	}
}

module.exports = (module) => {
	return new IndexStorage(Schema.load(module), Router.load(module));
}
