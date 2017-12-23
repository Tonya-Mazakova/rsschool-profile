var webpack =require('webpack');

module.exports = {
    entry : './assets/js/Splash.js',
    output: {
        path:__dirname,
        filename: 'bundle.js'
    },

    resolve:{
        modules: ['js','node_modules']
    },

    watch:true,
    watchOptions:{
        poll:true
    },
    module:{
        loaders:[
                { test: /\.js$/, loader: 'babel-loader', include: __dirname, exclude: /node_modules/ }
          ]}
};

