module.exports = function (grunt) {

  var path = require('path');

  grunt.initConfig({

    jinja: {
      options: {
        templateDirs: [
          path.join(process.cwd(), 'templates/'),
          path.join(process.cwd(), 'templates/ext/'),
          path.join(process.cwd(), 'templates/inc/'),
          path.join(process.cwd(), 'templates/quizzes/'),
          path.join(process.cwd(), 'templates/nnj/'),
          path.join(process.cwd(), '.temp/css/'),
          path.join(process.cwd(), '.temp/js/'),
          path.join(process.cwd(), 'js'),
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

    cssUrlRewrite: {
        options: {
            deleteAfterEncoding: false,
        },
        target: {
            expand: true,
            flatten: true,
            src: ['.temp/css/*.css'],
            dest: '.temp/css/'
        },
    },

    csso: {
        options: {
            restructure: false,
        },
        target: {
            expand: true,
            flatten: true,
            src: ['.temp/css/*.css'],
            dest: '.temp/css/'
        },
    },

    jsEscapeSequences: {
        target: {
            expand: true,
            src: '.temp/css/*.css',
            ext: '.jses',
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

    coffee: {
        options: {
            bare: true,
        },
        target: {
            expand: true,
            flatten: true,
            src: 'js/*.coffee',
            dest: '.temp/js/',
            ext: '.js',
        },
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
            tasks: ['stylus', 'autoprefixer', 'csso'],
        },
        coffee: {
            files: ['js/*.coffee'],
            tasks: ['coffee'],
        },
        jses: {
            files: ['.temp/css/*.css'],
            tasks: ['jsEscapeSequences'],
        },
        html: {
            files: ['templates/**/*', '.temp/css/*', 'js/*.js', '.temp/js/*'],
            tasks: ['jinja'],
        },
    },
  });

  grunt.loadNpmTasks('grunt-jinja');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks("grunt-css-url-rewrite");
  grunt.loadNpmTasks('grunt-csso-alt');

  grunt.registerMultiTask('jsEscapeSequences',
  'Escape file contents using JavaScript\'s strings hexadecimal and ' +
  'unicode escape sequences', function () {
    var i, j, m, n, opts, conts, src;
    opts = this.options({ encoding: grunt.file.defaultEncoding });
    for(i=0, j=this.files.length; i<j; i++) {
        f = this.files[i];
        conts = [];
        for(m=0, n=f.src.length; m<n; m++) {
            src = f.src[m]
            conts.push(grunt.file.read(src, { encoding: opts.encoding }));
        }
        grunt.file.write(
            f.dest || f.src[0],
            escape(conts.join('\n')).replace(/%u/g, '\\u').replace(/%/g, '\\x'),
            { encoding: opts.encoding });
        grunt.log.writeln(f.src, '-->', f.dest);
    }
  });
  grunt.registerTask('default', ['stylus', 'autoprefixer', 'cssUrlRewrite',
                                 'csso', 'jsEscapeSequences', 'coffee',
                                 'jinja']);
}
