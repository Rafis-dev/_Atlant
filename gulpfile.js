//Методы, используемые в сборке: "src" - поиск файла; "dest" - путь размещения конечного/обработанного файла; "watch" - слежение за изменениями в файлах; "parallel" - одновременная работа нескольких фунций;
const { src, dest, watch, parallel, series } = require('gulp');

///// ПЛАГИНЫ /////
//Для конвертации препроцессора SASS
const sass = require('gulp-sass')(require('sass'));
// Для конкатинации (соединения) файлов
const concat = require('gulp-concat');
// Для автоматического обновления браузера
const browserSync = require('browser-sync').create();
// Для минификации js файлов
const uglify = require('gulp-uglify-es').default;
// Для подстановки вендорных префиксов
const autoprefixer = require('gulp-autoprefixer');
// Для сжатия картинок
const imagemin = require('gulp-imagemin');
// Чтобы не сжимать уже ранее сжатые изображения
const newer = require('gulp-newer');
// Для конвертации изображений в формат webp
const webp = require('gulp-webp');
// Для автоматичского оборачивания изображений в тег picture
const webphtml = require('gulp-webp-html');
// Для автоматичского оборачивания изображений в тег picture
const webpcss = require('gulp-webp-css-fixed');
// Для очистки папок
const del = require('del');
// Для работы с html-шаблонами
const fileinclude = require('gulp-file-include');
// Для конвертации шрифтов
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');
// Для группировки media запросов в определенном порядке
const groupcss = require('gulp-group-css-media-queries');
// Для сжати css файлов
const cleancss = require('gulp-clean-css');
// Для переименования файлов
const rename = require('gulp-rename');
// Для сжатия html файлов. Тут в основном, чтобы убрать комментарии в готовом файле
const htmlmin = require('gulp-htmlmin');



///// АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ БРАУЗЕРА /////
function browsersync() {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    }
  });
}
///// ОЧИСТКА ПАПКИ КОНЕЧНОЙ СБОРКИ ПРОЕКТА /////
function cleanDist() {
  return del('dist')
}

//// HTML ШАБЛОНЫ /////
function html() {
  return src('app/*.html')
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(htmlmin({
      removeComments: true
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

//// Конвертация шрифтов в woff и woff2 /////
// этот таск вызываем отдельно в самом начале для конвертации шрифтов в ttf формат  
function tottf() {
  return src('app/fonts/**/*')
    .pipe(fonter({
      formats: ["ttf"]
    }))
    .pipe(dest('app/fonts'))
}

function fonts() {
  return src('app/fonts/**/*.ttf')
    .pipe(ttf2woff2())
    .pipe(src('app/fonts/**/*.ttf'))
    .pipe(ttf2woff())
    .pipe(src('app/fonts/**/*.{woff,woff2}'))
    .pipe(newer('dist/fonts'))
    .pipe(dest('dist/fonts'))
}





///// СЖАТИЕ КАРТИНОК /////
function images() {
  return src('app/images/**/*')
    .pipe(newer('dist/images'))
    .pipe(webp())
    .pipe(dest('dist/images'))
    .pipe(src('app/images/**/*'))
    .pipe(newer('dist/images'))
    .pipe(imagemin(
      [
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
          ]
        })
      ]
    ))
    .pipe(dest('dist/images'))
    .pipe(browserSync.stream())
}
///// ОБРАБОТКА JS /////
function scripts() {
  return src([
    // 'node_modules/jquery/dist/jquery.js', //*JQUERY. При ненадобности библиотеки можно строчку закоментировать*
    'node_modules/swiper/swiper-bundle.js',
    'app/js/main.js'
  ])
    .pipe(fileinclude())
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
    .pipe(dest('dist/js'))
    .pipe(browserSync.stream())
}


///// ОБРАБОТКА СТИЛЕЙ /////
// SASS файлы преобразовываем в css файлы двух типов: расширенный (expanded) и сжатый (compressed).Непосредственно к проекту для оптимизации подключается сжатый вариант
function styles() {
  return src(['node_modules/normalize.css/normalize.css', 'node_modules/swiper/swiper-bundle.css', 'app/sass/style.sass'], { sourcemaps: true })
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(concat('style.css'))
    .pipe(webpcss())
    .pipe(autoprefixer({
      grid: true
    }))
    .pipe(groupcss())
    .pipe(dest('app/css', { sourcemaps: true }))
    .pipe(cleancss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(dest('app/css', { sourcemaps: true }))
    .pipe(dest('dist/css', { sourcemaps: true }))
    .pipe(browserSync.stream())
}


//// КОНЕЧНАЯ СБОРКА ПРОЕКТА /////
function build() {
  return src([
    'app/css/style.min.css',
    'app/css/style.css',
    'app/js/main.min.js',
    'app/js/main.js',
  ], { base: 'app' })
    .pipe(dest('dist'))
}
//// СЛЕЖЕНИЕ ЗА ИЗМЕНЕНИЯМИ /////
function watching() {
  watch(['app/sass/**/*.sass'], styles);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/images/**/*'], images);
  watch(['app/fonts/**/*'], fonts);
  //watch(['app/fonts/**/*'], tottf);
  watch(['app/**/*.html'], html).on('all', browserSync.reload);
}

exports.styles = styles;      // Запуск обработки стилей
exports.html = html;   // Запуск шаблонизатора
exports.watching = watching; //  Запуск слежения за изменениями
exports.browsersync = browsersync; // Запуск обновления браузера
exports.scripts = scripts; // Запуск функций JS
exports.images = images; // Запуск сжатия картинок
exports.cleanDist = cleanDist; // Запуск очистки папки dist
exports.fonts = fonts; // Запуск конвертации шрифтов


exports.tottf = tottf; // Запуск конвертации шрифтов в ttf формат
exports.build = series(cleanDist, html, tottf, fonts, images, styles, scripts, build); // команда используется для конечной сборки проекта (gulp build)
exports.default = parallel(html, fonts, images, styles, scripts, browsersync, watching); // Команда для запуска непосредственно разработки (gulp)
