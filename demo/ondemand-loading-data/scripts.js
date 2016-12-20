import OrgChart from '../js/orgchart.min.js';

document.addEventListener('DOMContentLoaded', function () {

  Mock.mock('/orgchart/children/3', { 'children': [
      { 'id': '4', 'name': 'Pang Pang', 'title': 'engineer', 'relationship': '110' },
      { 'id': '5', 'name': 'Xiang Xiang', 'title': 'UE engineer', 'relationship': '110'}
    ]});

  Mock.mock('/orgchart/parent/1', { 'id': '6','name': 'Lao Lao', 'title': 'general manager', 'relationship': '001' });

  Mock.mock('/orgchart/siblings/1', { 'siblings': [
      { 'id': '7','name': 'Bo Miao', 'title': 'department engineer', 'relationship': '110' },
      { 'id': '8', 'name': 'Yu Jie', 'title': 'department engineer', 'relationship': '110' },
      { 'id': '9', 'name': 'Yu Li', 'title': 'department engineer', 'relationship': '110' },
      { 'id': '10', 'name': 'Hong Miao', 'title': 'department engineer', 'relationship': '110' },
      { 'id': '11', 'name': 'Yu Wei', 'title': 'department engineer', 'relationship': '110' },
      { 'id': '12', 'name': 'Chun Miao', 'title': 'department engineer', 'relationship': '110' },
      { 'id': '13', 'name': 'Yu Tie', 'title': 'department engineer', 'relationship': '110' }
    ]});

  Mock.mock('/orgchart/families/1', {
      'id': '6',
      'name': 'Lao Lao',
      'title': 'general manager',
      'relationship': '001',
      'children': [
        { 'id': '7','name': 'Bo Miao', 'title': 'department engineer', 'relationship': '110' },
        { 'id': '8', 'name': 'Yu Jie', 'title': 'department engineer', 'relationship': '110' },
        { 'id': '9', 'name': 'Yu Li', 'title': 'department engineer', 'relationship': '110' },
        { 'id': '10', 'name': 'Hong Miao', 'title': 'department engineer', 'relationship': '110' },
        { 'id': '11', 'name': 'Yu Wei', 'title': 'department engineer', 'relationship': '110' },
        { 'id': '12', 'name': 'Chun Miao', 'title': 'department engineer', 'relationship': '110' },
        { 'id': '13', 'name': 'Yu Tie', 'title': 'department engineer', 'relationship': '110' }
      ]
    });

  Mock.setup({ timeout: 1000 });

  let datascource = {
    'id': '1',
    'name': 'Su Miao',
    'title': 'department manager',
    'relationship': '111',
    'children': [
      { 'id': '2','name': 'Tie Hua', 'title': 'senior engineer', 'relationship': '110' },
      { 'id': '3','name': 'Hei Hei', 'title': 'senior engineer', 'relationship': '111' }
    ]
  },
  ajaxURLs = {
    'children': '/orgchart/children/',
    'parent': '/orgchart/parent/',
    'siblings': function(nodeData) {
      return '/orgchart/siblings/' + nodeData.id;
    },
    'families': function(nodeData) {
      return '/orgchart/families/' + nodeData.id;
    }
  },
  orgchart = new OrgChart({
    'chartContainer': '#chart-container',
    'data' : datascource,
    'ajaxURL': ajaxURLs,
    'nodeContent': 'title',
    'nodeId': 'id'
  });

});