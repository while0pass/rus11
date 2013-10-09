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
        ]
      },
      html: {
        files: [{
          expand: true,
          cwd: 'templates/nnj',
          src: ['*.html'],
          dest: '.html/',
        }]
      },
      xml: {
        files: [{
          expand: true,
          cwd: 'templates/nnj',
          src: ['*.xml'],
          dest: '.xml/',
        }]
      },
    },
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 3 versions']
      },
      html: {
        expand: true,
        flatten: true,
        src:  'css/*.css',
        dest: '.css/'
      },
    },
  });

  grunt.loadNpmTasks('grunt-jinja');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('default', ['autoprefixer', 'jinja']);
}
