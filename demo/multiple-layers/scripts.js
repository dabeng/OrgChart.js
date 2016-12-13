import OrgChart from '../js/orgchart.min.js';

Mock.mock('/orgchart/root-node', {
      'className': 'root-node',
      'name': 'Lao Lao',
      'dept': 'president office',
      'children': [
        { 'name': 'Bo Miao', 'dept': 'product dept' },
        { 'className': 'drill-down asso-rd', 'name': 'Su Miao', 'dept': 'R&D dept' },
        { 'name': 'Hong Miao', 'dept': 'finance dept' },
        { 'name': 'Chun Miao', 'dept': 'HR dept' }
      ]
    });

Mock.mock('/orgchart/asso-rd', {
    'className': 'asso-rd drill-up',
    'name': 'Su Miao',
    'dept': 'R&D dept',
    'children': [
      { 'name': 'Tie Hua', 'dept': 'backend group' },
      { 'className': 'drill-down asso-frontend', 'name': 'Hei Hei', 'dept': 'frontend group' }
    ]
  });

Mock.mock('/orgchart/asso-frontend', {
    'className': 'asso-frontend drill-up',
    'name': 'Hei Hei',
    'dept': 'frontend group',
    'children': [
      { 'name': 'Pang Pang', 'dept': 'frontend group' },
      { 'name': 'Xiang Xiang', 'dept': 'frontend group',
        'children': [
          { 'name': 'Xiao Xiao', 'dept': 'frontend group' },
          { 'name': 'Dan Dan', 'dept': 'frontend group' },
          { 'name': 'Zai Zai', 'dept': 'frontend group' }
        ]
      }
    ]
  });

Mock.setup({ timeout: 1000 });

function closest(el, fn) {
  return el && (fn(el) && el.id !== 'chart-container' ? el : closest(el.parentNode, fn));
}

function initOrgchart(rootClass) {
  let orgchart = new OrgChart({
    'chartContainer': '#chart-container',
    'chartClass': rootClass,
    'data' : '/orgchart/' + rootClass,
    'nodeContent': 'dept',
    'createNode': function(node, data) {
      let chartContainer = document.querySelector('#chart-container');

      if (node.classList.contains('drill-down')) {
        let drillDownIcon = document.createElement('i'),
          assoClass = data.className.match(/asso-\w+/)[0];

        drillDownIcon.setAttribute('class', 'fa fa-arrow-circle-down drill-icon');
        drillDownIcon.addEventListener('click', function() {
          chartContainer.querySelector('.orgchart:not(.hidden)').classList.add('hidden');
          let assoChart = chartContainer.querySelector('.orgchart.' + assoClass);

          if (!assoChart) {
            initOrgchart(assoClass);
          } else {
            assoChart.classList.remove('hidden');
          }
        });
        node.appendChild(drillDownIcon);
      } else if (node.classList.contains('drill-up')) {
        let drillUpIcon = document.createElement('i'),
          assoClass = data.className.match(/asso-\w+/)[0];

        drillUpIcon.setAttribute('class', 'fa fa-arrow-circle-up drill-icon');
        drillUpIcon.addEventListener('click', function() {
          chartContainer.querySelector('.orgchart:not(.hidden)').classList.add('hidden');
          closest(chartContainer.querySelector('.drill-down.' + assoClass), (el) => {
            return el.classList && el.classList.contains('orgchart');
          }).classList.remove('hidden');
        });
        node.appendChild(drillUpIcon);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', function () {

  initOrgchart('root-node');

});