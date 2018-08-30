module.exports = {
	isFileId: function (el) {
		return (/[a-z0-9\-_]{55}/i).test(el);
	}
};
