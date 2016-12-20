import OrgChart from '../js/orgchart.min.js';

document.addEventListener('DOMContentLoaded', function () {

  let datascource = {
    'name': 'Lao Lao',
    'title': 'general manager',
    'children': [
      { 'name': 'Bo Miao', 'title': 'department manager' },
      { 'name': 'Su Miao', 'title': 'department manager',
        'children': [
          { 'name': 'Tie Hua', 'title': 'senior engineer' },
          { 'name': 'Hei Hei', 'title': 'senior engineer',
            'children': [
              { 'name': 'Pang Pang', 'title': 'engineer' },
              { 'name': 'Xiang Xiang', 'title': 'UE engineer' }
            ]
          }
        ]
      },
      { 'name': 'Hong Miao', 'title': 'department manager' },
      { 'name': 'Chun Miao', 'title': 'department manager' }, 
    ]
  },
  orgchart = new OrgChart({
    'chartContainer': '#chart-container',
    'data' : datascource,
    'nodeContent': 'title',
    'toggleSiblingsResp': true
  });

});