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
              { 'name': 'Xiang Xiang', 'title': 'UE engineer' ,
                'children': [
                  { 'name': 'Dan Dan', 'title': 'Intern' },
                  { 'name': 'Zai Zai', 'title': 'Intern',
                    'children': [
                      { 'name': 'Mao Mao', 'title': 'Intern' },
                      { 'name': 'Lv Lv', 'title': 'Intern' }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      },
      { 'name': 'Hong Miao', 'title': 'department manager' },
      { 'name': 'Chun Miao', 'title': 'department manager',
        'children': [
          { 'name': 'Bing Qin', 'title': 'senior engineer' },
          { 'name': 'Yue Yue', 'title': 'senior engineer',
            'children': [
              { 'name': 'Er Yue', 'title': 'engineer' },
              { 'name': 'San Yue', 'title': 'UE engineer' }
            ]
          }
        ]
      }
    ]
  },
  orgchart = new OrgChart({
    'chartContainer': '#chart-container',
    'data' : datascource,
    'nodeContent': 'title',
    'verticalDepth': 3,
    'depth': 4
  });

});