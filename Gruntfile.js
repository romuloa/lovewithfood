module.exports = function(grunt) {

	'use strict';
	/* jshint camelcase: false */

	// load all grunt tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Set path variables for the files we want to include in the build
	var appConfigVars = {
		bowerSource: 'third_party/bower_components',
		thirdPartyJs: 'third_party/js',
		source: 'js',
		templates: 'templates',
		css: 'static/css',
		py: 'src'
	};

	// The target directory for the final build product.
	var targetDirectory = 'out';

	grunt.initConfig({

		appConfig: appConfigVars,

		appengine: {
			app: {
				root: targetDirectory,
				manageScript: [process.env.HOME,
	                     'bin', 'google_appengine', 'appcfg.py'].join('/'),
				runFlags: {
					port: 8080,
					enable_sendmail:  'yes'
				},
				runScript: [process.env.HOME,
	                  'bin', 'google_appengine', 'dev_appserver.py'].join('/')
			}
		},

		build: grunt.file.readJSON('config.json'),

		// Empty out directory
		clean: [targetDirectory],

		/**
		 * Concatenate Javascript files.
		 * Combine all 3rd party Javascript into a min/vendor.js file.
		 * Combine all custom Javascript into a min/scripts.js file
		 */
		concat: {
			dist: {
				files: [
					{
						dest: '<%= appConfig.source %>/build/vendor.js',
						src: [
							'<%= appConfig.bowerSource %>/jquery/dist/jquery.js',
							'<%= appConfig.bowerSource %>/angular/angular.js'
						]
					},
					{
						dest: '<%= appConfig.source %>/build/scripts.js',
						src: [
							'<%= appConfig.source %>/app.js',
							'<%= appConfig.source %>/controllers/{,*/}*.js',
							'<%= appConfig.source %>/directives/{,*/}*.js',
							'<%= appConfig.source %>/filters/{,*/}*.js',
							'<%= appConfig.source %>/services/{,*/}*.js'
						]
					}
				]
			}
		},

		/**
		* Copies items into the out folder
		*/
		copy: {
			source: {
				cwd: 'src/',
				dest: [targetDirectory, ''].join('/'),
				expand: true,
				src: '**'
			},
			js: {
				cwd: ['js', 'build', ''].join('/'),
				dest: [targetDirectory, 'static', 'js', ''].join('/'),
				expand: true,
				src: '**'
			},
			third_party_js: {
				cwd: ['third_party', 'js', ''].join('/'),
				expand: true,
				dest: [targetDirectory, 'static', 'js', ''].join('/'),
				src: [
					'google-analytics.js'
				]
			},
			static: {
				cwd: 'static',
				dest: [targetDirectory, 'static', ''].join('/'),
				expand: true,
				src: '**'
			},
			templates: {
				cwd: 'templates',
				dest: [targetDirectory, 'templates', ''].join('/'),
				expand: true,
				src: '**'
			},
			third_party_py: {
				cwd: ['third_party', 'py'].join('/'),
				dest: [targetDirectory, ''].join('/'),
				expand: true,
				src: '**'
			}
		},

		/**
		 * Runs files through jshint to look for syntax errors.
		 * This isn't being used right now.
		 */
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				ignores: [
					'<%= appConfig.source %>/min/*.js'
				]
			},
			all: [
				'Gruntfile.js',
				'<%= yeoman.web %>/js/{,*/}*.js'
			]
		},

		pkg: grunt.file.readJSON('package.json'),

		/**
		 * Minify the concatenated vendor.js and scripts.js into vendor.min.js and scripts.min.js files.
		 */
		uglify: {
			dist: {
				files: [
					{dest: '<%= appConfig.source %>/build/vendor.min.js', src: ['<%= appConfig.source %>/build/vendor.js']},
					{dest: '<%= appConfig.source %>/build/scripts.min.js', src: ['<%= appConfig.source %>/build/scripts.js']}
				]
			}
		},

		/**
		 * Poll for changes in html, css, js, tpl, and py  files
		 */
		watch: {
			scripts: {
				files: [
					'<%= appConfig.source %>/{,*/}*.js',
					'!<%= appConfig.source %>/build/*'
				],
				tasks: ['js']
			},
			html: {
				files: [
					'<%= appConfig.templates %>/{,*/}*.html',
					'<%= appConfig.templates %>/{,*/}*.tpl'
				],
				tasks: ['html']
			},
			css: {
				files: [
					'<%= appConfig.css %>/{,*/}*.css'
				],
				tasks:['css']
			},
			py: {
				files: [
					'<%= appConfig.py %>/{,*/}*.py',
					'<%= appConfig.l10n %>/{,*/}*.arb',
					'<%= appConfig.l10n %>/{,*/}*.json'
				],
				tasks: ['py']
			}
		},

	});

	grunt.loadNpmTasks('grunt-appengine');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('nop', function() {});

	grunt.registerTask('js', [
		'concat',
		'uglify',
		'copy:js',
		'copy:third_party_js'
	]);

	grunt.registerTask('css', [
		'copy:static'
	]);

	grunt.registerTask('html', [
		'copy:templates'
	]);

	grunt.registerTask('py', [
		'copy:source',
		'copy:third_party_py'
	]);


	/**
	 * Define the watcher command. Invoke in your command line by typing:
	 * grunt watcher
	 */
	grunt.registerTask('watcher', [
		'watch'
	]);



	grunt.registerTask('default', [
		'concat',
		'uglify',
		'copy:source',
		'copy:js',
		'copy:third_party_js',
		'copy:static',
		'copy:templates',
		'copy:third_party_py'
	]);
};

