module.exports = function(grunt) {
    grunt.initConfig({
        // 生成文档
        jsdoc : {
            dist : {
                src: ['src/*.js', 'test/*.js'],
                options : {
                    destination : 'doc'
                }            
            }
        },

        // 压缩文件
        uglify: {
            files: {
                'build/ezGame.min.js': ["src/ezGame.js"]
            }
        }
        
    });

    // 加载指定插件任务
    grunt.loadNpmTasks('grunt-jsdoc'); 

    // 默认执行的任务
    // grunt.registerTask('default', ["jsdoc"]);
};
