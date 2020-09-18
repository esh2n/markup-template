// https://qiita.com/ararie/items/e4d70fadafe0f5a8f28b

const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const uglify = require('gulp-uglify');
const browsersync = require('browser-sync');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const del = require('del');

const paths = {
  src: 'src',
  dest: 'dist',
};

//Pug
gulp.task('html', function () {
  return gulp
    .src([paths.src + '/pug/**/*.pug', '!' + paths.src + '/pug/**/_*.pug'])
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.dest));
});

//Sass
gulp.task('css', function () {
  return gulp
    .src([paths.src + '/sass/**/*.scss', '!' + paths.src + '/sass/**/_*.scss'])
    .pipe(
      plumber({
        errorHandler: notify.onError('Error: <%= error.message %>'),
      })
    )
    .pipe(
      sass({
        outputStyle: 'expanded',
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: 'last 2 versions',
      })
    )
    .pipe(cssmin())
    .pipe(gulp.dest(paths.dest + '/assets/css'));
});

//JavaScript
gulp.task('js', function () {
  return gulp
    .src(paths.src + '/js/**/*')
    .pipe(uglify())
    .pipe(gulp.dest(paths.dest + '/assets/js'));
});

//Image File
gulp.task('image', function () {
  return gulp
    .src(paths.src + '/images/**/*')
    .pipe(gulp.dest(paths.dest + '/assets/images'));
});

//Browser Sync
gulp.task('browser-sync', function (done) {
  browsersync({
    server: {
      //ローカルサーバー起動
      baseDir: paths.dest,
    },
  });
  done();
});

//Watch
gulp.task('watch', function () {
  const reload = () => {
    browsersync.reload(); //リロード
  };
  gulp.watch(paths.src + '/sass/**/*').on('change', gulp.series('css', reload));
  gulp.watch(paths.src + '/pug/**/*').on('change', gulp.series('html', reload));
  gulp.watch(paths.src + '/js/**/*').on('change', gulp.series('js', reload));
  gulp
    .watch(paths.src + '/images/**/*')
    .on('change', gulp.series('image', reload));
});

//Clean
gulp.task('clean', function (done) {
  del.sync(paths.dest + '/**', '！' + paths.dest);
  done();
});

//Default
gulp.task(
  'default',
  gulp.series(
    'clean',
    gulp.parallel('html', 'css', 'js', 'image', 'watch', 'browser-sync')
  )
);
