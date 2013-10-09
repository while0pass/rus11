module.exports = function (grunt) {

  var path = require('path');

  grunt.initConfig({
    jinja: {
      options: {
        templateDirs: [
          path.join(process.cwd(), 'templates'),
          path.join(process.cwd(), 'quizzes'),
          path.join(process.cwd(), '.css'),
        ]
      },
      html: {
        files: [{ expand: true, dest: '.html/',
                  cwd: 'templates/', src: ['*.html'] }]
      },
      xml: {
        files: [{ expand: true, dest: '.xml/',
                  cwd: 'templates/', src: ['*.xml'] }]
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
  grunt.loadNpmTasks('grunt-autoprefixer')

  grunt.registerTask('default', ['autoprefixer', 'jinja']);
}
