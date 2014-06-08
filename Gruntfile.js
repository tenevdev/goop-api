module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      dist: {
        src: ['public/**', 'app/**', 'config/**', 'app.js', '*.json', 'Procfile'],
        dest: 'dist/<%= pkg.version %>',
        expand: true
      }
    },

    clean: {
      dist: {
        src: ['dist/<%= pkg.version %>']
      }
    },

    uglify: {
      dist: {
        options: {
          mangle: false,
          wrap: 'exports',
          exportAll: true
        },
        files: {
          'dist/<%= pkg.version %>/app.min.js': ['app/**/*.js', 'app.js'],
          'dist/<%= pkg.version %>/config.min.js': ['config/**/*.js']
        }
      }
    },

    jade: {
      compile: {
        options: {
          data: {}
        },
        files: [{
          expand: true,
          cwd: 'app/',
          src: ['**/*.jade'],
          dest: 'dist/<%= pkg.version %>/app/',
          ext: '.html'
        }]
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      files: ['**/*.js', '!node_modules/**', '!dist/**']
    },

    watch: {
      web: {
        files: ['**/*.js', '!Gruntfile.js', '!node_modules/**', '!dist/**'],
        tasks: ['scripts', 'express:web'],
        options: {
          nospawn: true,
          atBegin: true
        }
      },
      jade: {
        files: ['**/*.jade'],
        tasks: ['jade']
      },
      copy: {
        files: ['<%= copy.dist.src %>'],
        tasks: ['copy']
      }
    },

    express: {
      web: {
        options: {
          script: 'app.js'
        }
      },
      preview: {
        options:{
          script: 'dist/<%= pkg.version %>/app.js'
        }
      }
    },

    parallel: {
      web: {
        options: {
          stream: true
        },
        tasks: [{
          grunt: true,
          args: ['watch:web']
        }, {
          grunt: true,
          args: ['watch:jade']
        }]
      }
    },

    shell: {
      heroku: {
        command: 'git push heroku master'
      },
      'git-add-dist': {
        command: 'git add '
      },
      'git-branch':{
        command: function(branch){
          var commands = [];
          commands.push('git checkout ' + branch);
          commands.push('git merge master');
          return commands;
        }
      },
      'git-commit-build': {
        command: function(commitMessage){
          return 'git commit -am"' + commitMessage + '"';
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-parallel');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('web', 'Launch webserver and watch tasks', [
    'parallel:web'
  ]);
  grunt.registerTask('build', 'Clean build directory and copy files', [
    'clean:dist',
    'copy:dist',
    'scripts'
  ]);
  grunt.registerTask('scripts', 'Uglify scripts and clean the directory', [
    'jshint'
  ]);
  grunt.registerTask('preview', 'Launch web server from dist', ['express:preview']);
  grunt.registerTask('staging', 'Staging...', ['build', 'shell:git-commit-build:<%= pkg.version %>']);

  grunt.registerTask('production', '...', ['build', 'shell:git-commit-build:<%= pkg.version %>','shell:git-branch:deploy' , 'shell:heroku' ]);

  grunt.registerTask('default', ['web']);
};