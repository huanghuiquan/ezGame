module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        // 生成文档
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'src',
                    outdir: 'doc'
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
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    // 默认执行的任务
    grunt.registerTask('default', ["yuidoc"]);
};
