import OrgChart from '../../build/js/orgchart.min.js';

document.addEventListener('DOMContentLoaded', function () {

  let orgchart = new OrgChart({
    'chartContainer': '#chart-container',
    'data' : '#ul-data'
  });

});