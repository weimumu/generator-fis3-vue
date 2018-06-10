// 项目过滤
fis.set('project.ignore', [
    'node_modules/**',
    'fis-conf.js',
    'package-lock.json',
    'npm-debug.log',
    'components/demo/**',
    '.yo-rc.json',
    '/package.json',
    'command/**',
    '**/*.md',
    '.git/**',
    '.svn/**'
])

// 因为是vue项目，所以添加vue为构建工具
fis.set('project.fileType.text', 'vue');

//禁用fis3默认的fis-hook-components, 启用node_modules
fis.unhook('components');
fis.hook('node_modules');

// 添加commonjs支持 (需要先安装fis3-hook-commonjs)
fis.hook('commonjs', {
    extList: ['.js', '.jsx', '.es', '.ts', '.tsx'],
    umd2commonjs: true, // 如果存在部分模块化文件不是以 commonjs 规范编写的，该插件可以通过配置文件属性 umd2commonjs 尝试兼容。
})

// 在当前目录下安装babel-plugin-transform-runtime，babel-runtime 使用polyfill
var runtime = require('babel-plugin-transform-runtime');
var parserEs6 = {
    isMod: true,
    rExt: 'js',
    useSameNameRequire: true,
    parser: [
        fis.plugin('babel-6.x', {
            plugins: [runtime]
        }),
        fis.plugin('jdists', {
            remove: "prod"  // 用/*<prod>*/ /*</prod>*/ 包住的东西会被删除
        }),
    ]
}

// 编译es6代码
fis.match('/modules/**.js', parserEs6);
fis.match('/widget/**.js', parserEs6);
fis.match('**.vue:js', parserEs6);

//标记为组件
fis.match('/node_modules/**.js', {
    isMod: true,
    useSameNameRequire: true
});

// 数据模拟不要模块化了 
// https://github.com/fex-team/fis3-hook-commonjs
fis.match("/mock/**.js", {
    ignoreDependencies: true
})

//允许你在 js 中直接 require 文件, 允许你在 js 中直接 require css 文件。
fis.match('**.{js,jsx,ts,es6,vue}', {
    preprocessor: [
        fis.plugin('js-require-file'),
        fis.plugin('js-require-css', {
            //mode : 'inline'
        })
    ]
});

// vue文件里面的scss
fis.match('**.vue:scss', {
    rExt: 'css',
    parser: [
        fis.plugin('node-sass')
    ],
    useSprite: true, // css图片合并，只会处理 url 中带 ?__sprite 图片的规则。
    // 标准化处理，加css前缀
    preprocessor: fis.plugin('autoprefixer', {
        // https://www.npmjs.com/package/fis3-preprocessor-autoprefixer
        "browsers": ["Android >= 2.4", "iOS >= 4", "ie >= 9", "firefox >= 15"]
    })
});

// sass. scss文件处理
fis.match('*.{scss,sass}', {
    parser: fis.plugin('node-sass'),
    rExt: '.css',
    useSprite: true,
    // 标准化处理，加css前缀
    preprocessor: fis.plugin('autoprefixer', {
        "browsers": ["Android >= 2.4", "iOS >= 4", "ie >= 9", "firefox >= 15"]
    })
});

// css文件处理
fis.match('**.css', {
    useSprite: true,
    preprocessor: fis.plugin('autoprefixer', {
        "browsers": ["Android >= 2.4", "iOS >= 4", "ie >= 9", "firefox >= 15"]
    })
});

fis.match('::package', {
    // css精灵合并  更多配置  https://github.com/fex-team/fis-spriter-csssprites
    spriter: fis.plugin('csssprites', {
        // 图之间的边距
        margin: 5,
        // 使用矩阵排列方式，默认为线性`linear`
        layout: 'matrix',
        scale: 0.5
    }),
    // https://github.com/fex-team/fis3-packager-deps-pack
    packager: fis.plugin('deps-pack', {
        useTrack: false,// 是否输出路径信息,默认为 true
        'pkg/npm.js': [
            'node_modules/**.js'  // node_modules的模块一般都不变的，所以独立打包
        ]
    }),
    // https://github.com/fex-team/fis3-postpackager-loader
    postpackager: fis.plugin('loader', {
        resourceType: 'mod',
        useInlineMap: true,
        allInOne: {
            js: function (file) {
                return "/pkg/js/" + file.filename + "_aio.js";
            },
            css: function (file) {
                return "/pkg/css/" + file.filename + "_aio.css";
            }
        }
    })
})