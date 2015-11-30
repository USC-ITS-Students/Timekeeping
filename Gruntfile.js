module.exports = function(grunt) {
    // init
    grunt.config.init({
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            }
        }
    });

    // tasks
    grunt.loadNpmTasks('grunt-karma');

};