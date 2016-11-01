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

    chart.setAttribute('data-options', opts);
    chart.setAttribute('class', 'orgchart' + (opts.chartClass !== '' ? ' ' + opts.chartClass : '') +
      (opts.direction !== 't2b' ? ' ' + opts.direction : ''));
    chart.addEventListener('click', function (event) {
      let node = this._closest(event.target, function (el) {
        return el.className === 'node';
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
  // create node
  _createNode(nodeData, level, opts) {
    return new Promise(function(resolve, reject) {
      $.each(nodeData.children, function (index, child) {
        child.parentId = nodeData.id;
      })

    // construct the content of node
    var $nodeDiv = $('<div' + (opts.draggable ? ' draggable="true"' : '') + (nodeData[opts.nodeId] ? ' id="' + nodeData[opts.nodeId] + '"' : '') + (nodeData.parentId ? ' data-parent="' + nodeData.parentId + '"' : '') + '>')
      .addClass('node ' + (nodeData.className || '') +  (level >= opts.depth ? ' slide-up' : ''))
      .append('<div class="title">' + nodeData[opts.nodeTitle] + '</div>')
      .append(typeof opts.nodeContent !== 'undefined' ? '<div class="content">' + (nodeData[opts.nodeContent] || '') + '</div>' : '');
    // append 4 direction arrows or expand/collapse buttons
    var flags = nodeData.relationship || '';
    if (opts.verticalDepth && (level + 2) > opts.verticalDepth) {
      if ((level + 1) >= opts.verticalDepth && Number(flags.substr(2,1))) {
        $nodeDiv.append('<i class="toggleBtn fa fa-minus-square"></i>');
      }
    } else {
      if (Number(flags.substr(0,1))) {
        $nodeDiv.append('<i class="edge verticalEdge topEdge fa"></i>');
      }
      if(Number(flags.substr(1,1))) {
        $nodeDiv.append('<i class="edge horizontalEdge rightEdge fa"></i>' +
          '<i class="edge horizontalEdge leftEdge fa"></i>');
      }
      if(Number(flags.substr(2,1))) {
        $nodeDiv.append('<i class="edge verticalEdge bottomEdge fa"></i>')
          .children('.title').prepend('<i class="fa '+ opts.parentNodeSymbol + ' symbol"></i>');
      }
    }

    $nodeDiv.on('mouseenter mouseleave', function(event) {
      var $node = $(this), flag = false;
      var $topEdge = $node.children('.topEdge');
      var $rightEdge = $node.children('.rightEdge');
      var $bottomEdge = $node.children('.bottomEdge');
      var $leftEdge = $node.children('.leftEdge');
      if (event.type === 'mouseenter') {
        if ($topEdge.length) {
          flag = getNodeState($node, 'parent').visible;
          $topEdge.toggleClass('fa-chevron-up', !flag).toggleClass('fa-chevron-down', flag);
        }
        if ($bottomEdge.length) {
          flag = getNodeState($node, 'children').visible;
          $bottomEdge.toggleClass('fa-chevron-down', !flag).toggleClass('fa-chevron-up', flag);
        }
        if ($leftEdge.length) {
          switchHorizontalArrow($node);
        }
      } else {
        $node.children('.edge').removeClass('fa-chevron-up fa-chevron-down fa-chevron-right fa-chevron-left');
      }
    });

    // define click event handler
    $nodeDiv.on('click', function(event) {
      $(this).closest('.orgchart').find('.focused').removeClass('focused');
      $(this).addClass('focused');
    });

    // define click event handler for the top edge
    $nodeDiv.on('click', '.topEdge', function(event) {
      event.stopPropagation();
      var $that = $(this);
      var $node = $that.parent();
      var parentState = getNodeState($node, 'parent');
      if (parentState.exist) {
        var $parent = $node.closest('table').closest('tr').siblings(':first').find('.node');
        if ($parent.is('.slide')) { return; }
        // hide the ancestor nodes and sibling nodes of the specified node
        if (parentState.visible) {
          hideAncestorsSiblings($node);
          $parent.one('transitionend', function() {
            if (isInAction($node)) {
              switchVerticalArrow($that);
              switchHorizontalArrow($node);
            }
          });
        } else { // show the ancestors and siblings
          showParent($node);
        }
      } else {
        // load the new parent node of the specified node by ajax request
        var nodeId = $that.parent()[0].id;
        // start up loading status
        if (startLoading($that, $node, opts)) {
        // load new nodes
          $.ajax({ 'url': $.isFunction(opts.ajaxURL.parent) ? opts.ajaxURL.parent(nodeData) : opts.ajaxURL.parent + nodeId, 'dataType': 'json' })
          .done(function(data) {
            if ($node.closest('.orgchart').data('inAjax')) {
              if (!$.isEmptyObject(data)) {
                addParent.call($node.closest('.orgchart').parent(), $node, data, opts);
              }
            }
          })
          .fail(function() { console.log('Failed to get parent node data'); })
          .always(function() { endLoading($that, $node, opts); });
        }
      }
    });

    // bind click event handler for the bottom edge
    $nodeDiv.on('click', '.bottomEdge', function(event) {
      event.stopPropagation();
      var $that = $(this);
      var $node = $that.parent();
      var childrenState = getNodeState($node, 'children');
      if (childrenState.exist) {
        var $children = $node.closest('tr').siblings(':last');
        if ($children.find('.node:visible').is('.slide')) { return; }
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
          nodeWrapper.appendChild($nodeDiv.wrap('<tr><td' + (hasChildren ? ' colspan="' + $childNodes.length * 2 + '"' : '') + '></td></tr>').closest('tr'));
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
        $nodeWrapper.append('<tr class="lines' + isHidden + '"><td colspan="' + $childNodes.length * 2 + '"><div class="downLine"></div></td></tr>');
      }
      // draw the lines close to children nodes
      var lineLayer = '<tr class="lines' + isHidden + '"><td class="rightLine">&nbsp;</td>';
      for (var i=1; i<$childNodes.length; i++) {
        lineLayer += '<td class="leftLine topLine">&nbsp;</td><td class="rightLine topLine">&nbsp;</td>';
      }
      lineLayer += '<td class="leftLine">&nbsp;</td></tr>';
      var $nodeLayer;
      if (isVerticalLayer) {
        $nodeLayer = $('<ul>');
        if (level + 2 === opts.verticalDepth) {
          $nodeWrapper.append('<tr class="verticalNodes"><td></td></tr>')
            .find('.verticalNodes').children().append($nodeLayer);
        } else {
          $nodeWrapper.append($nodeLayer);
        }
      } else {
        $nodeLayer = $('<tr class="nodes' + isHidden + '">');
        $nodeWrapper.append(lineLayer).append($nodeLayer);
      }
      // recurse through children nodes
      $.each($childNodes, function() {
        var $nodeCell = isVerticalLayer ? $('<li>') : $('<td colspan="2">');
        $nodeLayer.append($nodeCell);
        buildHierarchy($nodeCell, this, level + 1, opts, callback);
      });
    }
  }
}
