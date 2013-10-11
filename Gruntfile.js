module.exports = function(grunt) {

  var nonFirebaseFiles = [
    'src/scripts/app.js',
    'src/scripts/facebookSDK.js',
    'src/scripts/facebookLogin.js'
  ];

  var firebaseFiles = [
    'src/scripts/appFirebase.js',
    'src/scripts/facebookSDK.js',
    'src/scripts/facebookLoginFirebase.js'
  ];

  grunt.initConfig({
    jshintrc : grunt.file.readJSON('.jshintrc'),
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
    }
  });


  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('build', ['uglify']);
};