const Mysql = require('mysql');
const uuid = require('uuid/v4');
const MysqlPool = require('../../../lib/mysql_pool');

class MediaMysql {
	constructor(connParam) {
		this._connParam = connParam;
	}

	async add(document) {
		const id = uuid().replace(/-/g, '');

		let sqlArr = ['??=?'];
		let dataArr = [this._connParam.table, 'id', id];
		for (let [name, value] of Object.entries(document)) {
			sqlArr.push('??=?');
			dataArr.push(name, value);
		}
		const sql = Mysql.format('INSERT INTO ?? SET ' + sqlArr.join(','), dataArr);
		const mysql = await MysqlPool.fetch(this._connParam);

		return await new Promise((resolve, reject) => {
			mysql.query(sql, (error, rows, fields) => {
				mysql.release();
				if (error) {
					reject(error);
					return;
				}
				resolve(id);
			});
		});
	}

	async update(id, document) {
		let sqlArr = [];
		let dataArr = [];
		for (let [name, value] of Object.entries(document)) {
			sqlArr.push('??=?');
			dataArr.push(name, value);
		}
		dataArr.push('id', id);

		const sql = Mysql.format(`UPDATE ${this._connParam.table} SET ${sqlArr.join(',')} WHERE ??=? LIMIT 1`, dataArr);
		dataArr.push('id', id);
		const mysql = await MysqlPool.fetch(this._connParam);
		return await new Promise((resolve, reject) => {
			mysql.query(sql, (error, rows, fields) => {
				mysql.release();
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}

	async delete(id) {
		const sql = Mysql.format('DELETE FROM ?? WHERE ??=?', [this._connParam.table, 'id', id]);
		const mysql = await MysqlPool.fetch(this._connParam);

		return await new Promise((resolve, reject) => {
			mysql.query(sql, (error, rows, fields) => {
				mysql.release();
				if (error) {
					reject(error);
					return;
				}
				resolve();
			});
		});
	}

	async count(partialSQL) {
		const sql = Mysql.format(`SELECT count(*) as num FROM ?? ${partialSQL}`, [this._connParam.table]);
		const mysql = await MysqlPool.fetch(this._connParam);

		return await new Promise((resolve, reject) => {
			mysql.query(sql, (error, rows, fields) => {
				mysql.release();
				if (error) {
					reject(error);
					return;
				}
				resolve(parseInt(rows[0].num));
			});
		});
	}

	async collect(partialSQL) {
		const sql = Mysql.format(`SELECT * FROM ??${partialSQL}`, [this._connParam.table]);
		const mysql = await MysqlPool.fetch(this._connParam);

		return await new Promise((resolve, reject) => {
			mysql.query(sql, (error, rows, fields) => {
				mysql.release();
				if (error) {
					reject(error);
					return;
				}
				let results = rows.map((row) => {
					let id = row.id;
					delete row.id;
					return {
						id,
						document: row
					};
				});
				resolve(results);
			});
		});
	}
}

module.exports = class {
	static create(connParam) {
		switch (connParam.media) {
			case 'mysql':
				return new MediaMysql(connParam);
				break;
			default:
				break;
		}
		throw new Error(`unknown media ${connParam.media}`);
	}
}