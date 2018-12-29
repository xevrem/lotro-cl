/*eslint-env node*/
const gulp = require('gulp');
// const sass = require('gulp-sass');
// const autoprefixer = require('gulp-autoprefixer');
const run = require('gulp-run');
const del = require('del');

gulp.task('default', ()=>{
  return console.log('nothing to do');
});

gulp.task('clean', () => {
  return del(['dist','.cache']);
});

gulp.task('full-clean',['clean'], ()=>{
  return del(['node_modules']);
});

gulp.task('dev', ()=>{
  return run('parcel serve src/index.html -p 3000').exec();
});

gulp.task('parcel', ['styles'], () => {
  return run('parcel build src/index.js --out-dir ./dist').exec();
});
