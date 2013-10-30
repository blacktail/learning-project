var _ = require('lodash'),
	packages = {
		'services': 'index.html'
	},
	srcDir = '.',
	destDir = '../dist';

module.exports = function (grunt) {
	var buildVersion = encodeURIComponent(grunt.template.date(new Date().getTime(), 'yyyymmddHHMMsso'));

	grunt.initConfig({
		/*css procompiling*/
		stylus: {
			compile: {
				options: {
					compress: true,
					paths: ['css', 'stylus'],
					urlfunc: 'embedurl',
					'include css': true
				},
				files: {
					'css/startup.css': 'stylus/startup.styl'
				}
			}
		},

		/*generate startup.js*/
		concat: {
			startup: {
				options: {
					header: '// this file is auto generated by build-process, please do not modify it by yourself.',
					footer: '\nrequire(["main"]);\n'
				},
				files: [{
					src: getSrcFiles(['vendor/requirejs/require.js', 'js/config.js']),
					dest: getSrcFile('js/startup.js')
				}]
			},
			startupbuild: {
				options: {
					header: '// this file is auto generated by build-process, please do not modify it by yourself.',
					footer: '\nrequire(["main"]);\n',
					process: function (src, filePath) {
						return src.replace('urlArgs: "bust=" + (new Date()).getTime()',
							'urlArgs: "v=' + buildVersion + '"');
					}
				},
				files: [{
					src: getSrcFiles(['vendor/requirejs/require.js', 'js/config.js']),
					dest: getSrcFile('js/.startup.build.js')
				}]
			}
		},

		/*generate templates for debug mode*/
		templates_debug: {
			options: {
				base: getSrcFile('js')
			},
			partials: {
				options: {
					partial: true
				},
				files: getTemplatePathsConfig('partials', true)
			},
			templates: {
				files: getTemplatePathsConfig('templates', true)
			}
		},

		/*precompile templates when distribute*/
		handlebars: {
			partials: {
				options: {
					amd: true,
					partialRegex: /.*/,
					partialsPathRegex: /\/partials\//,
					processPartialName: processHandlebarsTemplateName(true)
				},
				files: getTemplatePathsConfig('partials')
			},
			templates: {
				options: {
					amd: true,
					processName: processHandlebarsTemplateName()
				},
				files: getTemplatePathsConfig('templates')
			}
		},

		/*copy resources to dist dir*/
		copy: {
			html: {
				options: {
					processContent: function (content, srcPath) {
						content = content.replace(/src=(.*)\.js[^'">\s]*/mg, 'src=$1.js?v=' + buildVersion)
							.replace(/href=(.*)\.css[^'">\s]*/mg, 'href=$1.css?v=' + buildVersion);

						return content;
					}
				},
				files: getHtmlEntriesConfig(packages)
			},
			imgs: {
				files: [{
					expand: true,
					src: getSrcFiles(['img/*.*']),
					dest: destDir
				}]
			}
		},

		/*resolve dependecies, js&css optimization*/
		requirejs: getRequirejsConfig(destDir),

		/* development asistant*/
		watch: getWatchConfig(),

		jshint: {
			options: {
				force: true,
				'-W030': true
			},
			all: getSrcFiles(['js/**/*.js', '!js/**/.*_compiled.js',
				'!js/**/.auto_*.js', '!js/startup.js', '!js/text.js', '!**/.*' 
			])
		},

		cssmin: {
			minify: {
				expand: true,
				src: getSrcFiles(['css/*.*']),
				dest: destDir
			}
		},

		clean: {
			options: {
				force: true
			},
			temporary: getSrcFiles(['js/**/.auto_*', 'js/**/.*_compiled*', 'js/**/.*.js']),
			dest: [destDir]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-livereload');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');

	grunt.loadTasks('grunt_tasks');

	grunt.registerTask('init', ['stylus', 'templates_debug', 'concat:startup', 'watch']);
	grunt.registerTask('dist', ['clean', 'stylus', 'jshint', 'handlebars', 'concat', 'requirejs', 'copy', 'cssmin', 'clean:temporary']);
	grunt.registerTask('default', ['dist', 'init']);

	grunt.event.on('watch', function (action, filePath) {
		grunt.config(['jshint', 'all'], filePath);
	});
};

function getRequirejsConfig(destDir) {
	var config = {
		startupjs: getRequirejsConfigHelper('js', '.startup.build', destDir + '/js/startup.js', true)
	};

	_.each(packages, function (entryPath, packagePath) {
		var packageName = packagePath.split('/').join('');
		var cssFileName = packagePath.split('/').join('_');

		config[packageName + 'js'] = getRequirejsConfigHelper('js', packagePath + '/main', destDir + '/js/' + packagePath + '/main.js');
	});

	return config;
}

function getRequirejsConfigHelper(type, inPath, outPath, isStartup) {
	var packagePaths = {};

	_.each(packages, function (entryPath, packagePath) {
		packagePaths[packagePath + '/templates_compiled'] = packagePath + '/templates/.templates_compiled';
	});

	if (type == 'js') {
		return {
			options: {
				baseUrl: getSrcFile('js'),
				mainConfigFile: getSrcFile('js/config.js'),
				name: inPath,
				optimize: 'uglify2',
				out: outPath,
				preserveLicenseComments: false,
				generateSourceMaps: true,
				paths: _.extend({
					'handlebars': '../vendor/handlebars/handlebars.runtime',
					'common/partials_compiled': 'common/templates/.partials_compiled',
					'common/templates_compiled': 'common/templates/.templates_compiled'
				}, packagePaths),
				exclude: isStartup ? [] : ['startup']
			}
		};
	} else if (type == 'css') {
		return {
			options: {
				optimizeCss: 'standard',
				cssIn: inPath,
				out: outPath
			}
		};
	} else {
		throw new Error('unrecognized requirejs optimization type');
	}
}

function getTemplatePathsConfig(type, isDebug) {
	var fileConfig = {

	};

	if (type == 'partials') {
		if (isDebug) {
			fileConfig[getSrcFile('js/common/templates/.auto_partials.js')] = getSrcFiles(['js/common/templates/partials/**/*.hb']);
		} else {
			fileConfig[getSrcFile('js/common/templates/.partials_compiled.js')] = getSrcFiles(['js/common/templates/partials/**/*.hb']);
		}
	}

	if (type == 'templates') {
		if (isDebug) {
			fileConfig[getSrcFile('js/common/templates/.auto_templates.js')] = getSrcFiles(['js/common/templates/**/*.hb',
				'!js/common/templates/partials/**/*.hb'
			]);
		} else {
			fileConfig[getSrcFile('js/common/templates/.templates_compiled.js')] = getSrcFiles(['js/common/templates/**/*.hb',
				'!js/common/templates/partials/**/*.hb'
			]);
		}
	}

	templatePaths = _.clone(packages);

	_.each(templatePaths, function (entryPath, templatePath) {
		templatePath = getSrcFile('js/' + templatePath);

		if (type == 'partials') {
			if (isDebug) {
				fileConfig[templatePath + '/templates/.auto_partials.js'] = [templatePath + '/templates/partials/**/*.hb'];
			} else {
				fileConfig[templatePath + '/templates/.partials_compiled.js'] = [templatePath + '/templates/partials/**/*.hb'];
			}
		}

		if (type == 'templates') {
			if (isDebug) {
				fileConfig[templatePath + '/templates/.auto_templates.js'] = [templatePath + '/templates/**/*.hb',
					'!' + templatePath + '/templates/partials/**/*.hb'
				];
			} else {
				fileConfig[templatePath + '/templates/.templates_compiled.js'] = [templatePath + '/templates/**/*.hb',
					'!' + templatePath + '/templates/partials/**/*.hb'
				];
			}
		}
	});

	return fileConfig;
}

function processHandlebarsTemplateName(isPartial) {
	return function (filePath) {
		var fileName = filePath.replace(new RegExp('^' + getSrcFile('scripts/')), '').replace(isPartial ? /templates\/partials\// : /templates\//, '').replace(/\..*$/, '');
		return fileName.replace(/\/main$/, '');
	};
}

function getWatchConfig() {
	return {
		scripts: {
			options: {
				livereload: true,
				nospawn: true
			},
			files: getSrcFiles(['js/config.js']),
			tasks: ['concat:startup', 'jshint']
		},
		templates: {
			options: {
				livereload: true
			},
			files: getSrcFiles(['js/**/*.hb']),
			tasks: ['templates_debug']
		},
		livereload: {
			files: getSrcFiles(['css/**/*', 'favicon.ico', 'img/**/*', 'vendor/**/*.js', '!vendor/requirejs/require.js', '!css/foundation.css', '!css/normalize.css']),
			options: {
				livereload: true
			}
		},
		jshintreload: {
			options: {
				livereload: true,
				nospawn: true
			},
			files: getSrcFiles(['js/**/*.js', '!js/**/.*_compiled.js', '!js/startup.js',
				'!js/**/.auto_*.js', '!js/config.js'
			]),
			tasks: ['jshint']
		},
		stylus: {
			options: {
				livereload: true
			},
			files: getSrcFiles(['stylus/**/*.styl']),
			tasks: ['stylus']
		}
	};
}

function getHtmlEntriesConfig(packages) {
	var config = [];

	_.each(packages, function (entryPaths) {
		entryPaths = _.isArray(entryPaths) ? entryPaths : [entryPaths];

		_.each(entryPaths, function (entryPath) {
			config.push({
				expand: true,
				src: [entryPath],
				dest: destDir,
				filter: 'isFile'
			});
		});
	});

	config = _.unique(config, function (item) {
		return item.src[0];
	});

	return config;
}

function getSrcFile(path) {
	return getFiles(srcDir, path)[0];
}

function getSrcFiles(paths) {
	return getFiles(srcDir, paths);
}

function getDestFile(path) {
	return getFiles(destDir, path)[0];
}

function getFiles(root, paths) {
	var results = [];

	if (!_.isArray(paths)) {
		paths = [paths];
	}

	root = root.replace(/\/$/g, '');

	_.each(paths, function (path) {
		var isNo = false;
		if (path[0] == '!') {
			path = path.slice(1);
			isNo = true;
		}

		results.push((isNo ? '!' : '') + root + path.replace(/^([^\/])(.*)/, '/$1$2'));
	});

	return results;
}
