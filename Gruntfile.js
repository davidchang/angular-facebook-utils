module.exports = function(grunt) {

  var files = [
    'src/scripts/app.js',
    'src/views/facebookLoginPartial.js',
    'src/scripts/facebookSDK.js',
    'src/scripts/facebookUser.js',
    'src/scripts/facebookLoginButton.js'
  ];

  grunt.initConfig({
    watch : {
      files: ['src/scripts/*', 'src/views/*'],
      tasks: ['build'],
    },
    uglify: {
      'minified' : {
        options: {
          mangle: {
            except: ['angular']
          },
          compress: true,
          wrap: true
        },
        files: {
          'src/facebookUtils.min.js' : files
        }
      },
      'plain' : {
        options: {
          mangle: false,
          beautify: true,
          wrap: true,
          compress: false
        },
        files: {
          'src/facebookUtils.js' : files
        }
      }
    },
    ngtemplates: {
      'main' : {
        src: 'src/views/facebookLoginPartial.html',
        dest: 'src/views/facebookLoginPartial.js',
        options: {
          htmlmin: {
            collapseBooleanAttributes:      true,
            collapseWhitespace:             true,
            removeAttributeQuotes:          true,
            removeComments:                 true, // Only if you don't use comment directives!
            removeEmptyAttributes:          true,
            removeRedundantAttributes:      true,
            removeScriptTypeAttributes:     true,
            removeStyleLinkTypeAttributes:  true
          },
          module: 'facebookUtils'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['ngtemplates', 'uglify']);
};
