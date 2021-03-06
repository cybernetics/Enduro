var expect = require('chai').expect
var request = require('request')

var enduro = require(ENDURO_FOLDER + '/index')

describe('admin api', function () {

	var sid

	// create a new project
	before(function (done) {
		enduro.run(['create', 'testproject_admin_api', 'test'])
			.then(() => {
				// navigate inside new project
				global.CMD_FOLDER = CMD_FOLDER + '/testproject_admin_api'
				enduro.run(['start'], [])
					.then(() => {
						done()
					})
			}, () => {
				done(new Error('Failed to create new project'))
			})
	})

	it('should not get token if no session is provided', function (done) {
		request('http://localhost:5000/admin_api/check_session', function (error, response, body) {
			if (error) { console.log(error) }
			var res = JSON.parse(body)
			expect(res.success).to.be.not.ok
			done()
		})
	})

	it('should be able to login with password', function (done) {
		request.get({
			url: 'http://localhost:5000/admin_api/login_by_password',
			qs: {username: 'gottwik', password: '123'}
		}, function (error, response, body) {
			if (error) { console.log(error) }
			var res = JSON.parse(body)
			expect(res.success).to.be.ok
			expect(res).to.have.all.keys('success', 'username', 'sid', 'created', 'expires_at')
			sid = res.sid
			done()
		})
	})

	it('should be able to get cms list', function (done) {
		request.get({
			url: 'http://localhost:5000/admin_api/get_cms_list',
			qs: {sid: sid}
		}, function (error, response, body) {
			if (error) { console.log(error) }
			var res = JSON.parse(body)
			expect(res.data).to.contain.all.keys('structured', 'flat')
			done()
		})
	})

	it('should be able to get admin_extension list', function (done) {
		request.get({
			url: 'http://localhost:5000/admin_api/get_admin_extensions',
			qs: {sid: sid}
		}, function (error, response, body) {
			if (error) { console.log(error) }
			var res = JSON.parse(body)
			expect(res.success).to.be.ok
			expect(res.data).to.not.be.empty
			expect(res.data[0]).to.have.string('sample_extension')
			done()
		})
	})

	// navigate back to testfolder
	after(function (done) {
		enduro.server_stop(() => {
			global.CMD_FOLDER = process.cwd() + '/testfolder'
			done()
		})
	})

})
