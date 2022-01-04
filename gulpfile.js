const { task, series } = require('gulp'),
	fs = require('fs'),
	path = require('path'),
	args = require('yargs').argv,
	extract = require('extract-zip'),
	del = require('del'),
	copy = require('recursive-copy');

const config = {
	"theme_zip": "./ex-misc.webflow.zip",
	"theme_extract_dir": "_extract",
	"publish_dir": args.target || 'dist',
	"copy_filter": [
		'css/*',
		'fonts/*',
		'js/*',
		'images/szt_*',
		'images/favicon*',
		'images/webclip*',
		'szt.html'
	],
	"custom_dir": []//要複製的自訂資料夾：['custom', 'vendors']
};
async function copyFiles(src, target, filter = null) {
	return copy(src, path.join(__dirname, target), {
		overwrite: true,
		expand: true,
		dot: true,
		junk: true,
		filter: filter
	})
		.then(function (results) {
			console.info('Copied ' + results.length + ' files');
		})
		.catch(function (error) {
			console.error('Copy failed: ' + error);
			process.exit();
		});
}
task('extract zip', async function (done) {
	try {
		await extract(config.theme_zip, { dir: path.join(__dirname, config.theme_extract_dir) });
		done();
	} catch (err) {
		console.error(err);
		process.exit();
	}
});
task('create publish dir', function (done) {
	fs.mkdir(path.join(__dirname, config.publish_dir), { recursive: true }, (err) => err ? console.error(err) : '');
	done();
});
task('copy toml', function (done) {
	fs.copyFile("./netlify.toml", `./${config.publish_dir}/netlify.toml`, function (e) { });
	done();
});
task('copy custom dir', function (done) {
	config.custom_dir.forEach(async dir => {
		await copyFiles(path.join(__dirname, dir), `${config.publish_dir}/${dir}`);
	});
	done();
});
task('copy web', function (done) {
	copyFiles(config.theme_extract_dir, config.publish_dir, config.copy_filter).then(res => done());
});
task('clean', () => {
	return del([config.theme_extract_dir]);
});

task('default', series('extract zip', 'create publish dir', 'copy custom dir', 'copy web', 'copy toml', 'clean'));