![OrgChart](http://dabeng.github.io/OrgChart.js/img/orgchart-heading.png)

#### It's a simple and direct organization chart plugin based on native JavaScript(ES6). Anytime you want a tree-like chart, you can turn to OrgChart.

# [Here's the jQuery version, just enjoy it](http://github.com/dabeng/OrgChart) :blush:#

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
