![OrgChart](http://dabeng.github.io/OrgChart.js/img/orgchart-heading.png)

# [Perhaps you'd prefer the jQuery version](http://github.com/dabeng/OrgChart)
# [Perhaps you'd prefer the Web Components version](http://github.com/dabeng/OrgChart-Webcomponents)

## Foreword
- First of all, thanks a lot for [wesnolte](https://github.com/wesnolte)'s great work:blush: -- [jOrgChart](https://github.com/wesnolte/jOrgChart). The thought that using nested tables to build out the tree-like orgonization chart is amazing. This idea is more simple and direct than its counterparts based on svg.
- Unfortunately, it's long time not to see the update of jOrgChart. on the other hand, I got some interesting ideas to add, so I choose to create a new repo.
- Font Awesome provides us with administration icon, second level menu icon and loading spinner.

## Features
- Supports both local data and remote data (JSON).
- Smooth expand/collapse effects based on CSS3 transitions.
- Align the chart in 4 orientations.
- Allows user to change orgchart structure by drag/drop nodes.
- Allows user to edit orgchart dynamically and save the final hierarchy as a JSON object.
- Supports exporting chart as a picture.
- Supports pan and zoom
- Users can adopt multiple solutions to build up a huge organization chart(please refer to multiple-layers or hybrid layout sections)
- touch-enabled plugin for mobile divice

## Getting started
### Build
    npm install
    gulp build
### Serve
    gulp serve
Now, you can try out all the demos on http://localhost:3000.

**Note**: your nodejs version should be 4+.

## Demo
- **[using ul datasource](http://dabeng.github.io/OrgChart.js/ul-datasource/)**(this feature comes from [Tobyee's good idea:blush:](https://github.com/dabeng/OrgChart/issues/1))
```html
<!-- wrap the text node with <a href="#"> , <span>, blabla is also OK. Note:text node must immediately follow the <li> tag, with no intervening characters of any kind.  -->
<ul id="ul-data">
  <li>Lao Lao
    <ul>
      <li>Bo Miao</li>
      <li>Su Miao
        <ul>
          <li>Tie Hua</li>
          <li>Hei Hei
            <ul>
              <li>Pang Pang</li>
              <li>Xiang Xiang</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```
```js
let orgchart = new OrgChart({
  'chartContainer': '#chart-container',
  'data' : '#ul-data'
});
```
![ul datasource](http://dabeng.github.io/OrgChart.js/ul-datasource/snapshot.png)

- **[using local datasource](http://dabeng.github.io/OrgChart.js/local-datasource/)**
```js
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
    { 'name': 'Yu Jie', 'title': 'department manager' },
    { 'name': 'Yu Li', 'title': 'department manager' },
    { 'name': 'Hong Miao', 'title': 'department manager' },
    { 'name': 'Yu Wei', 'title': 'department manager' },
    { 'name': 'Chun Miao', 'title': 'department manager' },
    { 'name': 'Yu Tie', 'title': 'department manager' }
  ]
},
orgchart = new OrgChart({
  'chartContainer': '#chart-container',
  'data' : datascource,
  'depth': 2,
  'nodeContent': 'title'
});
```
![local datasource](http://dabeng.github.io/OrgChart.js/local-datasource/recorder.gif)

- **[I wanna pan&zoom the orgchart](http://dabeng.github.io/OrgChart.js/pan-zoom/)**

![pan & zoom](http://dabeng.github.io/OrgChart.js/pan-zoom/recorder.gif)

- **I wanna align orgchart with different orientation**(this feature comes from [the good idea of fvlima and badulesia :blush:](https://github.com/dabeng/OrgChart/issues/5))

  Top to Bottom -- default direction, as you can see all other examples on this page.

  [Bottom to Top](http://dabeng.github.io/OrgChart.js/direction/bottom2top)
```js
// sample of core source code
let orgchart = new OrgChart({
  'chartContainer': '#chart-container',
  'data' : datascource,
  'nodeContent': 'title',
  'direction': 'b2t'
});
```
![Bottom to Top](http://dabeng.github.io/OrgChart.js/direction/b2t.png)

  [Left to Right](http://dabeng.github.io/OrgChart.js/direction/left2right)
```js
// sample of core source code
let orgchart = new OrgChart({
  'chartContainer': '#chart-container',
  'data' : datascource,
  'nodeContent': 'title',
  'direction': 'l2r'
});
```
![Left to Right](http://dabeng.github.io/OrgChart.js/direction/l2r.png)

  [Right to Left](http://dabeng.github.io/OrgChart.js/direction/right2left)
```js
// sample of core source code
let orgchart = new OrgChart({
  'chartContainer': '#chart-container',
  'data' : datascource,
  'nodeContent': 'title',
  'direction': 'r2l'
});
```
![Right to Left](http://dabeng.github.io/OrgChart.js/direction/r2l.png)

- **[I wanna show/hide left/right sibling nodes respectively by clicking left/right arrow](http://dabeng.github.io/OrgChart.js/toggle-sibs-resp/)**
```js
// sample of core source code
let orgchart = new OrgChart({
  'chartContainer': '#chart-container',
  'data' : datascource,
  'nodeContent': 'title',
  'toggleSiblingsResp': true
});
```
![toggle siblings respectively](http://dabeng.github.io/OrgChart.js/toggle-sibs-resp/recorder.gif)

- **[I wanna load datasource through ajax](http://dabeng.github.io/OrgChart.js/ajax-datasource/)**
```js
// sample of core source code
let orgchart = new OrgChart({
  'chartContainer': '#chart-container',
  'data' : '/orgchart/initdata',
  'depth': 2,
  'nodeContent': 'title'
});
```
![ajax datasource](http://dabeng.github.io/OrgChart.js/ajax-datasource/recorder.gif)

- **[I wanna load data on-demand](http://dabeng.github.io/OrgChart.js/ondemand-loading-data/)**

Note: when users use ajaxURL option to build orghchart, they must use json datasource(both local and remote are OK) and set the relationship property of datasource by themselves. All of these staff are used to generate the correct expanding/collapsing arrows for nodes.
```js
// sample of core source code
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
```
![on-demand loading data](http://dabeng.github.io/OrgChart.js/ondemand-loading-data/recorder.gif)

- **[I wanna customize the structure of node](http://dabeng.github.io/OrgChart.js/option-createNode/)**
```js
// sample of core source code
let orgchart = new OrgChart({
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
```
![option--createNode](http://dabeng.github.io/OrgChart.js/option-createNode/recorder.gif)

- **[I wanna export the organization chart as a picture](http://dabeng.github.io/OrgChart.js/export-orgchart/)**

Here, we need the help from [html2canvas](https://github.com/niklasvh/html2canvas).
```js
// sample of core source code
let orgchart = new OrgChart({
  'chartContainer': '#chart-container',
  'data' : datascource,
  'depth': 2,
  'nodeContent': 'title',
  'exportButton': true,
  'exportFilename': 'MyOrgChart'
});
```
![export orgchart](http://dabeng.github.io/OrgChart.js/export-orgchart/recorder.gif)

- **[I wanna itegrate organization chart with geographic information](http://dabeng.github.io/OrgChart.js/integrate-map/)**

Here, we fall back on [OpenLayers](https://github.com/openlayers/ol3). It's the most aewsome open-source js library for Web GIS you sholdn't miss.
```js
// sample of core source code
let map = new ol.Map({
  layers: [
    new ol.layer.Tile({
      source: new ol.source.Stamen({
        layer: 'watercolor'
      }),
      preload: 4
    }),
    new ol.layer.Tile({
      source: new ol.source.Stamen({
        layer: 'terrain-labels'
      }),
      preload: 1
    })
  ],
  target: 'pageBody',
  view: new ol.View({
    center: ol.proj.transform([-87.6297980, 41.8781140], 'EPSG:4326', 'EPSG:3857'),
    zoom: 10
  })
});

document.body.insertBefore(document.querySelector('#chart-container'), map.getViewport());

let datascource = {
  'name': 'Lao Lao',
  'title': 'President Office',
  'position': [-87.6297980, 41.8781140],
  'children': [
    { 'name': 'Bo Miao', 'title': 'Administration  Dept.', 'position': [-83.0457540, 42.3314270]},
        { 'name': 'Su Miao', 'title': 'R & D Dept.', 'position': [-81.6943610, 41.4993200]},
        { 'name': 'Yu Jie', 'title': 'Product Dept.', 'position': [-71.0588800, 42.3600820]},
        { 'name': 'Yu Li', 'title': 'Legal Dept.', 'position': [-74.0059410, 40.7127840]},
        { 'name': 'Hong Miao', 'title': 'Finance Dept.', 'position': [-80.8431270, 35.2270870]},
        { 'name': 'Yu Wei', 'title': 'Security Dept.', 'position': [-81.6556510, 30.3321840]},
        { 'name': 'Chun Miao', 'title': 'HR Dept. ', 'position': [-81.3792360, 28.5383350]},
        { 'name': 'Yu Tie', 'title': 'Marketing Dept.', 'position': [-80.1917900, 25.7616800] }
  ]
},
orgchart = new OrgChart({
  'chartContainer': '#chart-container',
  'data' : datascource,
  'nodeContent': 'title',
  'createNode': function(node, data) {
    node.addEventListener('click', () => {
      let view = map.getView(),
        duration = 2000,
        start = +new Date(),
        pan = ol.animation.pan({
          'duration': duration,
          'source':  view.getCenter(),
          'start': start
        }),
        bounce = ol.animation.bounce({
          'duration': duration,
          'resolution': 4 * view.getResolution(),
          'start': start
        });

      map.beforeRender(pan, bounce);
      view.setCenter(ol.proj.transform(data.position, 'EPSG:4326', 'EPSG:3857'));
    });
  }
});
```
![integrate map](http://dabeng.github.io/OrgChart.js/integrate-map/recorder.gif)

- **[I wanna edit orgchart](http://dabeng.github.io/OrgChart.js/edit-orgchart/)**

With the help of exposed core methods(addParent(), addSiblings(), addChildren(), removeNodes()) of orgchart plugin, we can finish this task easily.
```js
import OrgChart from '../js/orgchart.min.js';

function addNodes(orgchart) {
  let chartContainer = document.getElementById('chart-container'),
    nodeVals = [];

  Array.from(document.getElementById('new-nodelist').querySelectorAll('.new-node'))
    .forEach(item => {
      let validVal = item.value.trim();
        
      if (validVal) {
        nodeVals.push(validVal);
      }
    });
  let selectedNode = document.getElementById(document.getElementById('selected-node').dataset.node);

  if (!nodeVals.length) {
    alert('Please input value for new node');
    return;
  }
  let nodeType = document.querySelector('input[name="node-type"]:checked');

  if (!nodeType) {
    alert('Please select a node type');
    return;
  }
  if (nodeType.value !== 'parent' && !document.querySelector('.orgchart')) {
    alert('Please creat the root node firstly when you want to build up the orgchart from the scratch');
    return;
  }
  if (nodeType.value !== 'parent' && !selectedNode) {
    alert('Please select one node in orgchart');
    return;
  }

  if (nodeType.value === 'parent') {
    if (!chartContainer.children.length) {// if the original chart has been deleted
      orgchart = new OrgChart({
        'chartContainer': '#chart-container',
        'data' : { 'name': nodeVals[0] },
        'exportButton': true,
        'exportFilename': 'SportsChart',
        'parentNodeSymbol': 'fa-th-large',
        'createNode': function(node, data) {
          node.id = getId();
        }
      });
      orgchart.chart.classList.add('view-state');
    } else {
      orgchart.addParent(chartContainer.querySelector('.node'), { 'name': nodeVals[0], 'Id': getId() });
    }
  } else if (nodeType.value === 'siblings') {
    orgchart.addSiblings(selectedNode, {
      'siblings': nodeVals.map(item => {
        return { 'name': item, 'relationship': '110', 'Id': getId() };
      })
    });
  } else {
    let hasChild = selectedNode.parentNode.colSpan > 1;

    if (!hasChild) {
      let rel = nodeVals.length > 1 ? '110' : '100';

      orgchart.addChildren(selectedNode, {
        'children': nodeVals.map(item => {
          return { 'name': item, 'relationship': rel, 'Id': getId() };
        })
      });
    } else {
      orgchart.addSiblings(closest(selectedNode, el => el.nodeName === 'TABLE').querySelector('.nodes').querySelector('.node'),
        { 'siblings': nodeVals.map(function(item) { return { 'name': item, 'relationship': '110', 'Id': getId() }; })
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  let orgchart,
    datascource = {
      'name': 'Ball game',
      'children': [
        { 'name': 'Football' },
        { 'name': 'Basketball' },
        { 'name': 'Volleyball' }
      ]
    };

  orgchart = new OrgChart({
    'chartContainer': '#chart-container',
    'data' : datascource,
    'exportButton': true,
    'exportFilename': 'SportsChart',
    'parentNodeSymbol': 'fa-th-large',
    'createNode': function(node, data) {
      node.id = getId();
    }
  });

  document.getElementById('btn-add-nodes').addEventListener('click', () => addNodes(orgchart));

});
```
![edit orgchart](http://dabeng.github.io/OrgChart.js/edit-orgchart/recorder.gif)

- **[I wanna drag & drop the nodes of orgchart](http://dabeng.github.io/OrgChart.js/drag-drop/)**

Users are allowed to drag & drop the nodes of orgchart when option "draggable" is assigned to true(**Note**: this feature doesn't work on IE due to its poor support for HTML5 drag & drop API).

![drag & drop](http://dabeng.github.io/OrgChart.js/drag-drop/recorder.gif)

Furthermore, users can make use of option dropCriteria to inject their custom limitations on drag & drop. As shown below, we don't want an manager employee to be under a engineer under no circumstance.
```js
// sample of core source code
let orgchart = new OrgChart({
  'chartContainer': '#chart-container',
  'data' : datascource,
  'nodeContent': 'title',
  'draggable': true,
  'dropCriteria': function(draggedNode, dragZone, dropZone) {
    if(draggedNode.querySelector(':scope > .content').textContent.includes('manager') &&
      dropZone.querySelector(':scope > .content').textContent.includes('engineer')) {
      return false;
    }
    return true;
  }
});
```

- **[I want a method that can decribe the hierarchy of orgchart](http://dabeng.github.io/OrgChart.js/get-hierarchy/)**

That's where getHierarchy() comes in.
```html
<ul id="ul-data">
  <li id="1">Lao Lao
    <ul>
      <li id="2">Bo Miao</li>
      <li id="3">Su Miao
        <ul>
          <li id="4">Tie Hua</li>
          <li id="5">Hei Hei
            <ul>
              <li id="6">Pang Pang</li>
              <li id="7">Xiang Xiang</li>
            </ul>
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```
```js
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
```
![get hierarchy](http://dabeng.github.io/OrgChart.js/get-hierarchy/snapshot.png)

- **[I want a color-coded chart](http://dabeng.github.io/OrgChart.js/color-coded/)**

It's a so easy task, we just need to append id or className property to node data.
```js
let datasource = {
  'name': 'Lao Lao',
  'title': 'general manager',
  'className': 'top-level',
  'children': [
    { 'name': 'Bo Miao', 'title': 'department manager', 'className': 'middle-level',
      'children': [
        { 'name': 'Li Jing', 'title': 'senior engineer', 'className': 'bottom-level' },
        { 'name': 'Li Xin', 'title': 'senior engineer', 'className': 'bottom-level' }
      ]
    }
  };
```
```css
.orgchart .top-level .title {
  background-color: #006699;
}
.orgchart .top-level .content {
  border-color: #006699;
}
.orgchart .middle-level .title {
  background-color: #009933;
}
.orgchart .middle-level .content {
  border-color: #009933;
}
.orgchart .bottom-level .title {
  background-color: #993366;
}
.orgchart .bottom-level .content {
  border-color: #993366;
}
```
![color coded](http://dabeng.github.io/OrgChart.js/color-coded/snapshot.png)

- **[I want a multiple-layers chart](http://dabeng.github.io/OrgChart.js/multiple-layers/)**

In fact, this is a wonderful solution to display a orgchart which includes a huge number of node data.

![multiple layers](http://dabeng.github.io/OrgChart.js/multiple-layers/recorder.gif)

- **[I want a hybrid(horizontal + vertical) chart](http://dabeng.github.io/OrgChart.js/vertical-depth/)**

This feature is inspired by the issues([Aligning Children Vertical](https://github.com/dabeng/OrgChart/issues/46), [Hybrid(horizontal + vertical) OrgChart](https://github.com/dabeng/OrgChart/issues/61)). Thank [mfahadi](https://github.com/mfahadi) and [Destructrix](https://github.com/Destructrix) for their constructive suggestions:blush:

From now on, users never have to worry about how to align a huge of nodes in one screen of browser. The option "verticalDepth" allows users to align child nodes vertically from the given depth.

**Note**: currently, this option is incompatible with many other options or methods, like direction, drag&drop, addChildren(), removeNodes(), getHierarchy() and so on. These conflicts will be solved one by one in the later versions.

```js
let orgchart = new OrgChart({
  'chartContainer': '#chart-container',
  'data' : datascource,
  'nodeContent': 'title',
  'verticalDepth': 3, // From the 3th level of orgchart, nodes will be aligned vertically.
  'depth': 4
});
```
![hybrid layout](http://dabeng.github.io/OrgChart.js/vertical-depth/snapshot.png)

## Usage

### Instantiation Statement
```js
let orgchart = new OrgChart(options);
```

### Structure of Datasource
```js
{
  'id': 'rootNode', // It's a optional property which will be used as id attribute of node
  // and data-parent attribute, which contains the id of the parent node
  'className': 'top-level', // It's a optional property which will be used as className attribute of node.
  'nodeTitlePro': 'Lao Lao',
  'nodeContentPro': 'general manager',
  'relationship': relationshipValue, // Note: when you activate ondemand loading nodes feature,
  // you should use json datsource (local or remote) and set this property.
  // This property implies that whether this node has parent node, siblings nodes or children nodes.
  // relationshipValue is a string composed of three "0/1" identifier.
  // First character stands for wether current node has parent node;
  // Scond character stands for wether current node has siblings nodes;
  // Third character stands for wether current node has children node.
  'children': [ // The property stands for nested nodes. "children" is just default name you can override.
    { 'nodeTitlePro': 'Bo Miao', 'nodeContentPro': 'department manager', 'relationship': '110' },
    { 'nodeTitlePro': 'Su Miao', 'nodeContentPro': 'department manager', 'relationship': '111',
      'children': [
        { 'nodeTitlePro': 'Tie Hua', 'nodeContentPro': 'senior engineer', 'relationship': '110' },
        { 'nodeTitlePro': 'Hei Hei', 'nodeContentPro': 'senior engineer', 'relationship': '110' }
      ]
    },
    { 'nodeTitlePro': 'Yu Jie', 'nodeContentPro': 'department manager', 'relationship': '110' }
  ],
  'otherPro': anyValue
};
```

### Options
<table>
  <thead>
    <tr><th>Name</th><th>Type</th><th>Required</th><th>Default</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr>
      <td>chartContainer</td><td>string</td><td>yes</td><td></td><td>selector usded to query the wrapper element of orgchart. It could be an id or an unique className.</td>
    </tr>
    <tr>
      <td>data</td><td>json or string</td><td>yes</td><td></td><td>datasource usded to build out structure of orgchart. It could be a json object or a string containing the URL to which the ajax request is sent.</td>
    </tr>
    <tr>
      <td>pan</td><td>boolean</td><td>no</td><td>false</td><td>Users could pan the orgchart by mouse drag&drop if they enable this option.</td>
    </tr>
    <tr>
      <td>zoom</td><td>boolean</td><td>no</td><td>false</td><td>Users could zoomin/zoomout the orgchart by mouse wheel if they enable this option.</td>
    </tr>
    <tr>
      <td>direction</td><td>string</td><td>no</td><td>"t2b"</td><td>The available values are t2b(implies "top to bottom", it's default value), b2t(implies "bottom to top"), l2r(implies "left to right"), r2l(implies "right to left").</td>
    </tr>
    <tr>
      <td>verticalDepth</td><td>integer</td><td>no</td><td></td><td>Users can make use of this option to align the nodes vertically from the specified depth.</td>
    </tr>
    <tr>
      <td>toggleSiblingsResp</td><td>boolean</td><td>no</td><td>false</td><td>Once enable this option, users can show/hide left/right sibling nodes respectively by clicking left/right arrow.</td>
    </tr>
    <tr>
      <td>ajaxURL</td><td>json</td><td>no</td><td></td><td>It inclueds four properites -- parent, children, siblings, families(ask for parent node and siblings nodes). As their names imply, different propety provides the URL to which ajax request for different nodes is sent.</td>
    </tr>
    <tr>
      <td>depth</td><td>positive integer</td><td>no</td><td>999</td><td>It indicates the level that at the very beginning orgchart is expanded to.</td>
    </tr>
    <tr>
      <td>nodeTitle</td><td>string</td><td>no</td><td>"name"</td><td>It sets one property of datasource as text content of title section of orgchart node. In fact, users can create a simple orghcart with only nodeTitle option.</td>
    </tr>
    <tr>
      <td>parentNodeSymbol</td><td>string</td><td>no</td><td>"fa-users"</td><td>Using font awesome icon to imply that the node has child nodes.</td>
    </tr>
    <tr>
      <td>nodeContent</td><td>string</td><td>no</td><td></td><td>It sets one property of datasource as text content of content section of orgchart node.</td>
    </tr>
    <tr>
      <td>nodeId</td><td>string</td><td>no</td><td>"id"</td><td>It sets one property of datasource as unique identifier of every orgchart node.</td>
    </tr>
    <tr>
      <td>createNode</td><td>function</td><td>no</td><td></td><td>It's a callback function used to customize every orgchart node. It recieves two parament: "$node" stands for jquery object of single node div; "data" stands for datasource of single node.</td>
    </tr>
    <tr>
      <td>exportButton</td><td>boolean</td><td>no</td><td>false</td><td>It enable the export button for orgchart.</td>
    </tr>
    <tr>
      <td>exportFilename</td><td>string</td><td>no</td><td>"Orgchart"</td><td>It's filename when you export current orgchart as a picture.</td>
    </tr>
    <tr>
      <td>chartClass</td><td>string</td><td>no</td><td>""</td><td>when you wanna instantiate multiple orgcharts on one page, you should add diffent classname to them in order to distinguish them.</td>
    </tr>
    <tr>
      <td>draggable</td><td>boolean</td><td>no</td><td>false</td><td>Users can drag & drop the nodes of orgchart if they enable this option. **Note**: this feature doesn't work on IE due to its poor support for HTML5 drag & drop API.</td>
    </tr>
    <tr>
      <td>dropCriteria</td><td>function</td><td>no</td><td></td><td>Users can construct their own criteria to limit the relationships between dragged node and drop zone. Furtherly, this function accept three arguments(draggedNode, dragZone, dropZone) and just only return boolen values.</td>
    </tr>
  </tbody>
</table>

### Methods
I'm sure that you can grasp the key points of the methods below after you try out demo -- [edit orgchart](http://dabeng.github.io/OrgChart.js/edit-orgchart/).
##### let orgchart = new OrgChart(options);
Embeds an organization chart in designated container. Accepts an options object and you can go through the "options" section to find which options are required.
##### .addParent(root, data)
Adds parent node(actullay it's always root node) for current orgchart.
<table>
  <thead>
    <tr><th>Name</th><th>Type</th><th>Required</th><th>Default</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>root</td><td>dom node</td><td>yes</td><td>root node of designated orgchart</td><td>options used for overriding initial options</td></tr>
    <tr><td>data</td><td>json object</td><td>yes</td><td></td><td>datasource for building root node</td></tr>
  </tbody>
</table>
##### .addSiblings(node, data)
Adds sibling nodes for designated node.
<table>
  <thead>
    <tr><th>Name</th><th>Type</th><th>Required</th><th>Default</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>node</td><td>dom node</td><td>yes</td><td></td><td>we'll add sibling nodes based on this node</td></tr>
    <tr><td>data</td><td>json object</td><td>yes</td><td></td><td>datasource for building sibling nodes</td></tr>
  </tbody>
</table>
##### .addChildren(node, data）
Adds child nodes for designed node.
<table>
  <thead>
    <tr><th>Name</th><th>Type</th><th>Required</th><th>Default</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>node</td><td>dom node</td><td>yes</td><td></td><td>we'll add child nodes based on this node</td></tr>
    <tr><td>data</td><td>json object</td><td>yes</td><td></td><td>datasource for building child nodes</td></tr>
  </tbody>
</table>
##### .removeNodes(node）
Removes the designated node and its descedant nodes.
<table>
  <thead>
    <tr><th>Name</th><th>Type</th><th>Required</th><th>Default</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>node</td><td>dom node</td><td>yes</td><td></td><td>node to be removed</td></tr>
  </tbody>
</table>
##### .getHierarchy()
This method is designed to get the hierarchy relationships of orgchart for further processing. For example, after editing the orgchart, you could send the returned value of this method to server-side and save the new state of orghcart.
##### .hideChildren(node)
This method allows you to hide programatically the children of any specific node(.node element), if it has
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>node</td>
    <td>dom node</td>
    <td>Yes</td>
    <td>None</td>
    <td>It's the desired dom node that we'll hide its children nodes</td>
  </tr>
</table>
##### .showChildren(node)
This method allows you to show programatically the children of any specific node(.node element), if it has
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>node</td>
    <td>dom node</td>
    <td>Yes</td>
    <td>None</td>
    <td>It's the desired dom node that we'll show its children nodes</td>
  </tr>
</table>
##### .hideSiblings(node, direction)
This method allows you to hide programatically the siblings of any specific node(.node element), if it has
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>node</td>
    <td>dom node</td>
    <td>Yes</td>
    <td>None</td>
    <td>It's the desired dom node that we'll hide its siblings nodes</td>
  </tr>
  <tr>
    <td>direction</td>
    <td>string</td>
    <td>No</td>
    <td>None</td>
    <td>Possible values:"left","rigth". Specifies if hide the siblings at left or rigth. If not defined hide both of them.</td>
  </tr>
</table>
##### .showSiblings(node, direction)
This method allows you to show programatically the siblings of any specific node(.node element), if it has
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>node</td>
    <td>dom node</td>
    <td>Yes</td>
    <td>None</td>
    <td>It's the desired dom node that we'll show its siblings nodes</td>
  </tr>
  <tr>
    <td>direction</td>
    <td>string</td>
    <td>No</td>
    <td>None</td>
    <td>Possible values:"left","rigth". Specifies if hide the siblings at left or rigth. If not defined hide both of them.</td>
  </tr>
</table>
##### .getNodeState(node, relation)
This method returns you the display state of the related nodes.
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>node</td>
    <td>dom node</td>
    <td>Yes</td>
    <td>None</td>
    <td>It's the desired dom node that we wanna know its related nodes' display state.</td>
  </tr>
  <tr>
    <td>relation</td>
    <td>String</td>
    <td>Yes</td>
    <td>None</td>
    <td>Possible values: "parent", "children" and "siblings". Specifies the desired relation to return.</td>
  </tr>
</table>
The returning object will have the next structure:
```js
{
  "exists": true|false,  //Indicates if has parent|children|siblings
  "visible":true|false,  //Indicates if the related nodes are visible
}
```
##### .getRelatedNodes(node, relation)
This method returns you the nodes related to the specified node
<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Required</th>
    <th>Default</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>node</td>
    <td>dom node</td>
    <td>Yes</td>
    <td>None</td>
    <td>It's the desired that we wanna get its related nodes</td>
  </tr>
  <tr>
    <td>relation</td>
    <td>String</td>
    <td>Yes</td>
    <td>None</td>
    <td>Possible values: "parent", "children" and "siblings". Specifies the desired relation to return.</td>
  </tr>
</table>

### Events
<table>
  <thead>
    <tr><th>Event Type</th><th>Attached Data</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td>nodedropped.orgchart</td><td>draggedNode, dragZone, dropZone</td><td>The event's handler is where you can place your customized function after node drop over. For more details, please refer to <a target="_blank" href="http://dabeng.github.io/OrgChart.js/drag-drop/">example drag & drop</a>.</td></tr>
  </tbody>
</table>
