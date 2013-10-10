module.exports = function (grunt) {

  var path = require('path');

  grunt.initConfig({

    jinja: {
      options: {
        templateDirs: [
          path.join(process.cwd(), 'templates/ext'),
          path.join(process.cwd(), 'templates/inc'),
          path.join(process.cwd(), 'templates/quizzes'),
          path.join(process.cwd(), 'templates/nnj'),
          path.join(process.cwd(), 'js'),
          path.join(process.cwd(), '.css'),
        ],
        contextRoot: path.join(process.cwd(), 'templates/context'),
      },
      html: {
          expand: true,
          cwd: 'templates/nnj',
          src: '*.html',
          dest: '.html/',
      },
      xml: {
          expand: true,
          cwd: 'templates/nnj',
          src: '*.xml',
          dest: '.xml/',
      },
    },

    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 3 versions']
      },
      css: {
        expand: true,
        flatten: true,
        src:  ['css/*.css', '.styl/*.css'],
        dest: '.css/'
      },
    },

    stylus: {
        styl: {
            expand: true,
            cwd: 'css',
            src: '*.styl',
            dest: '.styl/',
        }
    },

  });

  grunt.loadNpmTasks('grunt-jinja');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-stylus');

  grunt.registerTask('default', ['stylus', 'autoprefixer', 'jinja']);
}
