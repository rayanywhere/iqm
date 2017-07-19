module.exports = {
	Index: require('./src/index'),
	Query: require('./src/query'),
	config: (opts) => {
		let existingOpts = require('./config');
		Object.assign(existingOpts, opts);
	}
};