module.exports = {
	format: function(string/*, args...*/){
		var data = [].slice.call(arguments, 1);
		return string.replace(/\{(\d)\}/g, function(s, m1){
			return data[parseInt(m1, 10)];
		});
	}
	, isFileId: function(el){
		/* jshint eqeqeq: false */
		return (/[a-z0-9\-_]{55}/i).test(el);
	}
};
