// * ———————————————————————————————————————————————————————— * //
// * 	Handles adding new page
// * ———————————————————————————————————————————————————————— * //
var page_adding_service = function () {}

// vendor dependencies
var path = require('path')

// local dependencies
var flat_file_handler = require(ENDURO_FOLDER + '/libs/flat_utilities/flat_file_handler')
var pagelist_generator = require(ENDURO_FOLDER + '/libs/build_tools/pagelist_generator')

page_adding_service.prototype.new_generator_page = function (new_pagename, generator) {
	return flat_file_handler.load(path.join('generators', generator, generator))
		.then((template_content) => {
			return flat_file_handler.save(path.join('generators', generator, new_pagename), template_content)
		})
		.then(() => {
			return pagelist_generator.generate_cms_list()
		})
		.then((cmslist) => {
			return pagelist_generator.save_cms_list(cmslist)
		})
}

module.exports = new page_adding_service()
