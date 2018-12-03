/*
 * @Author: 胡新玉 
 * @Date: 2018-12-03 08:55:34 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-12-03 09:56:03
 */

var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var mincss = require('gulp-clean-css');
var server = require('gulp-webserver');
var babel = require('gulp-babel');

var url = require('url');
var path = require('path');
var fs = require('fs');

//编译sass
gulp.task('devscss', function() {
    return gulp.src('./src/scss/index.scss')
        .pipe(sass())
        .pipe(mincss())
        .pipe(gulp.dest('./src/css'))
})

//监听
gulp.task('watch', function() {
    return gulp.watch('./src/scss/index.scss', gulp.series('devscss'))
})

//起服务
gulp.task('devserver', function() {
    return gulp.src('build')
        .pipe(server({
            port: 9090,
            open: true,
            middleware: function(req, res, next) {
                var pathname = url.parse(req.url).pathname;
                console.log(pathname)
                if (pathname === '/favicon.ico') {
                    res.end('')
                    return
                }
                pathname = pathname === '/' ? 'index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, 'build', pathname)))
            }
        }))
})

//开发环境
gulp.task('default', gulp.series('devscss', 'devserver', 'watch'))


//线上
// 压缩js
gulp.task('buglify', function() {
    return gulp.src('./src/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./build/js'))
})

//copy js
gulp.task('bcopy', function() {
    return gulp.src('./src/js/libs/*.js')
        .pipe(gulp.dest('./build/js/libs'))
})

//css
gulp.task('bcss', function() {
    return gulp.src('./src/css/*.css')
        .pipe(gulp.dest('./build/css'))
})

//html
gulp.task('bhtml', function() {
    return gulp.src('./src/*.html')
        .pipe(gulp.dest('./build'))
})

//线上环境
gulp.task('build', gulp.parallel('bcss', 'buglify', 'bcopy', 'bhtml'))