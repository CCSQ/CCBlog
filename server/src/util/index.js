var md5 = require('./md5')

var Util = {}


Util.string2md5 = function (stringTemp) {
	return md5.hex_md5(stringTemp)
}


module.exports = Util
