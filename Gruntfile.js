module.exports = function(grunt) {

  var nonFirebaseFiles = [
    'src/scripts/app.js',
    'src/views/facebookLoginPartial.js',
    'src/scripts/facebookSDK.js',
    'src/scripts/facebookLogin.js'
  ];

  var firebaseFiles = [
    'src/scripts/appFirebase.js',
    'src/views/facebookLoginPartialFirebase.js',
    'src/scripts/facebookSDK.js',
    'src/scripts/facebookLoginFirebase.js'
  ];

  grunt.initConfig({
    uglify: {
      'build-minify-non-firebase-version' : {
        options: {
          mangle: {
            except: ['angular']
          },
          compress: true,
          wrap: true
        },
        files: {
          'src/facebookUtils.min.js' : nonFirebaseFiles
        }
      },
      'build-source-non-firebase-version' : {
        options: {
          mangle: false,
          beautify: true,
          wrap: true,
          compress: false
        },
        files: {
          'src/facebookUtils.js' : nonFirebaseFiles
        }
      },
      'build-minify-firebase-version' : {
        options: {
          mangle: {
            except: ['angular']
          },
          compress: true,
          wrap: true
        },
        files: {
          'src/facebookUtilsFirebase.min.js' : firebaseFiles
        }
      },
      'build-source-firebase-version' : {
        options: {
          mangle: false,
          beautify: true,
          wrap: true,
          compress: false
        },
        files: {
          'src/facebookUtilsFirebase.js' : firebaseFiles
        }
      }
    },
    ngtemplates: {
      'nonfirebase' : {
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
          module: 'angular-facebook-utils'
        }
      },
      'firebase' : {
        src: 'src/views/facebookLoginPartialFirebase.html',
        dest: 'src/views/facebookLoginPartialFirebase.js',
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

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['ngtemplates', 'uglify']);
};
