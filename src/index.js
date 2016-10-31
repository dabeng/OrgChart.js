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
    var opts = this.options
    var data = opts.data;
    var $chart = $('<div>', {
      'data': { 'options': opts },
      'class': 'orgchart' + (opts.chartClass !== '' ? ' ' + opts.chartClass : '') + (opts.direction !== 't2b' ? ' ' + opts.direction : ''),
      'click': function(event) {
        if (!$(event.target).closest('.node').length) {
          $chart.find('.node.focused').removeClass('focused');
        }
      }
    });
    if ($.type(data) === 'object') {
      if (data instanceof $) { // ul datasource
        buildHierarchy($chart, buildJsonDS(data.children()), 0, opts);
      } else { // local json datasource
        buildHierarchy($chart, opts.ajaxURL ? data : attachRel(data, '00'), 0, opts);
      }
    } else {
      $.ajax({
        'url': data,
        'dataType': 'json',
        'beforeSend': function () {
          $chart.append('<i class="fa fa-circle-o-notch fa-spin spinner"></i>');
        }
      })
      .done(function(data, textStatus, jqXHR) {
        buildHierarchy($chart, opts.ajaxURL ? data : attachRel(data, '00'), 0, opts);
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      })
      .always(function() {
        $chart.children('.spinner').remove();
      });
    }
    this.chartContainer.appendChild($chart[0]);
  }
  buildHierarchy($appendTo, nodeData, level, opts, callback) {
    var $nodeWrapper;
    // Construct the node
    var $childNodes = nodeData.children;
    var hasChildren = $childNodes ? $childNodes.length : false;
    var isVerticalNode = (opts.verticalDepth && (level + 1) >= opts.verticalDepth) ? true : false;
    if (Object.keys(nodeData).length > 1) { // if nodeData has nested structure
      $nodeWrapper = isVerticalNode ? $appendTo : $('<table>');
      if (!isVerticalNode) {
        $appendTo.append($nodeWrapper);
      }
      $.when(createNode(nodeData, level, opts))
      .done(function($nodeDiv) {
        if (isVerticalNode) {
          $nodeWrapper.append($nodeDiv);
        }else {
          $nodeWrapper.append($nodeDiv.wrap('<tr><td' + (hasChildren ? ' colspan="' + $childNodes.length * 2 + '"' : '') + '></td></tr>').closest('tr'));
        }
        if (callback) {
          callback();
        }
      })
      .fail(function() {
        console.log('Failed to creat node')
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
