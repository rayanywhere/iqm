module.exports = class {
	get valid() {
		return false;
	}

	toSQL() {
		throw new Error('this method is supposed to be implemented in child class');
	}
}