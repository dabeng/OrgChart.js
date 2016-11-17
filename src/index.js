export default class OrgChart {
  constructor(options) {
    this._name = 'OrgChart';
    Promise.prototype.finally = function (callback) {
      let P = this.constructor;

      return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => { throw reason; })
      );
    };

    let defaultOptions = {
        'nodeTitle': 'name',
        'nodeId': 'id',
        'toggleSiblingsResp': false,
        'depth': 999,
        'chartClass': '',
        'exportButton': false,
        'exportFilename': 'OrgChart',
        'parentNodeSymbol': 'fa-users',
        'draggable': false,
        'direction': 't2b',
        'pan': false,
        'zoom': false
      },
      opts = Object.assign(defaultOptions, options),
      data = opts.data,
      chart = document.createElement('div'),
      chartContainer = document.querySelector(opts.chartContainer);

    this.options = opts;
    this.chart = chart;
    this.chartContainer = chartContainer;
    chart.dataset.options = JSON.stringify(opts);
    chart.setAttribute('class', 'orgchart' + (opts.chartClass !== '' ? ' ' + opts.chartClass : '') +
      (opts.direction !== 't2b' ? ' ' + opts.direction : ''));
    if (typeof data === 'object') { // local json datasource
      this.buildHierarchy(chart, opts.ajaxURL ? data : this._attachRel(data, '00'), 0, opts);
    } else if (typeof data === 'string' && data.startsWith('#')) { // ul datasource
      this.buildHierarchy(chart, this._buildJsonDS(document.querySelector(data).children[0]), 0, opts);
    } else { // ajax datasource
      let spinner = document.createElement('i');

      spinner.setAttribute('class', 'fa fa-circle-o-notch fa-spin spinner');
      this._getJSON(data)
      .then(function (resp) {
        this.buildHierarchy(chart, opts.ajaxURL ? resp : this._attachRel(resp, '00'), 0, opts);
      })
      .catch(function (err) {
        console.error('failed to fetch datasource for orgchart', err);
      })
      .finally(function () {
        let spinner = chart.querySelector('.spinner');

        spinner.parentNode.removeChild(spinner);
      });
    }
    chart.addEventListener('click', this._clickChart);
    // append the export button to the chart-container
    if (opts.exportButton && !chartContainer.querySelector('.oc-export-btn')) {
      let exportBtn = document.createElement('button'),
        downloadBtn = document.createElement('a');

      exportBtn.setAttribute('class', 'oc-export-btn' + (opts.chartClass !== '' ? ' ' + opts.chartClass : ''));
      exportBtn.innerHTML = 'Export';
      exportBtn.addEventListener('click', this._clickExportButton.bind(this));
      downloadBtn.setAttribute('class', 'oc-download-btn' + (opts.chartClass !== '' ? ' ' + opts.chartClass : ''));
      downloadBtn.setAttribute('download', opts.exportFilename + '.png');
      chartContainer.appendChild(exportBtn);
      chartContainer.appendChild(downloadBtn);
    }

    chartContainer.appendChild(chart);
  }
  get name() {
    return this._name;
  }
  _closest(el, fn) {
    return el && ((fn(el) && el !== this.chart) ? el : this._closest(el.parentNode, fn));
  }
  _siblings(el, expr) {
    return Array.from(el.parentNode.children).filter((child) => {
      if (child !== el) {
        if (expr) {
          return el.matches(expr);
        }
        return true;
      }
      return false;
    });
  }
  _prevAll(el, expr) {
    let sibs = [],
      prevSib = el.previousElementSibling;

    while (prevSib) {
      if (!expr || prevSib.matches(expr)) {
        sibs.push(prevSib);
      }
      prevSib = prevSib.previousElementSibling;
    }
    return sibs;
  }
  _nextAll(el, expr) {
    let sibs = [];
    let nextSib = el.nextElementSibling;

    while (nextSib) {
      if (!expr || nextSib.matches(expr)) {
        sibs.push(nextSib);
      }
      nextSib = nextSib.nextElementSibling;
    }
    return sibs;
  }
  _isVisible(el) {
    return el.offsetParent !== null;
  }
  _addClass(elements, classNames) {
    elements.forEach((el) => {
      if (classNames.indexOf(' ') > 0) {
        classNames.split(' ').forEach((className) => el.classList.add(className));
      } else {
        el.classList.add(classNames);
      }
    });
  }
  _removeClass(elements, classNames) {
    elements.forEach((el) => {
      if (classNames.indexOf(' ') > 0) {
        classNames.split(' ').forEach((className) => el.classList.remove(className));
      } else {
        el.classList.remove(classNames);
      }
    });
  }
  _css(elements, prop, val) {
    elements.forEach((el) => {
      el.style[prop] = val;
    });
  }
  _removeAttr(elements, attr) {
    elements.forEach((el) => {
      el.removeAttribute(attr);
    });
  }
  _one(el, type, listener, self) {
    let one = function (event) {
      try {
        listener.call(self, event);
      } finally {
        el.removeEventListener(type, one);
      }
    };

    el.addEventListener(type, one);
  }
  _getJSON(url) {
    return new Promise(function (resolve, reject) {
      let client = new XMLHttpRequest();

      function handler() {
        if (this.readyState !== 4) {
          return;
        }
        if (this.status === 200) {
          resolve(this.response);
        } else {
          reject(new Error(this.statusText));
        }
      }
      client.open('GET', url);
      client.onreadystatechange = handler;
      client.responseType = 'json';
      client.setRequestHeader('Accept', 'application/json');
      client.send();
    });
  }
  _buildJsonDS(li) {
    var subObj = {
      'name': li.firstChild.textContent.trim(),
      'relationship': (li.parentNode.parentNode.tagName === 'li' ? '1' : '0') +
        (li.parentNode.children > 1 ? 1 : 0) + (li.children.length ? 1 : 0)
    };

    if (li.id) {
      subObj.id = li.id;
    }
    if (li.querySelector('ul')) {
      Array.from(li.querySelector('ul').children).forEach((el) => {
        if (!subObj.children) { subObj.children = []; }
        subObj.children.push(this._buildJsonDS(el));
      });
    }
    return subObj;
  }
  _attachRel(data, flags) {
    data.relationship = flags + (data.children && data.children.length > 0 ? 1 : 0);
    if (data.children) {
      for (let item of data.children) {
        this._attachRel(item, '1' + (data.children.length > 1 ? 1 : 0));
      }
    }
    return data;
  }
  _repaint(node) {
    if (node) {
      node.style.offsetWidth = node.offsetWidth;
    }
  }
  // whether the cursor is hovering over the node
  _isInAction(node) {
    return node.querySelector(':scope > .edge').className.indexOf('fa-') > -1;
  }
  // detect the exist/display state of related node
  _getNodeState(node, relation) {
    let criteria,
      state = { 'exist': false, 'visible': false };

    if (relation === 'parent') {
      criteria = this._closest(node, (el) => el.classList && el.classList.contains('nodes'));
      if (criteria) {
        state.exist = true;
      }
      if (state.exist && this._isVisible(criteria.previousElementSibling)) {
        state.visible = true;
      }
    } else if (relation === 'children') {
      criteria = this._closest(node, (el) => el.nodeName === 'TR').nextElementSibling;
      if (criteria) {
        state.exist = true;
      }
      if (state.exist && this._isVisible(criteria)) {
        state.visible = true;
      }
    } else if (relation === 'siblings') {
      criteria = this._siblings(this._closest(node, (el) => el.nodeName === 'TABLE').parentNode);
      if (criteria.length) {
        state.exist = true;
      }
      if (state.exist && criteria.some((el) => this._isVisible(el))) {
        state.visible = true;
      }
    }

    return state;
  }
  // find the related nodes
  getRelatedNodes(node, relation) {
    if (relation === 'parent') {
      return this._closest(node, (el) => el.classList.contains('nodes'))
        .parentNode.children[0].querySelector('.node');
    } else if (relation === 'children') {
      return Array.from(this._closest(node, (el) => el.nodeName === 'TABLE').lastChild.children)
        .map((el) => el.querySelector('.node'));
    } else if (relation === 'siblings') {
      return this._siblings(this._closest(node, (el) => el.nodeName === 'TABLE').parentNode)
        .map((el) => el.querySelector('.node'));
    }
  }
  _switchHorizontalArrow(node) {
    let opts = this.options,
      leftEdge = node.querySelector('.leftEdge'),
      rightEdge = node.querySelector('.rightEdge'),
      temp = this._closest(node, (el) => el.nodeName === 'TABLE').parentNode;

    if (opts.toggleSiblingsResp && (typeof opts.ajaxURL === 'undefined' ||
      this._closest(node, (el) => el.classList.contains('.nodes')).dataset.siblingsLoaded)) {
      let prevSib = temp.previousElementSibling,
        nextSib = temp.nextElementSibling;

      if (prevSib) {
        if (prevSib.classList.contains('hidden')) {
          leftEdge.classList.add('fa-chevron-left');
          leftEdge.classList.remove('fa-chevron-right');
        } else {
          leftEdge.classList.add('fa-chevron-right');
          leftEdge.classList.remove('fa-chevron-left');
        }
      }
      if (nextSib) {
        if (nextSib.classList.contains('hidden')) {
          rightEdge.classList.add('fa-chevron-right');
          rightEdge.classList.remove('fa-chevron-left');
        } else {
          rightEdge.classList.add('fa-chevron-left');
          rightEdge.classList.remove('fa-chevron-right');
        }
      }
    } else {
      let sibs = this._siblings(temp),
        sibsVisible = sibs.length ? !sibs.some((el) => el.classList.contains('hidden')) : false;

      leftEdge.classList.toggle('fa-chevron-right', sibsVisible);
      leftEdge.classList.toggle('fa-chevron-left', !sibsVisible);
      rightEdge.classList.toggle('fa-chevron-left', sibsVisible);
      rightEdge.classList.toggle('fa-chevron-right', !sibsVisible);
    }
  }
  _hoverNode(event) {
    let node = event.target,
      flag = false,
      topEdge = node.querySelector(':scope > .topEdge'),
      bottomEdge = node.querySelector(':scope > .bottomEdge'),
      leftEdge = node.querySelector(':scope > .leftEdge');

    if (event.type === 'mouseenter') {
      if (topEdge) {
        flag = this._getNodeState(node, 'parent').visible;
        topEdge.classList.toggle('fa-chevron-up', !flag);
        topEdge.classList.toggle('fa-chevron-down', flag);
      }
      if (bottomEdge) {
        flag = this._getNodeState(node, 'children').visible;
        bottomEdge.classList.toggle('fa-chevron-down', !flag);
        bottomEdge.classList.toggle('fa-chevron-up', flag);
      }
      if (leftEdge) {
        this._switchHorizontalArrow(node);
      }
    } else {
      Array.from(node.querySelectorAll(':scope > .edge')).forEach((el) => {
        el.classList.remove('fa-chevron-up', 'fa-chevron-down', 'fa-chevron-right', 'fa-chevron-left');
      });
    }
  }
  // define node click event handler
  _clickNode(event) {
    let node = event.target;

    this.chart.querySelector('.focused').classList.remove('focused');
    node.classList.add('focused');
  }
  // build the parent node of specific node
  _buildParentNode(currentRoot, nodeData, opts, callback) {
    let table = document.createElement('table');

    nodeData.relationship = '001';
    this._createNode(nodeData, 0, opts || this.options)
      .then(function (nodeDiv) {
        let chart = this.chart;

        nodeDiv.classList.remove('slide-up');
        nodeDiv.classList.add('slide-down');
        table.innerHTML = `
          <tr class="hidden"><td colspan="2"></td></tr>
          <tr class="lines hidden"><td colspan="2"><div class="downLine"></div></td></tr>
          <tr class="lines hidden"><td class="rightLine">&nbsp;</td><td class="leftLine">&nbsp;</td></tr>
          <tr class="nodes"><td colspan="2"></td></tr>
        `;
        table.firstChild.firstChild.appendChild(nodeDiv);
        chart.insertBefore(table, chart.firstChild);
        table.lastChild.firstChild.appendChild(chart.lastChild);
        callback();
      })
      .catch(function (err) {
        console.error('Failed to create parent node', err);
      });
  }
  _switchVerticalArrow(arrow) {
    arrow.classList.toggle('fa-chevron-up');
    arrow.classList.toggle('fa-chevron-down');
  }
  // show the parent node of the specified node
  showParent(node) {
    // just show only one superior level
    let temp = this._prevAll(this._closest(node, (el) => el.classList.contains('nodes')));

    this._removeClass(temp, 'hidden');
    // just show only one line
    this._addClass(Array(temp[0].children).slice(1, -1), 'hidden');
    // show parent node with animation
    let parent = temp[2].querySelector('.node');

    this._one(parent, 'transitionend', function () {
      parent.classList.remove('slide');
      if (this._isInAction(node)) {
        this._switchVerticalArrow(node.querySelector(':scope > .topEdge'));
      }
    }, this);
    this._repaint(parent);
    parent.classList.add('slide');
    parent.classList.remove('slide-down');
  }
  // show the sibling nodes of the specified node
  showSiblings(node, direction) {
    // firstly, show the sibling td tags
    let siblings = [],
      temp = this._closest(node, (el) => el.nodeName === 'TABLE').parentNode;

    if (direction) {
      siblings = direction === 'left' ? this._prevAll(temp) : this._nextAll(temp);
    } else {
      siblings = this._siblings(temp);
    }
    this._removeClass(siblings, 'hidden');
    // secondly, show the lines
    let upperLevel = this._prevAll(this._closest(node, (el) => el.classList.contains('nodes')));

    temp = Array.from(upperLevel[0].querySelectorAll(':scope > .hidden'));
    if (direction) {
      this._removeClass(temp.slice(0, siblings.length * 2), 'hidden');
    } else {
      this._removeClass(temp, 'hidden');
    }
    // thirdly, do some cleaning stuff
    if (!this._getNodeState(node, 'parent').visible) {
      this._removeClass(upperLevel, 'hidden');
      let parent = upperLevel[2].querySelector('.node');

      this._one(parent, 'transitionend', function (event) {
        event.target.classList.remove('slide');
      }, this);
      this._repaint(parent);
      parent.classList.add('slide');
      parent.classList.remove('slide-down');
    }
    // lastly, show the sibling nodes with animation
    siblings.forEach((sib) => {
      Array.from(sib.querySelectorAll('.node')).forEach((node) => {
        if (this._isVisible(node)) {
          node.classList.add('slide');
          node.classList.remove('slide-left', 'slide-right');
        }
      });
    });
    this._one(siblings[0].querySelector('.slide'), 'transitionend', function () {
      siblings.forEach((sib) => {
        this._removeClass(Array.from(sib.querySelectorAll('.slide')), 'slide');
      });
      if (this._isInAction(node)) {
        this._switchHorizontalArrow(node);
        node.querySelector('.topEdge').classList.remove('fa-chevron-up');
        node.querySelector('.topEdge').classList.add('fa-chevron-down');
      }
    }, this);
  }
  // hide the sibling nodes of the specified node
  hideSiblings(node, direction) {
    let nodeContainer = this._closest(node, (el) => el.nodeName === 'TABLE').parentNode,
      siblings = this._siblings(nodeContainer);

    siblings.forEach((sib) => {
      if (sib.querySelector('.spinner')) {
        this.chart.dataset.inAjax = false;
      }
    });

    if (!direction || (direction && direction === 'left')) {
      let preSibs = this._prevAll(nodeContainer);

      preSibs.forEach((sib) => {
        Array.from(sib.querySelectorAll('.node')).forEach((node) => {
          if (this._isVisible(node)) {
            node.classList.add('slide', 'slide-right');
          }
        });
      });
    }
    if (!direction || (direction && direction !== 'left')) {
      let nextSibs = this._nextAll(nodeContainer);

      nextSibs.forEach((sib) => {
        Array.from(sib.querySelectorAll('.node')).forEach((node) => {
          if (this._isVisible(node)) {
            node.classList.add('slide', 'slide-left');
          }
        });
      });
    }

    let animatedNodes = [];

    this._siblings(nodeContainer).forEach((sib) => {
      Array.prototype.push.apply(animatedNodes, Array.from(sib.querySelectorAll('.slide')));
    });
    let lines = [];

    for (let node of animatedNodes) {
      let temp = this._closest(node, function (el) {
        return el.classList.contains('nodes');
      }).previousElementSibling;

      lines.push(temp);
      lines.push(temp.previousElementSibling);
    }
    lines = [...new Set(lines)];
    lines.forEach(function (line) {
      line.style.visibility = 'hidden';
    });

    this._one(animatedNodes[0], 'transitionend', function (event) {
      lines.forEach(function (line) {
        line.removeAttribute('style');
      });
      let sibs = [];

      if (direction) {
        if (direction === 'left') {
          sibs = this._prevAll(nodeContainer, ':not(.hidden)');
        } else {
          sibs = this._nextAll(nodeContainer, ':not(.hidden)');
        }
      } else {
        sibs = this._siblings(nodeContainer);
      }
      let temp = Array.from(this._closest(nodeContainer, function (el) {
        return el.classList.contains('nodes');
      }).previousElementSibling.querySelectorAll(':scope > :not(.hidden)'));

      let someLines = temp.slice(1, direction ? sibs.length * 2 + 1 : -1);

      this._addClass(someLines, 'hidden');
      this._removeClass(animatedNodes, 'slide');
      sibs.forEach((sib) => {
        Array.from(sib.querySelectorAll('.node')).slice(1).forEach((node) => {
          if (this._isVisible(node)) {
            node.classList.remove('slide-left', 'slide-right');
            node.classList.add('slide-up');
          }
        });
      });
      sibs.forEach((sib) => {
        this._addClass(Array.from(sib.querySelectorAll('.lines')), 'hidden');
        this._addClass(Array.from(sib.querySelectorAll('.nodes')), 'hidden');
        this._addClass(Array.from(sib.querySelectorAll('.verticalNodes')), 'hidden');
      });
      this._addClass(sibs, 'hidden');

      if (this._isInAction(node)) {
        this._switchHorizontalArrow(node);
      }
    }, this);
  }
  // recursively hide the ancestor node and sibling nodes of the specified node
  hideAncestorsSiblings(node) {
    let temp = Array.from(this._closest(node, function (el) {
      return el.classList.contains('nodes');
    }).parentNode.children).slice(0, 3);

    if (temp[0].querySelector('.spinner')) {
      this.chart.dataset.inAjax = false;
    }
    // hide the sibling nodes
    if (this._getNodeState(node, 'siblings').visible) {
      this.hideSiblings(node);
    }
    // hide the lines
    let lines = temp.slice(1);

    this._css(lines, 'visibility', 'hidden');
    // hide the superior nodes with transition
    let parent = temp[0].querySelector('.node'),
      grandfatherVisible = this._getNodeState(parent, 'parent').visible;

    if (parent && this._isVisible(parent)) {
      parent.classList.add('slide', 'slide-down');
      this._one(parent, 'transitionend', function () {
        parent.classList.remove('slide');
        this._removeAttr(lines, 'style');
        this._addClass(temp, 'hidden');
      }, this);
    }
    // if the current node has the parent node, hide it recursively
    if (parent && grandfatherVisible) {
      this.hideAncestorsSiblings(parent);
    }
  }
  // exposed method
  addParent(currentRoot, data, opts) {
    this._buildParentNode(currentRoot, data, opts, function () {
      if (!currentRoot.querySelector(':scope .topEdge').length) {
        let topEdge = document.createElement('i');

        topEdge.setAttribute('class', 'edge verticalEdge topEdge fa');
        currentRoot.appendChild(topEdge);
      }
      this.showParent(currentRoot);
    });
  }
  // define click event handler for the top edge
  _clickTopEdge(event) {
    event.stopPropagation();
    let topEdge = event.target,
      node = topEdge.parentNode,
      parentState = this._getNodeState(node, 'parent'),
      opts = this.options;

    if (parentState.exist) {
      let temp = this._closest(node, function (el) {
        return el.classList.contains('nodes');
      });
      let parent = temp.parentNode.firstChild.querySelector('.node');

      if (parent.classList.contains('slide')) { return; }
      // hide the ancestor nodes and sibling nodes of the specified node
      if (parentState.visible) {
        this.hideAncestorsSiblings(node);
        this._one(parent, 'transitionend', function () {
          if (this._isInAction(node)) {
            this._switchVerticalArrow(topEdge);
            this._switchHorizontalArrow(node);
          }
        }, this);
      } else { // show the ancestors and siblings
        this.showParent(node);
      }
    } else {
      // load the new parent node of the specified node by ajax request
      let nodeId = topEdge.parentNode.id;

      // start up loading status
      if (this._startLoading(topEdge, node, opts)) {
        // load new nodes
        this._getJSON(typeof opts.ajaxURL.parent === 'function' ?
          opts.ajaxURL.parent(node.dataset.source) : opts.ajaxURL.parent + nodeId)
        .then(function (resp) {
          if (this.chart.dataset.inAjax) {
            if (!Object.keys(resp).length) {
              this.addParent(node, resp, opts);
            }
          }
        })
        .catch(function (err) {
          console.error('Failed to get parent node data.', err);
        })
        .finally(function () {
          this._endLoading(topEdge, node, opts);
        });
      }
    }
  }
  // recursively hide the descendant nodes of the specified node
  hideDescendants(node) {
    let that = this,
      temp = this._nextAll(node.parentNode.parentNode),
      lines = [];

    if (temp[2].querySelector('.spinner')) {
      this.chart.dataset.inAjax = false;
    }
    let descendants = Array.from(temp[2].querySelectorAll('.node')).filter((el) => that._isVisible(el)),
      isVerticalDesc = temp[2].classList.contains('verticalNodes');

    if (!isVerticalDesc) {
      descendants.forEach((desc) => {
        Array.prototype.push.apply(lines,
          that._prevAll(that._closest(desc, (el) => el.classList.contains('nodes')), '.lines'));
      });
      lines = [...new Set(lines)];
      this._css(lines, 'visibility', 'hidden');
    }
    this._one(descendants[0], 'transitionend', function (event) {
      this._removeClass(descendants, 'slide');
      if (isVerticalDesc) {
        that._addClass(temp, 'hidden');
      } else {
        lines.forEach((el) => {
          el.removeAttribute('style');
          el.classList.add('hidden');
          el.parentNode.lastChild.classList.add('hidden');
        });
        this._addClass(Array.from(temp[2].querySelectorAll('.verticalNodes')), 'hidden');
      }
      if (this._isInAction(node)) {
        this._switchVerticalArrow(node.querySelector('.bottomEdge'));
      }
    }, this);
    this._addClass(descendants, 'slide slide-up');
  }
  // show the children nodes of the specified node
  showDescendants(node) {
    let that = this,
      temp = this._nextAll(node.parentNode.parentNode),
      descendants = [];

    this._removeClass(temp, 'hidden');
    if (temp.some((el) => el.classList.contains('verticalNodes'))) {
      temp.forEach((el) => {
        Array.prototype.push.apply(descendants, Array.from(el.querySelectorAll('.node')).filter((el) => {
          return that._isVisible(el);
        }));
      });
    } else {
      Array.from(temp[2].children).forEach((el) => {
        Array.prototype.push.apply(descendants,
          Array.from(el.querySelector('tr').querySelectorAll('.node')).filter((el) => {
            return that._isVisible(el);
          }));
      });
    }
    // the two following statements are used to enforce browser to repaint
    this._repaint(descendants[0]);
    this._one(descendants[0], 'transitionend', (event) => {
      this._removeClass(descendants, 'slide');
      if (this._isInAction(node)) {
        this._switchVerticalArrow(node.querySelector('.bottomEdge'));
      }
    }, this);
    this._addClass(descendants, 'slide');
    this._removeClass(descendants, 'slide-up');
  }
  // exposed method
  addChildren(node, data, opts) {
    if (!opts) {
      opts = this.options;
    }
    let count = 0;

    this._buildChildNode(this._closest(node, (el) => el.nodeName === 'TABLE'), data, opts, function () {
      if (++count === data.children.length) {
        if (!node.querySelector('.bottomEdge')) {
          let bottomEdge = document.createElement('i');

          bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
          node.appendChild(bottomEdge);
        }
        if (!node.querySelector('.symbol')) {
          let symbol = document.createElement('i');

          symbol.setAttribute('class', 'fa ' + opts.parentNodeSymbol + ' symbol');
          node.querySelector(':scope > .title').appendChild(symbol);
        }
        this.showDescendants(node);
      }
    });
  }
  // bind click event handler for the bottom edge
  _clickBottomEdge(event) {
    event.stopPropagation();
    let opts = this.options,
      bottomEdge = event.target,
      node = bottomEdge.parentNode,
      childrenState = this._getNodeState(node, 'children');

    if (childrenState.exist) {
      let temp = this._closest(node, function (el) {
        return el.nodeName === 'TR';
      }).parentNode.children[3];

      if (Array.from(temp.querySelectorAll('.node')).some((node) => {
        return this._isVisible(node) && node.classList.contains('slide');
      })) { return; }
      // hide the descendant nodes of the specified node
      if (childrenState.visible) {
        this.hideDescendants(node);
      } else { // show the descendants
        this.showDescendants(node);
      }
    } else { // load the new children nodes of the specified node by ajax request
      let nodeId = bottomEdge.parentNode.id;

      if (this._startLoading(bottomEdge, node, opts)) {
        this._getJSON(typeof opts.ajaxURL.children === 'function' ?
          opts.ajaxURL.children(node.dataset.source) : opts.ajaxURL.children + nodeId)
        .then(function (resp) {
          if (this.chart.dataset.inAjax) {
            if (resp.children.length) {
              this.addChildren(node, resp, Object.assign({}, opts, { depth: 0 }));
            }
          }
        })
        .catch(function (err) {
          console.error('Failed to get children nodes data', err);
        })
        .finally(function () {
          this._endLoading(bottomEdge, node, opts);
        });
      }
    }
  }
  // bind click event handler for the left and right edges
  _clickHorizontalEdge(event) {
    event.stopPropagation();
    let opts = this.options,
      hEdge = event.target,
      node = hEdge.parentNode,
      siblingsState = this._getNodeState(node, 'siblings');

    if (siblingsState.exist) {
      let temp = this._closest(node, function (el) {
          return el.nodeName === 'TABLE';
        }).parentNode,
        siblings = this._siblings(temp);

      if (siblings.some((el) => {
        let node = el.querySelector('.node');

        return this._isVisible(node) && node.classList.contains('slide');
      })) { return; }
      if (opts.toggleSiblingsResp) {
        let prevSib = this._closest(node, (el) => el.nodeName === 'TABLE').parentNode.previousElementSibling,
          nextSib = this._closest(node, (el) => el.nodeName === 'TABLE').parentNode.nextElementSibling;

        if (hEdge.classList.contains('.leftEdge')) {
          if (prevSib.classList.contains('.hidden')) {
            this.showSiblings(node, 'left');
          } else {
            this.hideSiblings(node, 'left');
          }
        } else {
          if (nextSib.classList.contains('.hidden')) {
            this.showSiblings(node, 'right');
          } else {
            this.hideSiblings(node, 'right');
          }
        }
      } else {
        if (siblingsState.visible) {
          this.hideSiblings(node);
        } else {
          this.showSiblings(node);
        }
      }
    } else {
      // load the new sibling nodes of the specified node by ajax request
      let nodeId = hEdge.parentNode.id,
        url = (this._getNodeState(node, 'parent').exist) ?
          (typeof opts.ajaxURL.siblings === 'function' ?
            opts.ajaxURL.siblings(node.dataset.source) : opts.ajaxURL.siblings + nodeId) :
          (typeof opts.ajaxURL.families === 'function' ?
            opts.ajaxURL.families(node.dataset.source) : opts.ajaxURL.families + nodeId);

      if (this._startLoading(hEdge, node, opts)) {
        this._getJSON(url)
        .then(function (resp) {
          if (this.chart.dataset.inAjax) {
            if (resp.siblings || resp.children) {
              this.addSiblings(node, resp, opts);
            }
          }
        })
        .catch(function (err) {
          console.err('Failed to get sibling nodes data', err);
        })
        .finally(function () {
          this._endLoading(hEdge, node, opts);
        });
      }
    }
  }
  // event handler for toggle buttons in Hybrid(horizontal + vertical) OrgChart
  _clickToggleButton(event) {
    let that = this,
      toggleBtn = event.target,
      descWrapper = toggleBtn.parentNode.nextElementSibling,
      descendants = descWrapper.querySelectorAll('.node'),
      children = descWrapper.children.map(function (item) {
        return item.querySelector('.node');
      });

    if (children.some((item) => item.classList.contains('.slide'))) { return; }
    toggleBtn.classList.toggle('fa-plus-square');
    toggleBtn.classList.toggle('fa-minus-square');
    if (descendants[0].classList.contains('.slide-up')) {
      descWrapper.classList.remove('hidden');
      this._repaint(children[0]);
      this._addClass(children, 'slide');
      this._removeClass(children, 'slide-up');
      children[0].addEventListener('transitionend', function () {
        that._removeClass(children, 'slide');
      }, { 'once': true });
    } else {
      this._addClass(descendants, 'slide slide-up');
      descendants[0].addEventListener('transitionend', function () {
        that._removeClass(descendants, 'slide');
        let ul = this._closest(descendants[0], function (el) {
          return el.nodeName === 'ul';
        });

        ul.classList.add('hidden');
      }, { 'once': true });
      let subToggleBtn = descendants[0].querySelector('.toggleBtn').classList.remove('fa-minus-square');

      subToggleBtn.classList.add('fa-plus-square');
    }
  }
  _dispatchClickEvent(event) {
    let classList = event.target.classList;

    if (classList.contains('topEdge')) {
      this._clickTopEdge(event);
    } else if (classList.contains('rightEdge') || classList.contains('leftEdge')) {
      this._clickHorizontalEdge(event);
    } else if (classList.contains('bottomEdge')) {
      this._clickBottomEdge(event);
    } else if (classList.contains('toggleBtn')) {
      this._clickToggleButton(event);
    } else {
      this._clickNode(event);
    }
  }
  _onDragStart(event) {
    let nodeDiv = event.target,
      opts = this.options,
      isFirefox = /firefox/.test(window.navigator.userAgent.toLowerCase());

    if (isFirefox) {
      event.dataTransfer.setData('text/html', 'hack for firefox');
    }
    // if users enable zoom or direction options
    if (this.chart.style.transform) {
      let ghostNode, nodeCover;

      if (!document.querySelector('.ghost-node')) {
        ghostNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        ghostNode.classList.add('ghost-node');
        nodeCover = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        ghostNode.appendChild(nodeCover);
        this.chart.appendChild(ghostNode);
      } else {
        ghostNode = this.chart.querySelector(':scope > .ghost-node');
        nodeCover = ghostNode.children[0];
      }
      let transValues = this.chart.style.transform.split(','),
        scale = Math.abs(window.parseFloat((opts.direction === 't2b' || opts.direction === 'b2t') ?
          transValues[0].slice(transValues[0].indexOf('(') + 1) : transValues[1]));

      ghostNode.setAttribute('width', nodeDiv.offsetWidth);
      ghostNode.setAttribute('height', nodeDiv.offsetHeight);
      nodeCover.setAttribute('x', 5 * scale);
      nodeCover.setAttribute('y', 5 * scale);
      nodeCover.setAttribute('width', 120 * scale);
      nodeCover.setAttribute('height', 40 * scale);
      nodeCover.setAttribute('rx', 4 * scale);
      nodeCover.setAttribute('ry', 4 * scale);
      nodeCover.setAttribute('stroke-width', 1 * scale);
      let xOffset = event.offsetX * scale,
        yOffset = event.offsetY * scale;

      if (opts.direction === 'l2r') {
        xOffset = event.offsetY * scale;
        yOffset = event.offsetX * scale;
      } else if (opts.direction === 'r2l') {
        xOffset = nodeDiv.offsetWidth - event.offsetY * scale;
        yOffset = event.offsetX * scale;
      } else if (opts.direction === 'b2t') {
        xOffset = nodeDiv.offsetWidth - event.offsetX * scale;
        yOffset = nodeDiv.offsetHeight - event.offsetY * scale;
      }
      if (isFirefox) { // hack for old version of Firefox(< 48.0)
        let ghostNodeWrapper = document.createElement('img');

        ghostNodeWrapper.src = 'data:image/svg+xml;utf8,' + (new XMLSerializer()).serializeToString(ghostNode);
        event.dataTransfer.setDragImage(ghostNodeWrapper, xOffset, yOffset);
        nodeCover.setAttribute('fill', 'rgb(255, 255, 255)');
        nodeCover.setAttribute('stroke', 'rgb(191, 0, 0)');
      } else {
        event.dataTransfer.setDragImage(ghostNode, xOffset, yOffset);
      }
    }
    let dragged = event.target,
      dragZone = this._closest(dragged, (el) => {
        return el.classList && el.classList.contains('nodes');
      }).parentNode.children[0].querySelector('.node'),
      dragHier = Array.from(this._closest(dragged, (el) => {
        return el.nodeName === 'TABLE';
      }).querySelectorAll('.node'));

    this.dragged = dragged;
    Array.from(this.chart.querySelectorAll('.node')).forEach(function (node) {
      if (!dragHier.includes(node)) {
        if (opts.dropCriteria) {
          if (opts.dropCriteria(dragged, dragZone, node)) {
            node.classList.add('allowedDrop');
          }
        } else {
          node.classList.add('allowedDrop');
        }
      }
    });
  }
  _onDragOver(event) {
    event.preventDefault();
    let dropZone = event.currentTarget;

    if (!dropZone.classList.contains('allowedDrop')) {
      event.dataTransfer.dropEffect = 'none';
    }
  }
  _onDragEnd(event) {
    Array.from(this.chart.querySelectorAll('.allowedDrop')).forEach(function (el) {
      el.classList.remove('allowedDrop');
    });
  }
  _onDrop(event) {
    let dropZone = event.currentTarget,
      chart = this.chart,
      dragged = this.dragged,
      dragZone = this._closest(dragged, function (el) {
        return el.classList && el.classList.contains('nodes');
      }).parentNode.children[0].children[0];

    this._removeClass(Array.from(chart.querySelectorAll('.allowedDrop')), 'allowedDrop');
    // firstly, deal with the hierarchy of drop zone
    if (!dropZone.parentNode.parentNode.nextElementSibling) { // if the drop zone is a leaf node
      let bottomEdge = document.createElement('i');

      bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
      dropZone.appendChild(bottomEdge);
      dropZone.parentNode.setAttribute('colspan', 2);
      let table = this._closest(dropZone, function (el) {
          return el.nodeName === 'TABLE';
        }),
        upperTr = document.createElement('tr'),
        lowerTr = document.createElement('tr'),
        nodeTr = document.createElement('tr');

      upperTr.setAttribute('class', 'lines');
      upperTr.innerHTML = `<td colspan="2"><div class="downLine"></div></td>`;
      table.appendChild(upperTr);
      lowerTr.setAttribute('class', 'lines');
      lowerTr.innerHTML = `<td class="rightLine">&nbsp;</td><td class="leftLine">&nbsp;</td>`;
      table.appendChild(lowerTr);
      nodeTr.setAttribute('class', 'nodes');
      table.appendChild(nodeTr);
      Array.from(dragged.querySelectorAll('.horizontalEdge')).forEach((hEdge) => {
        dragged.removeChild(hEdge);
      });
      let draggedTd = this._closest(dragged, (el) => el.nodeName === 'TABLE').parentNode;

      nodeTr.appendChild(draggedTd);
    } else {
      let dropColspan = window.parseInt(dropZone.parentNode.colSpan) + 2;

      dropZone.parentNode.setAttribute('colspan', dropColspan);
      dropZone.parentNode.parentNode.nextElementSibling.children[0].setAttribute('colspan', dropColspan);
      if (!dragged.querySelector('.horizontalEdge')) {
        let rightEdge = document.createElement('i'),
          leftEdge = document.createElement('i');

        rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
        dragged.appendChild(rightEdge);
        leftEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
        dragged.appendChild(leftEdge);
      }
      let temp = dropZone.parentNode.parentNode.nextElementSibling.nextElementSibling,
        leftline = document.createElement('td'),
        rightline = document.createElement('td');

      leftline.setAttribute('class', 'leftLine topLine');
      leftline.innerHTML = `&nbsp;`;
      temp.insertBefore(leftline, temp.children[1]);
      rightline.setAttribute('class', 'rightLine topLine');
      rightline.innerHTML = `&nbsp;`;
      temp.insertBefore(rightline, temp.children[2]);
      temp.nextElementSibling.appendChild(this._closest(dragged, function (el) {
        return el.nodeName === 'TABLE';
      }).parentNode);

      let dropSibs = this._siblings(this._closest(dragged, function (el) {
        return el.nodeName === 'TABLE';
      }).parentNode).map((el) => el.querySelector('.node'));

      if (dropSibs.length === 1) {
        let rightEdge = document.createElement('i'),
          leftEdge = document.createElement('i');

        rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
        dropSibs[0].appendChild(rightEdge);
        leftEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
        dropSibs[0].appendChild(leftEdge);
      }
    }
    // secondly, deal with the hierarchy of dragged node
    let dragColSpan = window.parseInt(dragZone.colSpan);

    if (dragColSpan > 2) {
      dragZone.setAttribute('colspan', dragColSpan - 2);
      dragZone.parentNode.nextElementSibling.children[0].setAttribute('colspan', dragColSpan - 2);
      let temp = dragZone.parentNode.nextElementSibling.nextElementSibling;

      temp.children[1].remove();
      temp.children[1].remove();

      let dragSibs = Array.from(dragZone.parentNode.parentNode.children[3].children).map(function (td) {
        return td.querySelector('.node');
      });

      if (dragSibs.length === 1) {
        dragSibs[0].querySelector('.leftEdge').remove();
        dragSibs[0].querySelector('.rightEdge').remove();
      }
    } else {
      dragZone.removeAttribute('colspan');
      dragZone.querySelector('.node').removeChild(dragZone.querySelector('.bottomEdge'));
      Array.from(dragZone.parentNode.parentNode.children).slice(1).forEach((tr) => tr.remove());
    }
    let customE = new CustomEvent('nodedropped.orgchart', { 'detail': {
      'draggedNode': dragged,
      'dragZone': dragZone.children[0],
      'dropZone': dropZone
    }});

    chart.dispatchEvent(customE);
  }
  // create node
  _createNode(nodeData, level, opts) {
    let that = this;

    return new Promise(function (resolve, reject) {
      if (nodeData.children) {
        for (let child of nodeData.children) {
          child.parentId = nodeData.id;
        }
      }

      // construct the content of node
      let nodeDiv = document.createElement('div');

      delete nodeData.children;
      nodeDiv.dataset.source = JSON.stringify(nodeData);
      if (nodeData[opts.nodeId]) {
        nodeDiv.id = nodeData[opts.nodeId];
      }
      nodeDiv.setAttribute('class', 'node ' + (nodeData.className || '') + (level >= opts.depth ? ' slide-up' : ''));
      if (opts.draggable) {
        nodeDiv.setAttribute('draggable', true);
      }
      if (nodeData.parentId) {
        nodeDiv.setAttribute('data-parent', nodeData.parentId);
      }
      nodeDiv.innerHTML = `
        <div class="title">${nodeData[opts.nodeTitle]}</div>
        ${opts.nodeContent ? `<div class="content">${nodeData[opts.nodeContent]}</div>` : ''}
      `;
      // append 4 direction arrows or expand/collapse buttons
      let flags = nodeData.relationship || '';

      if (opts.verticalDepth && (level + 2) > opts.verticalDepth) {
        if ((level + 1) >= opts.verticalDepth && Number(flags.substr(2, 1))) {
          let toggleBtn = document.createElement('i');

          toggleBtn.setAttribute('class', 'toggleBtn fa fa-minus-square');
          nodeDiv.appendChild(toggleBtn);
        }
      } else {
        if (Number(flags.substr(0, 1))) {
          let topEdge = document.createElement('i');

          topEdge.setAttribute('class', 'edge verticalEdge topEdge fa');
          nodeDiv.appendChild(topEdge);
        }
        if (Number(flags.substr(1, 1))) {
          let rightEdge = document.createElement('i'),
            leftEdge = document.createElement('i');

          rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
          nodeDiv.appendChild(rightEdge);
          leftEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
          nodeDiv.appendChild(leftEdge);
        }
        if (Number(flags.substr(2, 1))) {
          let bottomEdge = document.createElement('i'),
            symbol = document.createElement('i'),
            title = nodeDiv.querySelector(':scope > .title');

          bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
          nodeDiv.appendChild(bottomEdge);
          symbol.setAttribute('class', 'fa ' + opts.parentNodeSymbol + ' symbol');
          title.insertBefore(symbol, title.children[0]);
        }
      }

      nodeDiv.addEventListener('mouseenter', that._hoverNode.bind(that));
      nodeDiv.addEventListener('mouseleave', that._hoverNode.bind(that));
      nodeDiv.addEventListener('click', that._dispatchClickEvent.bind(that));
      if (opts.draggable) {
        nodeDiv.addEventListener('dragstart', that._onDragStart.bind(that));
        nodeDiv.addEventListener('dragover', that._onDragOver.bind(that));
        nodeDiv.addEventListener('dragend', that._onDragEnd.bind(that));
        nodeDiv.addEventListener('drop', that._onDrop.bind(that));
      }
      // allow user to append dom modification after finishing node create of orgchart
      if (opts.createNode) {
        opts.createNode(nodeDiv, nodeData);
      }

      resolve(nodeDiv);
    });
  }
  buildHierarchy(appendTo, nodeData, level, opts, callback) {
    // Construct the node
    let that = this,
      nodeWrapper,
      childNodes = nodeData.children,
      isVerticalNode = opts.verticalDepth && (level + 1) >= opts.verticalDepth;

    if (Object.keys(nodeData).length > 1) { // if nodeData has nested structure
      nodeWrapper = isVerticalNode ? appendTo : document.createElement('table');
      if (!isVerticalNode) {
        appendTo.appendChild(nodeWrapper);
      }
      this._createNode(nodeData, level, opts)
      .then(function (nodeDiv) {
        if (isVerticalNode) {
          nodeWrapper.appendChild(nodeDiv);
        }else {
          let tr = document.createElement('tr');

          tr.innerHTML = `
            <td ${childNodes ? `colspan="${childNodes.length * 2}"` : ''}>
            </td>
          `;
          tr.children[0].appendChild(nodeDiv);
          nodeWrapper.appendChild(tr);
        }
        if (callback) {
          callback();
        }
        // Construct the inferior nodes and connectiong lines
        if (childNodes) {
          if (Object.keys(nodeData).length === 1) { // if nodeData is just an array
            nodeWrapper = appendTo;
          }
          let isHidden = level + 1 >= opts.depth ? ' hidden' : '',
            isVerticalLayer = opts.verticalDepth && (level + 2) >= opts.verticalDepth;

          // draw the line close to parent node
          if (!isVerticalLayer) {
            let tr = document.createElement('tr');

            tr.setAttribute('class', 'lines' + isHidden);
            tr.innerHTML = `
              <td colspan="${ childNodes.length * 2 }">
                <div class="downLine"></div>
              </td>
            `;
            nodeWrapper.appendChild(tr);
          }
          // draw the lines close to children nodes
          let lineLayer = document.createElement('tr');

          lineLayer.setAttribute('class', 'lines' + isHidden);
          lineLayer.innerHTML = `
            <td class="rightLine">&nbsp;</td>
            ${childNodes.slice(1).map(() => `
              <td class="leftLine topLine">&nbsp;</td>
              <td class="rightLine topLine">&nbsp;</td>
              `).join('')}
            <td class="leftLine">&nbsp;</td>
          `;
          let nodeLayer;

          if (isVerticalLayer) {
            nodeLayer = document.createElement('<ul>');
            if (level + 2 === opts.verticalDepth) {
              let tr = document.createElement('tr');

              tr.setAttribute('class', 'verticalNodes');
              tr.innerHTML = `<td></td>`;
              tr.firstChild.appendChild(nodeLayer);
            } else {
              nodeWrapper.appendChild(nodeLayer);
            }
          } else {
            nodeLayer = document.createElement('tr');
            nodeLayer.setAttribute('class', 'nodes' + isHidden);
            nodeWrapper.appendChild(lineLayer);
            nodeWrapper.appendChild(nodeLayer);
          }
          // recurse through children nodes
          childNodes.forEach((child) => {
            let nodeCell;

            if (isVerticalLayer) {
              nodeCell = document.createElement('li');
            } else {
              nodeCell = document.createElement('td');
              nodeCell.setAttribute('colspan', 2);
            }
            nodeLayer.appendChild(nodeCell);
            that.buildHierarchy(nodeCell, child, level + 1, opts, callback);
          });
        }
      })
      .catch(function (err) {
        console.error('Failed to creat node', err);
      });
    }
  }
  _clickChart(event) {
    let node = this._closest(event.target, function (el) {
      return el.classList && el.classList.contains('node');
    });

    if (!node) {
      this.chart.querySelector('.node.focused').removeClass('focused');
    }
  }
  _clickExportButton() {
    let opts = this.options,
      chartContainer = this.chartContainer,
      mask = chartContainer.querySelector(':scope > .mask'),
      sourceChart = chartContainer.querySelector('.orgchart:not(.hidden)'),
      flag = opts.direction === 'l2r' || opts.direction === 'r2l';

    if (!mask) {
      mask = document.createElement('div');
      mask.setAttribute('class', 'mask');
      mask.innerHTML = `<i class="fa fa-circle-o-notch fa-spin spinner"></i>`;
      chartContainer.appendChild(mask);
    } else {
      mask.classList.remove('hidden');
    }
    chartContainer.classList.add('canvasContainer');
    window.html2canvas(sourceChart, {
      'width': flag ? sourceChart.clientHeight : sourceChart.clientWidth,
      'height': flag ? sourceChart.clientWidth : sourceChart.clientHeight,
      'onclone': function (cloneDoc) {
        let canvasContainer = cloneDoc.querySelector('.canvasContainer');

        canvasContainer.style.overflow = 'visible';
        canvasContainer.querySelector('.orgchart:not(.hidden)').transform = '';
      }
    })
    .then((canvas) => {
      let downloadBtn = chartContainer.querySelector('.oc-download-btn');

      chartContainer.querySelector('.mask').classList.add('hidden');
      downloadBtn.setAttribute('href', canvas.toDataURL());
      downloadBtn.click();
    })
    .catch((err) => {
      console.error('Failed to export the curent orgchart!', err);
    })
    .finally(() => {
      chartContainer.classList.remove('canvasContainer');
    });
  }
  _loopChart(chart) {
    let subObj = { 'id': chart.querySelector('.node').id };

    if (chart.children[3]) {
      Array.from(chart.children[3].children).forEach((el) => {
        if (!subObj.children) { subObj.children = []; }
        subObj.children.push(this._loopChart(el.firstChild));
      });
    }
    return subObj;
  }
  getHierarchy() {
    if (!this.chart.querySelector('.node').id) {
      return 'Error: Nodes of orghcart to be exported must have id attribute!';
    }
    return this._loopChart(this.chart.querySelector('table'));
  }
}
