'use strict';

module.exports = function(grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  /**
   * Set path variables for the files we want to include in the build
   */
  var appConfigVars = {
    bowerSource: 'third_party/bower_components',
    source: 'js',
    target: 'app/static/js'
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    appConfig: appConfigVars,

    /**
     * Watch for changes to all Javascript files that aren't in the 'min' folder.
     * 'min' is where minified/concatenated files will be placed.
     */
    watch: {
      scripts: {
        files: [
          '<%= appConfig.source %>/{,*/}*.js',
          '!<%= appConfig.source %>/min/*'
        ],
        tasks: ['build']
      }
    },

    /**
     * Concatenate Javascript files.
     * Combine all 3rd party Javascript into a min/vendor.js file.
     * Combine all custom Javascript into a min/scripts.js file
     */
    concat: {
      dist: {
        files: [
          {dest: '<%= appConfig.target %>/min/vendor.js', src: [
           '<%= appConfig.bowerSource %>/jquery/dist/jquery.js',
           '<%= appConfig.bowerSource %>/angular/angular.js',
           '<%= appConfig.bowerSource %>/angular-cache/dist/angular-cache.js'
          ]},

          {dest: '<%= appConfig.target %>/min/scripts.js', src: [
            '<%= appConfig.source %>/app.js',
            '<%= appConfig.source %>/controllers/{,*/}*.js',
              '<%= appConfig.source %>/directives/{,*/}*.js',
              '<%= appConfig.source %>/filters/{,*/}*.js',
              '<%= appConfig.source %>/services/{,*/}*.js'
          ]}
        ]
      }
    },

    /**
     * Minify the concatenated vendor.js and scripts.js into vendor.min.js and scripts.min.js files.
     */
    uglify: {
      dist: {
        files: [
          {dest: '<%= appConfig.target %>/min/vendor.min.js', src: ['<%= appConfig.target %>/min/vendor.js']},
          {dest: '<%= appConfig.target %>/min/scripts.min.js', src: ['<%= appConfig.target %>/min/scripts.js']}
        ]
      }
    },

  });

  /**
   * Define the watcher command. Invoke in your command line by typing:
   * grunt watcher
   */
  grunt.registerTask('watcher',[
    'watch'
  ]);

  /**
   * Define the build command. Invoke in your command line by typing:
   * grunt build
   *
   * Note: If you're already running 'grunt watcher' you don't need to run this command.
   */
  grunt.registerTask('build', [
    'concat',
    'uglify'
  ]);

  /**
   * If you simply type 'grunt' in your command line, it will run the 'grunt build' command.
   */
  grunt.registerTask('default', ['build']);
};