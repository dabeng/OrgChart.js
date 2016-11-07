export default class OrgChart {
  constructor({
    chartContainer,
    data,
    nodeTitle = 'name',
    nodeId = 'id',
    toggleSiblingsResp = false,
    depth = 999,
    chartClass = '',
    exportButton = false,
    exportFilename = 'OrgChart',
    parentNodeSymbol = 'fa-users',
    draggable = false,
    direction = 't2b',
    pan = false,
    zoom = false
  } = {}) {
    this._name = 'OrgChart';
    this.options = {
      'chartContainer': chartContainer,
      'nodeTitle': nodeTitle,
      'nodeId': nodeId,
      'toggleSiblingsResp': toggleSiblingsResp,
      'depth': depth,
      'chartClass': chartClass,
      'exportButton': exportButton,
      'exportFilename': exportFilename,
      'parentNodeSymbol': parentNodeSymbol,
      'draggable': draggable,
      'direction': direction,
      'pan': pan,
      'zoom': zoom
    };

    this._init();
  }
  get name() {
    return this._name;
  }
  _init() {
    // build the org-chart
    let opts = this.options,
      data = opts.data,
      chart = document.createElement('div');

    this.chart = chart;

    chart.setAttribute('data-options', opts);
    chart.setAttribute('class', 'orgchart' + (opts.chartClass !== '' ? ' ' + opts.chartClass : '') +
      (opts.direction !== 't2b' ? ' ' + opts.direction : ''));
    chart.addEventListener('click', function (event) {
      let node = this._closest(event.target, function (el) {
        return el.classList.contains('node');
      });

      if (!node) {
        chart.querySelector('.node.focused').removeClass('focused');
      }
    }, false);
    if (typeof data === 'object') {
      if (data.nodeName) { // ul datasource
        this.buildHierarchy(chart, this._buildJsonDS(data.children[0], 0, opts));
      } else { // local json datasource
        this.buildHierarchy(chart, opts.ajaxURL ? data : this._attachRel(data, '00'), 0, opts);
      }
    } else {
      let spinner = document.createElement('i');
      spinner.setAttribute('class', 'fa fa-circle-o-notch fa-spin spinner');
      this._getJSON(data)
      .then(function(resp) { //cb
        this.buildHierarchy(chart, opts.ajaxURL ? resp : this._attachRel(resp, '00'), 0, opts);
      })
      .catch(function(err) {
        console.error('failed to fetch datasource for orgchart', err);
      })
      .finally(function() {
        let spinner = chart.querySelector('.spinner')
        spinner.parentNode.removeChild(spinner);
      });
    }
    opts.chartContainer.appendChild(chart);
  }
  _closest(el, fn) {
    return el && (fn(el) ? el : closest(el.parentNode, fn));
  }
  _siblings(el, expr) {
    let sibs = [];
    for (let child of el.parseNode.children) {
      if (child !== el ) {
        if (expr) {
          if (el.matches(expr)) {
            sibs.push(child);
          }
        } else {
          sibs.push(child);
        }
      }
    }
    return sibs;
  }
  _prevAll(el, selector) {
    let sibs = [];
    let preSib = el.previousElementSibling;

    while (preSib) {
      if (!selector || el.matches(selector)) {
        sibs.push(preSib);
      }
      preSib = preSib.previousElementSibling;
    }
    return sibs;
  }
  _nextAll(el) {
    let sibs = [];
    let nextSib = el.nextElementSibling;

    while (nextSib) {
      if (!selector || el.matches(selector)) {
        sibs.push(nextSib);
      }
      nextSib = nextSib.nextElementSibling;
    }
    return sibs;
  }
  _isVisible(el) {
    return el.offsetParent !== null;
  }
  _addClass(elements, className) {
    nodeList.forEach(function(el) {
      el.classList.add(className);
    });
  }
  _removeClass(elements, className) {
    nodeList.forEach(function(el) {
      el.classList.remove(className);
    });
  }
  _getJSON(url) {
    return new Promise(function(resolve, reject){
      var client = new XMLHttpRequest();
      client.open('GET', url);
      client.onreadystatechange = handler;
      client.responseType = 'json';
      client.setRequestHeader('Accept', 'application/json');
      client.send();

      function handler() {
        if (this.readyState !== 4) {
          return;
        }
        if (this.status === 200) {
          resolve(this.response);
        } else {
          reject(new Error(this.statusText));
        }
      };
    });
  }
  _buildJsonDS(li) {
    var subObj = {
      'name': li.firstChild.textContent.trim(),
      'relationship': (li.parentNode.parentNode.tagName === 'li' ? '1': '0') +
        (li.parentNode.children > 1 ? 1: 0) + (li.children.length ? 1 : 0)
    };

    if (li.id) {
      subObj.id = li.id;
    }
    for (let subLi of li.querySelector('ul').children) {
      if (!subObj.children) { subObj.children = []; }
      subObj.children.push(buildJsonDS(subLi));
    }
    return subObj;
  }
  _attachRel(data, flags) {
    data.relationship = flags + (data.children && data.children.length > 0 ? 1 : 0);
    if (data.children) {
      for (let item of data.children) {
        attachRel(item, '1' + (data.children.length > 1 ? 1 : 0));
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
    return node.querySelector(':scope > .edge').className.indexOf('fa-') > -1 ? true : false;
  }
  hoverNode(event) {
    let node = event.target,
      flag = false;
      topEdge = node.querySelector(':scope > .topEdge');
      rightEdge = node.querySelector(':scope > .rightEdge');
      bottomEdge = node.querySelector(':scope > .bottomEdge');
      leftEdge = node.querySelector(':scope > .leftEdge');
    if (event.type === 'mouseenter') {
      if (topEdge) {
        flag = getNodeState(node, 'parent').visible;
        topEdge.classList.toggle('fa-chevron-up', !flag)
        topEdge.classList.toggle('fa-chevron-down', flag);
      }
      if (bottomEdge) {
        flag = getNodeState(node, 'children').visible;
        bottomEdge.classList.toggle('fa-chevron-down', !flag)
        bottomEdge.classList.toggle('fa-chevron-up', flag);
      }
      if (leftEdge) {
        switchHorizontalArrow(node);
      }
    } else {
      node.querySelector(':scope > .edge').classList.remove('fa-chevron-up', 'fa-chevron-down', 'fa-chevron-right', 'fa-chevron-left');
    }
  });
  // define node click event handler
  _clickNode(event) {
    let node = event.target;
    let chart = this._closest(node, function (el) {
      return el.classList.contains('orgchart');
    });
    chart.querySelector('.focused').classList.remove('focused');
    node.classList.add('focused');
  }
  // build the parent node of specific node
  _buildParentNode(currentRoot, nodeData, opts, callback) {
    let table = document.createElement('table');

    nodeData.relationship = '001';
    this.createNode(nodeData, 0, opts || this.chart.dataset.options)
      .then(function(nodeDiv) {
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
      .catch(function(err) {
        console.error('Failed to create parent node', err);
      });
  }
  // show the parent node of the specified node
  showParent(node) {
    // just show only one superior level
    let temp = this._closest(node, function (el) {
      return el.nodeName === 'TABLE';
    }).parentNode.children;
    for (let tr of temp) {
      tr.classList.remove('hidden');
    }
    // just show only one line
    this._addClass(temp[2].children.slice(1, -1), 'hidden');
    // show parent node with animation
    let parent = temp[0].querySelector('.node');
    repaint(parent);
    parent.classList.add('slide');
    parent.classList.remove('slide-down');
    parent.addEventListener('transitionend', function() {
      parent.classList.remove('slide');
      if (isInAction(node)) {
        switchVerticalArrow(node.querySelector(':scope > .topEdge'));
      }
    }, { 'once': true});
  }
  // hide the sibling nodes of the specified node
  hideSiblings(node, direction) {
    let nodeContainer = this._closest(node, function (el) {
      return el.nodeName === 'TABLE';
    }).parentNode;

    let siblings = this._siblings(nodeContainer);
    for (let sib of siblings) {
      if (sib.querySelector('.spinner')) {
        this.chart.dataset.inAjax = false;
      }
    }
    
    if (!direction || (direction && direction === 'left')) {
      let preSibs = this._prevAll(nodeContainer);
      for (let sib of preSibs) {
        for (let node of sib.querySelectorAll('.node')) {
          if (!this._isVisible(node)) {
            node.classList.add('slide', 'slide-right');
          } 
        }
      }
    }
    if (!direction || (direction && direction !== 'left')) {
      let nextSibs = this._nextAll(nodeContainer);
      for (let sib of nextSibs) {
        for (let node of next.querySelectorAll('.node')) {
          if (!this._isVisible(node)) {
            node.classList.add('slide', 'slide-left');
          } 
        }
        nextSib = nextSib.nextElementSibling;
      }
    }

    let animatedNodes = [];

    for (let sib of this._siblings(nodeContainer)) {
      animatedNodes.concat(sib.querySelectorAll('.slide'));
    }
    let lines = [];

    for (let node of animatedNodes) {
      let temp = this._closest(node, function (el) {
        return el.classList.contains('nodes');
      }).parentNode.firstChild;
      lines.push(temp);
      lines.push(temp.nextElementSibling);
    }
    lines.forEach(function(line) {
      line.style.visibility = 'hidden';
    });

    animatedNodes[0].addEventListener('transitionend', function() {
      lines.forEach(function(line) {
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
      let temp = this._closest(nodeContainer, function (el) {
        return el.classList.contains('nodes');
      }).previousElementSibling.querySelectorAll(':scope > :not(.hidden)');

      let someLines = temp.slice(1, direction ? sibs.length * 2 + 1 : -1);
      this._addClass(someLines, 'hidden');
      this._removeClass(animatedNodes, 'slide');
      sibs.querySelectorAll('.node').slice(1).forEach(function(node) {
        if (this._isVisible(node)) {
          node.classList.remove('slide-left', 'slide-right');
          node.classList.add('slide-up');
        }
      });
      this._addClass(sibs.querySelectorAll('.lines'), 'hidden');
      this._addClass(sibs.querySelectorAll('.nodes'), 'hidden');
      this._addClass(sibs.querySelectorAll('.verticalNodes'), 'hidden');
      this._addClass(sibs, 'hidden');

      if (isInAction(node)) {
        switchHorizontalArrow(node);
      }
    }, { 'once', true });
  }
  // recursively hide the ancestor node and sibling nodes of the specified node
  hideAncestorsSiblings(node) {
    let temp = this._closest(node, function (el) {
      return el.classList.contains('nodes');
    }).parentNode.children;
    if (temp[0].querySelector('.spinner')) {
      this.chart.dataset.inAjax = false;
    }
    // hide the sibling nodes
    if (getNodeState(node, 'siblings').visible) {
      hideSiblings(node);
    }
    // hide the lines
    var $lines = $temp.slice(1);
    $lines.css('visibility', 'hidden');
    // hide the superior nodes with transition
    var $parent = $temp.eq(0).find('.node');
    var grandfatherVisible = getNodeState($parent, 'parent').visible;
    if ($parent.length && $parent.is(':visible')) {
      $parent.addClass('slide slide-down').one('transitionend', function() {
        $parent.removeClass('slide');
        $lines.removeAttr('style');
        $temp.addClass('hidden');
      });
    }
    // if the current node has the parent node, hide it recursively
    if ($parent.length && grandfatherVisible) {
      hideAncestorsSiblings($parent);
    }
  }
  // exposed method
  addParent(currentRoot, data, opts) {
    this._buildParentNode(currentRoot, data, opts, function() {
      if (!currentRoot.querySelector(':scope .topEdge').length) {
        let topEdge = document.createElement('i');
        topEdge.setAttribute('class', 'edge verticalEdge topEdge fa');
        currentRoot.appendChild(topEdge);
      }
      showParent($currentRoot);
    });
  }
  // define click event handler for the top edge
  _clickTopEdge(event) {
    event.stopPropagation();
    let topEdge = event.target,
      node = topEdge.parentNode,
      parentState = getNodeState(node, 'parent'),
      opts = this.dataset.options;

    if (parentState.exist) {
      let temp = this._closest(node, function (el) {
        return el.classList.contains('nodes');
      });
      var parent = temp.parentNode.firstChild.querySelector('.node');
      if (parent.classList.contains('slide')) { return; }
      // hide the ancestor nodes and sibling nodes of the specified node
      if (parentState.visible) {
        hideAncestorsSiblings(node);
        parent.addEventListener('transitionend', function() {
          if (isInAction(node)) {
            switchVerticalArrow(topEdge);
            switchHorizontalArrow(node);
          }
        }, { 'once': true });
      } else { // show the ancestors and siblings
        showParent(node);
      }
    } else {
      // load the new parent node of the specified node by ajax request
      var nodeId = topEdge.parentNode.id;
      // start up loading status
      if (startLoading(topEdge, node, opts)) {
        // load new nodes
        this._getJSON(typeof opts.ajaxURL.parent === 'function' ? opts.ajaxURL.parent(nodeData) : opts.ajaxURL.parent + nodeId)
        .then(function(resp) {
          let chart = this._closest(node, function (el) {
            return el.classList.contains('orgchart');
          });
          if (chart.dataset.inAjax)) {
            if (!Object.keys(resp).length) {
              this.addParent(node, data, opts);
            }
          }
        })
        .catch(function(err) {
          console.error('Failed to get parent node data.', err);
        })
        .finally(function() {
          this._endLoading(topEdge, node, opts);
        });
      }
    }
  });
// exposed method
  function addChildren(node, data, opts) {
    var opts = opts || $node.closest('.orgchart').data('options');
    var count = 0;
    buildChildNode.call($node.closest('.orgchart').parent(), $node.closest('table'), data, opts, function() {
      if (++count === data.children.length) {
        if (!$node.children('.bottomEdge').length) {
          $node.append('<i class="edge verticalEdge bottomEdge fa"></i>');
        }
        if (!$node.find('.symbol').length) {
          $node.children('.title').prepend('<i class="fa '+ opts.parentNodeSymbol + ' symbol"></i>');
        }
        showDescendants($node);
      }
    });
  }
  // bind click event handler for the bottom edge
  _clickBottomEdge(event) {
      event.stopPropagation();
      let bottomEdge = event.target,
        node = bottomEdge.parentNode;
        childrenState = getNodeState(node, 'children');

      if (childrenState.exist) {
        var children = node.closest('tr').siblings(':last');
        if (children.find('.node:visible').is('.slide')) { return; }
        // hide the descendant nodes of the specified node
        if (childrenState.visible) {
          hideDescendants($node);
        } else { // show the descendants
          showDescendants($node);
        }
      } else { // load the new children nodes of the specified node by ajax request
        var nodeId = $that.parent()[0].id;
        if (startLoading($that, $node, opts)) {
          $.ajax({ 'url': $.isFunction(opts.ajaxURL.children) ? opts.ajaxURL.children(nodeData) : opts.ajaxURL.children + nodeId, 'dataType': 'json' })
          .done(function(data, textStatus, jqXHR) {
            if ($node.closest('.orgchart').data('inAjax')) {
              if (data.children.length) {
                addChildren($node, data, $.extend({}, opts, { depth: 0 }));
              }
            }
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('Failed to get children nodes data');
          })
          .always(function() {
            endLoading($that, $node, opts);
          });
        }
      }
    });
  // create node
  _createNode(nodeData, level, opts) {
    return new Promise(function(resolve, reject) {
      for (let child of nodeData.chilren) {
        child.parentId = nodeData.id;
      })

    // construct the content of node
    let nodeDiv = document.createElement('div');
    if (nodeData[opts.nodeId]) {
      nodeDiv.id = nodeData[opts.nodeId];
    }
    nodeData.setAttribute('class', 'node ' + (nodeData.className || '') +  (level >= opts.depth ? ' slide-up' : ''));
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
      if ((level + 1) >= opts.verticalDepth && Number(flags.substr(2,1))) {
        let toggleBtn = document.createElement('i');
        toggleBtn.setAttribute('class', 'toggleBtn fa fa-minus-square');
        nodeDiv.appendChild(toggleBtn);
      }
    } else {
      if (Number(flags.substr(0,1))) {
        let topEdge = document.createElement('i');
        topEdge.setAttribute('class', 'edge verticalEdge topEdge fa');
        $nodeDiv.appendChild(topEdge);
      }
      if(Number(flags.substr(1,1))) {
        let rightEdge = document.createElement('i');
        rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
        nodeDiv.appendChild(rightEdge);
        let leftEdge = document.createElement('i');
        rightEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
        nodeDiv.appendChild(leftEdge);
      }
      if(Number(flags.substr(2,1))) {
        let bottomEdge = document.createElement('i');
        bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
        nodeDiv.appendChild(bottomEdge);
        let symbol = document.createElement('i');
        symbol.setAttribute('class', 'fa '+ opts.parentNodeSymbol + ' symbol');
        let title = nodeDiv.querySelector('.scope > .title');
        title.insertBefore(symbol, title.children[0]);
      }
    }

    nodeDiv.addEventListener('mouseenter', this._hoverNode);
    nodeDiv.addEventListener('mouseleave', this._hoverNode);
    nodeDiv.addEventListener('click', this._clickNode);
    nodeDiv.querySelector('.topEdge').addEventListener('click', clickTopEdge);
    nodeDiv.querySelector('.bottomEdge').addEventListener('click', clickBottomEdge);




    // event handler for toggle buttons in Hybrid(horizontal + vertical) OrgChart
    $nodeDiv.on('click', '.toggleBtn', function(event) {
      var $this = $(this);
      var $descWrapper = $this.parent().next();
      var $descendants = $descWrapper.find('.node');
      var $children = $descWrapper.children().children('.node');
      if ($children.is('.slide')) { return; }
      $this.toggleClass('fa-plus-square fa-minus-square');
      if ($descendants.eq(0).is('.slide-up')) {
        $descWrapper.removeClass('hidden');
        repaint($children.get(0));
        $children.addClass('slide').removeClass('slide-up').eq(0).one('transitionend', function() {
          $children.removeClass('slide');
        });
      } else {
        $descendants.addClass('slide slide-up').eq(0).one('transitionend', function() {
          $descendants.removeClass('slide');
          // $descWrapper.addClass('hidden');
          $descendants.closest('ul').addClass('hidden');
        }).find('.toggleBtn').removeClass('fa-minus-square').addClass('fa-plus-square');
      }
    });

    // bind click event handler for the left and right edges
    $nodeDiv.on('click', '.leftEdge, .rightEdge', function(event) {
      event.stopPropagation();
      var $that = $(this);
      var $node = $that.parent();
      var siblingsState = getNodeState($node, 'siblings');
      if (siblingsState.exist) {
        var $siblings = $node.closest('table').parent().siblings();
        if ($siblings.find('.node:visible').is('.slide')) { return; }
        if (opts.toggleSiblingsResp) {
          var $prevSib = $node.closest('table').parent().prev();
          var $nextSib = $node.closest('table').parent().next();
          if ($that.is('.leftEdge')) {
            if ($prevSib.is('.hidden')) {
              showSiblings($node, 'left');
            } else {
              hideSiblings($node, 'left');
            }
          } else {
            if ($nextSib.is('.hidden')) {
              showSiblings($node, 'right');
            } else {
              hideSiblings($node, 'right');
            }
          }
        } else {
          if (siblingsState.visible) {
            hideSiblings($node);
          } else {
            showSiblings($node);
          }
        }
      } else {
        // load the new sibling nodes of the specified node by ajax request
        var nodeId = $that.parent()[0].id;
        var url = (getNodeState($node, 'parent').exist) ?
          ($.isFunction(opts.ajaxURL.siblings) ? opts.ajaxURL.siblings(nodeData) : opts.ajaxURL.siblings + nodeId) :
          ($.isFunction(opts.ajaxURL.families) ? opts.ajaxURL.families(nodeData) : opts.ajaxURL.families + nodeId);
        if (startLoading($that, $node, opts)) {
          $.ajax({ 'url': url, 'dataType': 'json' })
          .done(function(data, textStatus, jqXHR) {
            if ($node.closest('.orgchart').data('inAjax')) {
              if (data.siblings || data.children) {
                addSiblings($node, data, opts);
              }
            }
          })
          .fail(function(jqXHR, textStatus, errorThrown) {
            console.log('Failed to get sibling nodes data');
          })
          .always(function() {
            endLoading($that, $node, opts);
          });
        }
      }
    });
    if (opts.draggable) {
      $nodeDiv.on('dragstart', function(event) {
        var origEvent = event.originalEvent;
        var isFirefox = /firefox/.test(window.navigator.userAgent.toLowerCase());
        if (isFirefox) {
          origEvent.dataTransfer.setData('text/html', 'hack for firefox');
        }
        // if users enable zoom or direction options
        if ($nodeDiv.closest('.orgchart').css('transform') !== 'none') {
          var ghostNode, nodeCover;
          if (!document.querySelector('.ghost-node')) {
            ghostNode = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            ghostNode.classList.add('ghost-node');
            nodeCover = document.createElementNS('http://www.w3.org/2000/svg','rect');
            ghostNode.appendChild(nodeCover);
            $nodeDiv.closest('.orgchart').append(ghostNode);
          } else {
            ghostNode = $nodeDiv.closest('.orgchart').children('.ghost-node').get(0);
            nodeCover = $(ghostNode).children().get(0);
          }
          var transValues = $nodeDiv.closest('.orgchart').css('transform').split(',');
          var scale = Math.abs(window.parseFloat((opts.direction === 't2b' || opts.direction === 'b2t') ? transValues[0].slice(transValues[0].indexOf('(') + 1) : transValues[1]));
          ghostNode.setAttribute('width', $nodeDiv.outerWidth(false));
          ghostNode.setAttribute('height', $nodeDiv.outerHeight(false));
          nodeCover.setAttribute('x',5 * scale);
          nodeCover.setAttribute('y',5 * scale);
          nodeCover.setAttribute('width', 120 * scale);
          nodeCover.setAttribute('height', 40 * scale);
          nodeCover.setAttribute('rx', 4 * scale);
          nodeCover.setAttribute('ry', 4 * scale);
          nodeCover.setAttribute('stroke-width', 1 * scale);
          var xOffset = origEvent.offsetX * scale;
          var yOffset = origEvent.offsetY * scale;
          if (opts.direction === 'l2r') {
            xOffset = origEvent.offsetY * scale;
            yOffset = origEvent.offsetX * scale;
          } else if (opts.direction === 'r2l') {
            xOffset = $nodeDiv.outerWidth(false) - origEvent.offsetY * scale;
            yOffset = origEvent.offsetX * scale;
          } else if (opts.direction === 'b2t') {
            xOffset = $nodeDiv.outerWidth(false) - origEvent.offsetX * scale;
            yOffset = $nodeDiv.outerHeight(false) - origEvent.offsetY * scale;
          }
          if (isFirefox) { // hack for old version of Firefox(< 48.0)
            nodeCover.setAttribute('fill', 'rgb(255, 255, 255)');
            nodeCover.setAttribute('stroke', 'rgb(191, 0, 0)');
            var ghostNodeWrapper = document.createElement('img');
            ghostNodeWrapper.src = 'data:image/svg+xml;utf8,' + (new XMLSerializer()).serializeToString(ghostNode);
            origEvent.dataTransfer.setDragImage(ghostNodeWrapper, xOffset, yOffset);
          } else {
            origEvent.dataTransfer.setDragImage(ghostNode, xOffset, yOffset);
          }
        }
        var $dragged = $(this);
        var $dragZone = $dragged.closest('.nodes').siblings().eq(0).find('.node:first');
        var $dragHier = $dragged.closest('table').find('.node');
        $dragged.closest('.orgchart')
          .data('dragged', $dragged)
          .find('.node').each(function(index, node) {
            if ($dragHier.index(node) === -1) {
              if (opts.dropCriteria) {
                if (opts.dropCriteria($dragged, $dragZone, $(node))) {
                  $(node).addClass('allowedDrop');
                }
              } else {
                $(node).addClass('allowedDrop');
              }
            }
          });
      })
      .on('dragover', function(event) {
        event.preventDefault();
        var $dropZone = $(this);
        var $dragged = $dropZone.closest('.orgchart').data('dragged');
        var $dragZone = $dragged.closest('.nodes').siblings().eq(0).find('.node:first');
        if ($dragged.closest('table').find('.node').index($dropZone) > -1 ||
          (opts.dropCriteria && !opts.dropCriteria($dragged, $dragZone, $dropZone))) {
          event.originalEvent.dataTransfer.dropEffect = 'none';
        }
      })
      .on('dragend', function(event) {
        $(this).closest('.orgchart').find('.allowedDrop').removeClass('allowedDrop');
      })
      .on('drop', function(event) {
        var $dropZone = $(this);
        var $orgchart = $dropZone.closest('.orgchart');
        var $dragged = $orgchart.data('dragged');
        $orgchart.find('.allowedDrop').removeClass('allowedDrop');
        var $dragZone = $dragged.closest('.nodes').siblings().eq(0).children();
        // firstly, deal with the hierarchy of drop zone
        if (!$dropZone.closest('tr').siblings().length) { // if the drop zone is a leaf node
          $dropZone.append('<i class="edge verticalEdge bottomEdge fa"></i>')
            .parent().attr('colspan', 2)
            .parent().after('<tr class="lines"><td colspan="2"><div class="downLine"></div></td></tr>'
            + '<tr class="lines"><td class="rightLine">&nbsp;</td><td class="leftLine">&nbsp;</td></tr>'
            + '<tr class="nodes"></tr>')
            .siblings(':last').append($dragged.find('.horizontalEdge').remove().end().closest('table').parent());
        } else {
          var dropColspan = parseInt($dropZone.parent().attr('colspan')) + 2;
          var horizontalEdges = '<i class="edge horizontalEdge rightEdge fa"></i><i class="edge horizontalEdge leftEdge fa"></i>';
          $dropZone.closest('tr').next().addBack().children().attr('colspan', dropColspan);
          if (!$dragged.find('.horizontalEdge').length) {
            $dragged.append(horizontalEdges);
          }
          $dropZone.closest('tr').siblings().eq(1).children(':last').before('<td class="leftLine topLine">&nbsp;</td><td class="rightLine topLine">&nbsp;</td>')
            .end().next().append($dragged.closest('table').parent());
          var $dropSibs = $dragged.closest('table').parent().siblings().find('.node:first');
          if ($dropSibs.length === 1) {
            $dropSibs.append(horizontalEdges);
          }
        }
        // secondly, deal with the hierarchy of dragged node
        var dragColspan = parseInt($dragZone.attr('colspan'));
        if (dragColspan > 2) {
          $dragZone.attr('colspan', dragColspan - 2)
            .parent().next().children().attr('colspan', dragColspan - 2)
            .end().next().children().slice(1, 3).remove();
          var $dragSibs = $dragZone.parent().siblings('.nodes').children().find('.node:first');
          if ($dragSibs.length ===1) {
            $dragSibs.find('.horizontalEdge').remove();
          }
        } else {
          $dragZone.removeAttr('colspan')
            .find('.bottomEdge').remove()
            .end().end().siblings().remove();
        }
        $orgchart.triggerHandler({ 'type': 'nodedropped.orgchart', 'draggedNode': $dragged, 'dragZone': $dragZone.children(), 'dropZone': $dropZone });
      });
    }
    // allow user to append dom modification after finishing node create of orgchart 
    if (opts.createNode) {
      opts.createNode($nodeDiv, nodeData);
    }

      resolve(nodeDiv);
    });
  }
  buildHierarchy(appendTo, nodeData, level, opts, callback) {
    // Construct the node
    let nodeWrapper,
      childNodes = nodeData.children,
      hasChildren = childNodes ? childNodes.length : false,
      isVerticalNode = (opts.verticalDepth && (level + 1) >= opts.verticalDepth) ? true : false;

    if (Object.keys(nodeData).length > 1) { // if nodeData has nested structure
      nodeWrapper = isVerticalNode ? appendTo : document.createElement('table');
      if (!isVerticalNode) {
        appendTo.appendChild(nodeWrapper);
      }
      this._createNode(nodeData, level, opts))
      .then(function(nodeDiv) {
        if (isVerticalNode) {
          nodeWrapper.appendChild(nodeDiv);
        }else {
          let tr = document.createElement('tr');
          tr.innerHTML = `
            <td ${hasChildren ? `colspan="${childNodes.length * 2}"` : ''}>
            </td>
          `;
          tr.firstChild.appendChild(nodeDiv);
          nodeWrapper.appendChild(tr);
        }
        if (callback) {
          callback();
        }
      })
      .catch(function(err) {
        console.error('Failed to creat node', err);
      });
    }
    // Construct the inferior nodes and connectiong lines
    if (hasChildren) {
      if (Object.keys(nodeData).length === 1) { // if nodeData is just an array
        $nodeWrapper = $appendTo;
      }
      var isHidden = level + 1 >= opts.depth ? ' hidden' : '';
      var isVerticalLayer = (opts.verticalDepth && (level + 2) >= opts.verticalDepth) ? true : false;

      // draw the line close to parent node
      if (!isVerticalLayer) {
        let tr = document.createElement('tr');
        tr.setAttribute('class', 'lines' + isHidden);
        tr.innerHTML = `
          <td colspan="${childNodes.length * 2}">
            <div class="downLine"></div>
          </td>
        `;
        nodeWrapper.appendChild(tr);
      }
      // draw the lines close to children nodes
      for (var i=1; i<$childNodes.length; i++) {
        lineLayer += '<td class="leftLine topLine">&nbsp;</td><td class="rightLine topLine">&nbsp;</td>';
      }

      let lineLayer = document.createElement('tr');
        lineLayer.setAttribute('class', 'lines' + isHidden);
        lineLayer.innerHTML = `
          <td class="rightLine"> </td>
          ${childNodes.map(() => `
            <td class="leftLine topLine"> </td>
            <td class="rightLine topLine"> </td>
          `)}
          <td class="leftLine"> </td>
        `;
      let $nodeLayer;

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
      childNodes.map(() => {
        let $nodeCell;

        if (isVerticalLayer) {
          nodeCell = document.createElement('li');
        } else {
          nodeCell = document.createElement('td');
          nodeCell.setAttribute('colspan', 2);
        }
        nodeLayer.appendChild(nodeCell);
        buildHierarchy(nodeCell, this, level + 1, opts, callback);
      });
    }
  }
}
