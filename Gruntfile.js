module.exports = function(grunt) {

    grunt.initConfig({

        /**
         * step 1:
         * 将入口文件拷贝到 产出目录
         */
        copy: {
            hellosea:{
                files:{
                    "js/hellosea/dist/hellosea.js":["js/hellosea/src/hellosea.js"]
                }
                
            }
        },

        /**
         * step 2:
         * 创建 .build/js/common 临时目录
         * 将公用 common 目录下的 文件 转为 具名函数，并保存在 .build/js/common 目录下
         * 创建 .build/js/hellosea 临时目录 
         * 将需要合并的js文件转为具名函数，并保持独立地保存在 .build/js/hellosea 临时目录下
         */ 
        transport: {
            // util:{
            //     options: {
            //         relative: true,
            //         debug:false,
            //         format: '../asset/dist/util/{{filename}}' //生成的id的格式
            //     },
            //     files: [{
            //         'cwd':'asset/src/util/',
            //         'src':['**/*.js'],
            //         'dest':'.build/dist/util/'
            //     }]
            // },
            // tool:{
            //     options: {
            //         relative: true,
            //         debug:false,
            //         format: '../asset/dist/tool/{{filename}}' //生成的id的格式
            //     },
            //     files: [{
            //         'cwd':'asset/src/tool/',
            //         'src':['**/*.js'],
            //         'dest':'.build/dist/tool/'
            //     }]
            // },

            // common:{
            //     options: {
            //         relative: true,
            //         debug:false,
            //         format: '../asset/dist/common/{{filename}}' //生成的id的格式
            //     },
            //     files: [{
            //         'cwd':'asset/src/common/',
            //         'src':['**/*.js'],
            //         'dest':'.build/dist/common/'
            //     }]
            // },
            
            pagesFiles: {
                options: {
                    relative: true,
                    debug:false,
                    format: '../asset/dist/{{filename}}' //生成的id的格式
                },
                files: [{
                    'cwd':'asset/src/',
                    'src':['**/*.js'],
                    'dest':'.build/dist/'
                }]
            }
        },

        /**
         * step 3:
         * 将.build 目录下的具名函数 入口文件,根据id查找对应的文件，并且 合并为 1个 js 文件
         * 将这个合并的 js 文件 拷贝到 我们的输出目录
         */
        concat: {
 
            // commonFiles: {
            //     options: {
            //         // relative: true
            //     },
            //     files: commonFiles()
            // },
 
            pages: {
                options: {
                    // relative: true
                },
                files: concatPagesFiles()
            }
        },

        /**
         * step 4:
         * 压缩 这个 合并后的 文件
         */
        uglify: {
            pages: {
                options: {
                    debug: false,
                },
                files:[{
                    expand: true,
                    cwd: 'asset/dist/pages/',
                    src: ['**/*.js'],
                    dest: 'asset/dist/pages/'
                }]
            }
        },

        /**
         * step 5:
         * 将 .build 临时目录删除
         */
        clean: {
            build: ['.build']
        }
    });

    // function commonFiles(){
    //     var commonFiles={};
    //     var matches = grunt.file.expand('.build/dist/common/*.js');
    //     for(var i=0; i<matches.length; i++){
    //         commonFiles['asset'+ matches[i].replace('.build','')]=matches[i]
    //     }
    //     return commonFiles
    // }
    function concatPagesFiles(){
        var concatlist={};
        var matches = grunt.file.expand('.build/dist/**/*.js');
        for(var i=0; i<matches.length; i++){
            concatlist['asset'+ matches[i].replace('.build','')]=matches[i]
        }
        console.log(concatlist)
        
        return concatlist
    }

    grunt.loadNpmTasks('grunt-cmd-transport');
    grunt.loadNpmTasks('grunt-cmd-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('default', ['transport', 'concat','uglify','clean']);
    grunt.registerTask('build', function(name,step){
        switch(step){
            case "1":
                grunt.task.run('copy:' + name);
                break;

            case "2":
                grunt.task.run('transport:common');
                grunt.task.run('transport:' + name);
                break;
            case "3":
                grunt.task.run('concat:' + name);
                break;
            case "4":
                grunt.task.run('uglify:' + name);
                break;
            case "5":
                grunt.task.run('clean');
                break;

            default:
                grunt.task.run(['copy:' + name,  'transport:common', 'transport:' + name, 'concat:' + name, 'uglify:' + name, 'clean'])
                break;
        }
    });
};