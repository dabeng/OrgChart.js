module.exports = {
  entry: './demo/local-datasource/scripts.js',
  // entry: {
  //   'ajax-datasource/bundle': './app/ajax-datasource/scripts.js',
  //   'color-coded/bundle': './app/color-coded/scripts.js',
  //   'direction/bundle-b2t': './app/direction/b2t.js',
  //   'direction/bundle-l2r': './app/direction/l2r.js',
  //   'direction/bundle-r2l': './app/direction/r2l.js',
  //   'drag-drop/bundle': './app/drag-drop/scripts.js',
  //   'export-orgchart/bundle': './app/export-orgchart/scripts.js',
  //   'get-hierarchy/bundle': './app/get-hierarchy/scripts.js',
  //   'integrate-map/bundle': './app/integrate-map/scripts.js',
  //   'local-datasource/bundle': './app/local-datasource/scripts.js',
  //   'multiple-layers/bundle': './app/multiple-layers/scripts.js',
  //   'ondemand-loading-data/bundle': './app/ondemand-loading-data/scripts.js',
  //   'option-createNode/bundle': './app/option-createNode/scripts.js',
  //   'pan-zoom/bundle': './app/pan-zoom/scripts.js',
  //   'toggle-sibs-resp/bundle': './app/toggle-sibs-resp/scripts.js',
  //   'ul-datasource/bundle': './app/ul-datasource/scripts.js'
  // },
  output: {
    path: './demo/local-datasource/',
    // filename: '[name].js'
    filename: 'bundle.js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
