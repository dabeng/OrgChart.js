module.exports = {
  entry: {
    'ajax-datasource/bundle': './demo/ajax-datasource/scripts.js',
    'color-coded/bundle': './demo/color-coded/scripts.js',
    'direction/bundle-b2t': './demo/direction/b2t.js',
    'direction/bundle-l2r': './demo/direction/l2r.js',
    'direction/bundle-r2l': './demo/direction/r2l.js',
    'drag-drop/bundle': './demo/drag-drop/scripts.js',
    'edit-orgchart/bundle': './demo/edit-orgchart/scripts.js',
    'export-orgchart/bundle': './demo/export-orgchart/scripts.js',
    'get-hierarchy/bundle': './demo/get-hierarchy/scripts.js',
    'integrate-map/bundle': './demo/integrate-map/scripts.js',
    'local-datasource/bundle': './demo/local-datasource/scripts.js',
    'multiple-layers/bundle': './demo/multiple-layers/scripts.js',
    'ondemand-loading-data/bundle': './demo/ondemand-loading-data/scripts.js',
    'option-createNode/bundle': './demo/option-createNode/scripts.js',
    'pan-zoom/bundle': './demo/pan-zoom/scripts.js',
    'toggle-sibs-resp/bundle': './demo/toggle-sibs-resp/scripts.js',
    'ul-datasource/bundle': './demo/ul-datasource/scripts.js',
    'vertical-depth/bundle': './demo/vertical-depth/scripts.js'
  },
  output: {
    path: './demo/',
    filename: '[name].js'
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
};
