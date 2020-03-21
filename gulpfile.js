const { series, parallel, dest, src, watch } = require('gulp');
const browserSync      = require('browser-sync').create(); // Livereload page
const sass             = require('gulp-sass'); // Sass features
const babel            = require('gulp-babel'); // Polyfill JS features
const autoprefixer     = require('gulp-autoprefixer'); // Add vendor prefixes
const cleanCSS         = require('gulp-clean-css'); // Minify CSS
const uglify           = require('gulp-uglify-es').default; // MInify JS
const concat           = require('gulp-concat'); //Concatinate
const plumber          = require('gulp-plumber'); // Prevent task errors
const postCSS          = require('gulp-postcss'); // PostCSS features
const postcssPresetEnv = require('postcss-preset-env'); // 'Babel for CSS'
const postcssShort     = require('postcss-short'); // Shortcut CSS rules
const rsync            = require('gulp-rsync'); // Deploy site to hosting

const reload = browserSync.reload;
const messages = {
	jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build',
};



const paths = {
		styles: {
			src: 'assets/_scss/*.scss',
			dist: 'assets/css'
		},
		scripts: {
			src: [
			'assets/vendor/jquery-3.3.1/dist/jquery.min.js',
			'assets/vendor/fontawesome-free-5.8.1-web/js/all.js',
			'assets/vendor/likely-2.4/likely.js',
			'assets/vendor/prognroll/prognroll.js',
			'assets/vendor/lazyload/lazyload.min.js',
			'assets/vendor/disqusloader/jquery.disqusloader.js',
			'assets/main.js'],
			watch: 'assets/js/main.js',
			dist: 'assets/js'
		},
		site: {
			css: '_site/vendor/css',
			js: '_site/vendor/js',
			code: '_site/**/*.html'
		},
		code: [
			'*.html',
			'_layouts/*.html',
			'_includes/*.html',
			'_posts/*',
			'_site/blog/*'
		]
};

function browsersync(cb) {
	browserSync.init({
		server: {
			baseDir: '_site/'
		},
		open: false,
		notify: false,
		// online: false, // Work offline without internet connection
		// tunnel: true, tunnel: 'projectname', // Demonstration page: http://projectname.localtunnel.me
	});
	cb();
}

function css(cb) {
	return src(paths.styles.src)
	.pipe(plumber())
	.pipe(sass({
		outputStyle: 'expand' })
		.on('error', sass.logError))
	.pipe(postCSS([
		postcssPresetEnv({ stage: 2 }),
		postcssShort({ skip: 'x' }),
	]))
	.pipe(autoprefixer({
		grid: 'autoplace',
		overrideBrowserslist: ['last 10 versions']
	}))
	.pipe(concat('styles.min.css'))
	.pipe(cleanCSS( {level: { 2: { specialComments: 0 } } }))
	.pipe(dest(paths.styles.dist))
	.pipe(dest(paths.site.css))
	.pipe(reload({ stream: true }));
	cb();
}

function js(cb) {
	return src(paths.scripts.src)
	.pipe(plumber())
	.pipe(concat('scripts.min.js'))
	.pipe(babel({ "presets": ["@babel/preset-env"]}))
	.pipe(uglify())
	.pipe(dest(paths.scripts.dist))
	.pipe(dest(paths.site.js))
	.pipe(reload({ stream: true }));
	cb();
}

function code(cb) {
	return src('*.html')
	.pipe(reload({ stream: true }));
	cb();
}

function watcher(cb) {
	watch(paths.styles.src, parallel('css'))
	watch(paths.scripts.watch, parallel('js'))
	watch(paths.code, parallel('code'))
	cb();
}

function deploy(cb) {
	return src('_site/**')
	.pipe(rsync({
		root: '_site/',
		hostname: 'x93708sy_codehax@codehax.ru',
		destination: '',
		include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
	cb();
}

exports.css = css;
exports.js = js;
exports.code = code;
exports.deploy = deploy;

exports.default = parallel( css, js, browsersync, watcher );
