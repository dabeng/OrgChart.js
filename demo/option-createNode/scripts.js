import OrgChart from '../js/orgchart.min.js';

document.addEventListener('DOMContentLoaded', function () {

  let datascource = {
      'id': '1',
      'name': 'Lao Lao',
      'title': 'general manager',
      'children': [
        { 'id': '2', 'name': 'Bo Miao', 'title': 'department manager' },
        { 'id': '3', 'name': 'Su Miao', 'title': 'department manager',
          'children': [
            { 'id': '4', 'name': 'Tie Hua', 'title': 'senior engineer' },
            { 'id': '5', 'name': 'Hei Hei', 'title': 'senior engineer',
              'children': [
                { 'id': '6', 'name': 'Pang Pang', 'title': 'engineer' },
                { 'id': '7', 'name': 'Xiang Xiang', 'title': 'UE engineer' }
              ]
            }
          ]
        },
        { 'id': '8', 'name': 'Yu Jie', 'title': 'department manager' },
        { 'id': '9', 'name': 'Yu Li', 'title': 'department manager' },
        { 'id': '10', 'name': 'Hong Miao', 'title': 'department manager' },
        { 'id': '11', 'name': 'Yu Wei', 'title': 'department manager' },
        { 'id': '12', 'name': 'Chun Miao', 'title': 'department manager' },
        { 'id': '13', 'name': 'Yu Tie', 'title': 'department manager' }
      ]
    },
    orgchart = new OrgChart({
      'chartContainer': '#chart-container',
      'data' : datascource,
      'depth': 2,
      'nodeContent': 'title',
      'nodeID': 'id',
      'createNode': function(node, data) {
        let secondMenuIcon = document.createElement('i'),
          secondMenu = document.createElement('div');

        secondMenuIcon.setAttribute('class', 'fa fa-info-circle second-menu-icon');
        secondMenuIcon.addEventListener('click', (event) => {
          event.target.nextElementSibling.classList.toggle('hidden');
        });
        secondMenu.setAttribute('class', 'second-menu hidden');
        secondMenu.innerHTML = `<img class="avatar" src="../img/avatar/${data.id}.jpg">`;
        node.appendChild(secondMenuIcon)
        node.appendChild(secondMenu);
      }
    });

});
