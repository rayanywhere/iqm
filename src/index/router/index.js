const Ajv = require('ajv');
const ajv = new Ajv();
require('ajv-keywords')(ajv, 'switch');
const config = require('../../../config');

const cache = new Map();

module.exports = class {
	static load(module) {
		if (!cache.has(module)) {
			cache.set(module, new this(module, `${config.srcPath}/${module.replace(/\./g, '/')}/router`));
		}
		return cache.get(module);
	}

	constructor(module, routerFile) {
		this._connParam = Object.assign({}, require(routerFile));
		if (!ajv.validate({
			type: "object",
			properties: {
				media: {enum:["mysql"]},
				host: {type: "string"},
				port: {type: "integer"},
				user: {type: "string"},
				password: {type: "string"},
				database: {type: "string"}
			},
			additionalProperties: false,
			required: ["media", "host", "port", "user", "password", "database"]
		}, this._connParam)) {
			throw new Error(`bad router file ${routerFile}`);
		}
		this._connParam.table = `i_${module.replace(/\./g, '_')}`;
	}

	get connParam() {
		return this._connParam;
	}
}
