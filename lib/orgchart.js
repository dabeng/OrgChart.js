(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("orgchart", [], factory);
	else if(typeof exports === 'object')
		exports["orgchart"] = factory();
	else
		root["orgchart"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var OrgChart = function () {
	  function OrgChart() {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        chartContainer = _ref.chartContainer,
	        data = _ref.data,
	        _ref$nodeTitle = _ref.nodeTitle,
	        nodeTitle = _ref$nodeTitle === undefined ? 'name' : _ref$nodeTitle,
	        _ref$nodeId = _ref.nodeId,
	        nodeId = _ref$nodeId === undefined ? 'id' : _ref$nodeId,
	        _ref$toggleSiblingsRe = _ref.toggleSiblingsResp,
	        toggleSiblingsResp = _ref$toggleSiblingsRe === undefined ? false : _ref$toggleSiblingsRe,
	        _ref$depth = _ref.depth,
	        depth = _ref$depth === undefined ? 999 : _ref$depth,
	        _ref$chartClass = _ref.chartClass,
	        chartClass = _ref$chartClass === undefined ? '' : _ref$chartClass,
	        _ref$exportButton = _ref.exportButton,
	        exportButton = _ref$exportButton === undefined ? false : _ref$exportButton,
	        _ref$exportFilename = _ref.exportFilename,
	        exportFilename = _ref$exportFilename === undefined ? 'OrgChart' : _ref$exportFilename,
	        _ref$parentNodeSymbol = _ref.parentNodeSymbol,
	        parentNodeSymbol = _ref$parentNodeSymbol === undefined ? 'fa-users' : _ref$parentNodeSymbol,
	        _ref$draggable = _ref.draggable,
	        draggable = _ref$draggable === undefined ? false : _ref$draggable,
	        _ref$direction = _ref.direction,
	        direction = _ref$direction === undefined ? 't2b' : _ref$direction,
	        _ref$pan = _ref.pan,
	        pan = _ref$pan === undefined ? false : _ref$pan,
	        _ref$zoom = _ref.zoom,
	        zoom = _ref$zoom === undefined ? false : _ref$zoom;
	
	    _classCallCheck(this, OrgChart);
	
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
	
	  _createClass(OrgChart, [{
	    key: '_init',
	    value: function _init() {
	      // build the org-chart
	      var opts = this.options,
	          data = opts.data,
	          chart = document.createElement('div');
	
	      chart.setAttribute('data-options', opts);
	      chart.setAttribute('class', 'orgchart' + (opts.chartClass !== '' ? ' ' + opts.chartClass : '') + (opts.direction !== 't2b' ? ' ' + opts.direction : ''));
	      chart.addEventListener('click', function (event) {
	        var node = this._closest(event.target, function (el) {
	          return el.className === 'node';
	        });
	
	        if (!node) {
	          chart.querySelector('.node.focused').removeClass('focused');
	        }
	      }, false);
	      if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object') {
	        if (data.nodeName) {
	          // ul datasource
	          this.buildHierarchy(chart, this._buildJsonDS(data.children[0], 0, opts));
	        } else {
	          // local json datasource
	          this.buildHierarchy(chart, opts.ajaxURL ? data : this._attachRel(data, '00'), 0, opts);
	        }
	      } else {
	        var spinner = document.createElement('i');
	        spinner.setAttribute('class', 'fa fa-circle-o-notch fa-spin spinner');
	        this._getJSON(data).then(function (resp) {
	          //cb
	          this.buildHierarchy(chart, opts.ajaxURL ? resp : this._attachRel(resp, '00'), 0, opts);
	        }).catch(function (err) {
	          console.error('failed to fetch datasource for orgchart', err);
	        }).finally(function () {
	          var spinner = chart.querySelector('.spinner');
	          spinner.parentNode.removeChild(spinner);
	        });
	      }
	      opts.chartContainer.appendChild(chart);
	    }
	  }, {
	    key: '_closest',
	    value: function _closest(el, fn) {
	      return el && (fn(el) ? el : closest(el.parentNode, fn));
	    }
	  }, {
	    key: '_getJSON',
	    value: function _getJSON(url) {
	      var promise = new Promise(function (resolve, reject) {
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
	
	      return promise;
	    }
	  }, {
	    key: '_buildJsonDS',
	    value: function _buildJsonDS(li) {
	      var subObj = {
	        'name': li.firstChild.textContent.trim(),
	        'relationship': (li.parentNode.parentNode.tagName === 'li' ? '1' : '0') + (li.parentNode.children > 1 ? 1 : 0) + (li.children.length ? 1 : 0)
	      };
	
	      if (li.id) {
	        subObj.id = li.id;
	      }
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = li.querySelector('ul').children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var subLi = _step.value;
	
	          if (!subObj.children) {
	            subObj.children = [];
	          }
	          subObj.children.push(buildJsonDS(subLi));
	        }
	      } catch (err) {
	        _didIteratorError = true;
	        _iteratorError = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion && _iterator.return) {
	            _iterator.return();
	          }
	        } finally {
	          if (_didIteratorError) {
	            throw _iteratorError;
	          }
	        }
	      }
	
	      return subObj;
	    }
	  }, {
	    key: '_attachRel',
	    value: function _attachRel(data, flags) {
	      data.relationship = flags + (data.children && data.children.length > 0 ? 1 : 0);
	      if (data.children) {
	        var _iteratorNormalCompletion2 = true;
	        var _didIteratorError2 = false;
	        var _iteratorError2 = undefined;
	
	        try {
	          for (var _iterator2 = data.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	            var item = _step2.value;
	
	            attachRel(item, '1' + (data.children.length > 1 ? 1 : 0));
	          }
	        } catch (err) {
	          _didIteratorError2 = true;
	          _iteratorError2 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion2 && _iterator2.return) {
	              _iterator2.return();
	            }
	          } finally {
	            if (_didIteratorError2) {
	              throw _iteratorError2;
	            }
	          }
	        }
	      }
	      return data;
	    }
	  }, {
	    key: 'buildHierarchy',
	    value: function (_buildHierarchy) {
	      function buildHierarchy(_x, _x2, _x3, _x4, _x5) {
	        return _buildHierarchy.apply(this, arguments);
	      }
	
	      buildHierarchy.toString = function () {
	        return _buildHierarchy.toString();
	      };
	
	      return buildHierarchy;
	    }(function (appendTo, nodeData, level, opts, callback) {
	      var $nodeWrapper;
	      // Construct the node
	      var $childNodes = nodeData.children;
	      var hasChildren = $childNodes ? $childNodes.length : false;
	      var isVerticalNode = opts.verticalDepth && level + 1 >= opts.verticalDepth ? true : false;
	      if (Object.keys(nodeData).length > 1) {
	        // if nodeData has nested structure
	        $nodeWrapper = isVerticalNode ? $appendTo : $('<table>');
	        if (!isVerticalNode) {
	          $appendTo.append($nodeWrapper);
	        }
	        $.when(createNode(nodeData, level, opts)).done(function ($nodeDiv) {
	          if (isVerticalNode) {
	            $nodeWrapper.append($nodeDiv);
	          } else {
	            $nodeWrapper.append($nodeDiv.wrap('<tr><td' + (hasChildren ? ' colspan="' + $childNodes.length * 2 + '"' : '') + '></td></tr>').closest('tr'));
	          }
	          if (callback) {
	            callback();
	          }
	        }).fail(function () {
	          console.log('Failed to creat node');
	        });
	      }
	      // Construct the inferior nodes and connectiong lines
	      if (hasChildren) {
	        if (Object.keys(nodeData).length === 1) {
	          // if nodeData is just an array
	          $nodeWrapper = $appendTo;
	        }
	        var isHidden = level + 1 >= opts.depth ? ' hidden' : '';
	        var isVerticalLayer = opts.verticalDepth && level + 2 >= opts.verticalDepth ? true : false;
	
	        // draw the line close to parent node
	        if (!isVerticalLayer) {
	          $nodeWrapper.append('<tr class="lines' + isHidden + '"><td colspan="' + $childNodes.length * 2 + '"><div class="downLine"></div></td></tr>');
	        }
	        // draw the lines close to children nodes
	        var lineLayer = '<tr class="lines' + isHidden + '"><td class="rightLine">&nbsp;</td>';
	        for (var i = 1; i < $childNodes.length; i++) {
	          lineLayer += '<td class="leftLine topLine">&nbsp;</td><td class="rightLine topLine">&nbsp;</td>';
	        }
	        lineLayer += '<td class="leftLine">&nbsp;</td></tr>';
	        var $nodeLayer;
	        if (isVerticalLayer) {
	          $nodeLayer = $('<ul>');
	          if (level + 2 === opts.verticalDepth) {
	            $nodeWrapper.append('<tr class="verticalNodes"><td></td></tr>').find('.verticalNodes').children().append($nodeLayer);
	          } else {
	            $nodeWrapper.append($nodeLayer);
	          }
	        } else {
	          $nodeLayer = $('<tr class="nodes' + isHidden + '">');
	          $nodeWrapper.append(lineLayer).append($nodeLayer);
	        }
	        // recurse through children nodes
	        $.each($childNodes, function () {
	          var $nodeCell = isVerticalLayer ? $('<li>') : $('<td colspan="2">');
	          $nodeLayer.append($nodeCell);
	          buildHierarchy($nodeCell, this, level + 1, opts, callback);
	        });
	      }
	    })
	  }, {
	    key: 'name',
	    get: function get() {
	      return this._name;
	    }
	  }]);
	
	  return OrgChart;
	}();
	
	exports.default = OrgChart;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;
//# sourceMappingURL=orgchart.js.map