module.exports = {
	type: "object",
	properties: {
		name: {
			type: "string",
			default: "ray"
		},
		age: {
			type: "integer",
			default: 18
		}
	},
	additionalProperties: false,
	required: ["name", "age"]
};