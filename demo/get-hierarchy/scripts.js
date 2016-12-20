import OrgChart from '../js/orgchart.min.js';

document.addEventListener('DOMContentLoaded', function () {

  let orgchart = new OrgChart({
    'chartContainer': '#chart-container',
    'data' : '#ul-data'
  });

  document.querySelector('#btn-export-hier').addEventListener('click', () => {
    if (!document.querySelector('pre')) {
      let pre = document.createElement('pre'), 
        hierarchy = orgchart.getHierarchy();

      pre.innerHTML = JSON.stringify(hierarchy, null, 2);
      document.querySelector('body').insertBefore(pre, document.querySelector('.home-link'));
    }
  });

});
