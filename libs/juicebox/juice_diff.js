// * ———————————————————————————————————————————————————————— * //
// * 	juice diff
// *
// * 	diff posibilities:
// * 		equal
// *		local_only
// * 		juice_only
// * 		local_newer
// * 		juice_newer
// *
// * ———————————————————————————————————————————————————————— * //
var juice_diff = function () {}

// vendor dependencies
var dircompare = require('dir-compare')

// local dependencies
var kiska_logger = require(ENDURO_FOLDER + '/libs/kiska_logger')

juice_diff.prototype.diff = function (path1, path2) {
	dircompare.compare(path1, path2)
		.then((res) => {
			kiska_logger.init('Juice diff')

			res.diffSet.forEach((item) => {
				abstract_diff_item(item)

				if (item.name == '.DS_Store') { return }
				if (item.type == 'directory') {
					kiska_logger.log(item.indentation + item.name)
				} else {
					kiska_logger.twolog(item.indentation + item.name, item.status)
				}
			})
			kiska_logger.end()
		})
}

// adds name and path
function abstract_diff_item (item) {
	item.filename = item.name1 || item.name2
	item.name = item.filename
	item.type = item.type1 || item.type2
	item.indentation = Array((item.level) * 4).join(' ')

	// juice_only
	if (item.type1 == 'missing') {
		return item.status = 'juice_only'
	}

	// local_only
	if (item.type2 == 'missing') {
		return item.status = 'local_only'
	}

	// local_newer
	if (item.date1 > item.date2) {
		return item.status = 'local_newer'
	}

	// juice_newer
	if (item.date1 < item.date2) {
		return item.status = 'juice_newer'
	}

	item.status = 'equal'
}

module.exports = new juice_diff()
