const Ajv = require('ajv');
const config = require('../../../config');
const ajv = new Ajv({
	useDefaults: true
});
require('ajv-keywords')(ajv, 'switch');

const cache = new Map();

module.exports = class {
	static load(module) {
		if (!cache.has(module)) {
			cache.set(module, new this(module, `${config.srcPath}/${module.replace(/\./g, '/')}/schema`));
		}
		return cache.get(module);
	}

	constructor(module, schemaFile) {
		this._schema = require(schemaFile);
		this._validate = ajv.compile(this._schema);
	}

	validate(document) {
		if (!this._validate(document)) {
			throw new Error(`failed to validate document(${JSON.stringify(document)}) against schema(${JSON.stringify(this._schema.document)})\n${ajv.errorsText(this._validate.errors)}`);
		}
	}

	get properties() {
		return this._schema.properties;
	}
}
