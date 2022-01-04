const { task, series } = require('gulp'),
	fs = require('fs'),
	path = require('path'),
	args = require('yargs').argv,
	extract = require('extract-zip'),
	del = require('del'),
	copy = require('recursive-copy');

const config = {
	"theme_zip": "./ex-misc.webflow.zip",
	"theme_extract_dir": path.join(__dirname, 'ex-misc.webflow'),
	"publish_dir": args.target || 'dist',
	"copy_filter": [
		'css/*',
		'fonts/*',
		'js/*',
		'images/szt_*',
		'images/favicon*',
		'images/webclip*',
		'szt.html'
	]
};
task('extract zip', async function (done) {
	try {
		await extract(config.theme_zip, { dir: config.theme_extract_dir });
	} catch (err) {
		console.error(err);
		process.exit();
	}
	done();
});
task('create publish dir', function (done) {
	fs.mkdir(path.join(__dirname, config.publish_dir), { recursive: true }, (err) => err ? console.error(err) : '');
	done();
});
task('copy toml', function (done) {
	fs.copyFile("./netlify.toml", `./${config.publish_dir}/netlify.toml`, function (e) { });
	done();
});
task('copy web', function (done) {
	copy(config.theme_extract_dir, config.publish_dir, {
		overwrite: true,
		expand: true,
		dot: true,
		junk: true,
		filter: config.copy_filter
	})
		.then(function (results) {
			console.info('Copied ' + results.length + ' files');
			done();
		})
		.catch(function (error) {
			console.error('Copy failed: ' + error);
			process.exit();
		});
});
task('clean', () => {
	return del([config.theme_zip, config.theme_extract_dir]);
});

task('default', series('extract zip', 'create publish dir', 'copy web', 'copy toml', 'clean'));