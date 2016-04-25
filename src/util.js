module.exports = {
	isFileId: function(el){
		/* jshint eqeqeq: false */
		return (/[a-z0-9\-_]{55}/i).test(el);
	}
};
