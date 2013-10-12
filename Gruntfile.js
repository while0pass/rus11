module.exports = function (grunt) {

  var path = require('path');

  grunt.initConfig({

    jinja: {
      options: {
        templateDirs: [
          path.join(process.cwd(), 'templates/ext/'),
          path.join(process.cwd(), 'templates/inc/'),
          path.join(process.cwd(), 'templates/quizzes/'),
          path.join(process.cwd(), 'templates/nnj/'),
          path.join(process.cwd(), 'js'),
          path.join(process.cwd(), '.temp/css/'),
        ],
        contextRoot: path.join(process.cwd(), 'templates/context/'),
      },
      html: {
          expand: true,
          cwd: 'templates/nnj',
          src: '*.html',
          dest: '.temp/html/',
      },
      xml: {
          expand: true,
          cwd: 'templates/nnj',
          src: '*.xml',
          dest: 'build/',
      },
    },

    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 3 versions']
      },
      css: {
        expand: true,
        flatten: true,
        src:  ['css/*.css', '.temp/stylus2css/*.css'],
        dest: '.temp/css/',
      },
    },

    stylus: {
        styl: {
            expand: true,
            cwd: 'css',
            src: '*.styl',
            dest: '.temp/stylus2css/',
            ext: '.css',
        }
    },

    clean: {
        temp: ['.temp/'],
        build: ['build/'],
    },

    watch: {
        options: {
            livereload: true,
        },
        styl: {
            files: ['css/*.styl'],
            tasks: ['stylus', 'autoprefixer'],
        },
        html: {
            files: ['templates/**/*', '.temp/css/*.css', 'js/*.js'],
            tasks: ['jinja'],
        },
    },
  });

  grunt.loadNpmTasks('grunt-jinja');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['stylus', 'autoprefixer', 'jinja']);
}
