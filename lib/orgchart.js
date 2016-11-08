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
	
	      this.chart = chart;
	
	      chart.setAttribute('data-options', opts);
	      chart.setAttribute('class', 'orgchart' + (opts.chartClass !== '' ? ' ' + opts.chartClass : '') + (opts.direction !== 't2b' ? ' ' + opts.direction : ''));
	      chart.addEventListener('click', function (event) {
	        var node = this._closest(event.target, function (el) {
	          return el.classList.contains('node');
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
	      return el && (fn(el) ? el : this._closest(el.parentNode, fn));
	    }
	  }, {
	    key: '_siblings',
	    value: function _siblings(el, expr) {
	      var sibs = [];
	
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = el.parseNode.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var child = _step.value;
	
	          if (child !== el) {
	            if (expr) {
	              if (el.matches(expr)) {
	                sibs.push(child);
	              }
	            } else {
	              sibs.push(child);
	            }
	          }
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
	
	      return sibs;
	    }
	  }, {
	    key: '_prevAll',
	    value: function _prevAll(el, expr) {
	      var sibs = [];
	      var preSib = el.previousElementSibling;
	
	      while (preSib) {
	        if (!expr || el.matches(expr)) {
	          sibs.push(preSib);
	        }
	        preSib = preSib.previousElementSibling;
	      }
	      return sibs;
	    }
	  }, {
	    key: '_nextAll',
	    value: function _nextAll(el, expr) {
	      var sibs = [];
	      var nextSib = el.nextElementSibling;
	
	      while (nextSib) {
	        if (!expr || el.matches(expr)) {
	          sibs.push(nextSib);
	        }
	        nextSib = nextSib.nextElementSibling;
	      }
	      return sibs;
	    }
	  }, {
	    key: '_isVisible',
	    value: function _isVisible(el) {
	      return el.offsetParent !== null;
	    }
	  }, {
	    key: '_addClass',
	    value: function _addClass(elements, className) {
	      elements.forEach(function (el) {
	        el.classList.add(className);
	      });
	    }
	  }, {
	    key: '_removeClass',
	    value: function _removeClass(elements, classNames) {
	      elements.forEach(function (el) {
	        if (classNames.indexOf(' ')) {
	          var _iteratorNormalCompletion2 = true;
	          var _didIteratorError2 = false;
	          var _iteratorError2 = undefined;
	
	          try {
	            for (var _iterator2 = classNames.split(' ')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
	              var className = _step2.value;
	
	              el.classList.remove(className);
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
	        } else {
	          el.classList.remove(classNames);
	        }
	      });
	    }
	  }, {
	    key: '_css',
	    value: function _css(elements, prop, val) {
	      elements.forEach(function (el) {
	        el.style[prop] = val;
	      });
	    }
	  }, {
	    key: '_removeAttr',
	    value: function _removeAttr(elements, attr) {
	      elements.forEach(function (el) {
	        el.removeAttr(attr);
	      });
	    }
	  }, {
	    key: '_getJSON',
	    value: function _getJSON(url) {
	      return new Promise(function (resolve, reject) {
	        var client = new XMLHttpRequest();
	
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
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;
	
	      try {
	        for (var _iterator3 = li.querySelector('ul').children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var subLi = _step3.value;
	
	          if (!subObj.children) {
	            subObj.children = [];
	          }
	          subObj.children.push(this._buildJsonDS(subLi));
	        }
	      } catch (err) {
	        _didIteratorError3 = true;
	        _iteratorError3 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion3 && _iterator3.return) {
	            _iterator3.return();
	          }
	        } finally {
	          if (_didIteratorError3) {
	            throw _iteratorError3;
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
	        var _iteratorNormalCompletion4 = true;
	        var _didIteratorError4 = false;
	        var _iteratorError4 = undefined;
	
	        try {
	          for (var _iterator4 = data.children[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	            var item = _step4.value;
	
	            this._attachRel(item, '1' + (data.children.length > 1 ? 1 : 0));
	          }
	        } catch (err) {
	          _didIteratorError4 = true;
	          _iteratorError4 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion4 && _iterator4.return) {
	              _iterator4.return();
	            }
	          } finally {
	            if (_didIteratorError4) {
	              throw _iteratorError4;
	            }
	          }
	        }
	      }
	      return data;
	    }
	  }, {
	    key: '_repaint',
	    value: function _repaint(node) {
	      if (node) {
	        node.style.offsetWidth = node.offsetWidth;
	      }
	    }
	    // whether the cursor is hovering over the node
	
	  }, {
	    key: '_isInAction',
	    value: function _isInAction(node) {
	      return node.querySelector(':scope > .edge').className.indexOf('fa-') > -1;
	    }
	  }, {
	    key: 'hoverNode',
	    value: function hoverNode(event) {
	      var node = event.target,
	          flag = false,
	          topEdge = node.querySelector(':scope > .topEdge'),
	          bottomEdge = node.querySelector(':scope > .bottomEdge'),
	          leftEdge = node.querySelector(':scope > .leftEdge');
	
	      if (event.type === 'mouseenter') {
	        if (topEdge) {
	          flag = this.getNodeState(node, 'parent').visible;
	          topEdge.classList.toggle('fa-chevron-up', !flag);
	          topEdge.classList.toggle('fa-chevron-down', flag);
	        }
	        if (bottomEdge) {
	          flag = this.getNodeState(node, 'children').visible;
	          bottomEdge.classList.toggle('fa-chevron-down', !flag);
	          bottomEdge.classList.toggle('fa-chevron-up', flag);
	        }
	        if (leftEdge) {
	          this._switchHorizontalArrow(node);
	        }
	      } else {
	        node.querySelector(':scope > .edge').classList.remove('fa-chevron-up', 'fa-chevron-down', 'fa-chevron-right', 'fa-chevron-left');
	      }
	    }
	    // define node click event handler
	
	  }, {
	    key: '_clickNode',
	    value: function _clickNode(event) {
	      var node = event.target,
	          chart = this._closest(node, function (el) {
	        return el.classList.contains('orgchart');
	      });
	
	      chart.querySelector('.focused').classList.remove('focused');
	      node.classList.add('focused');
	    }
	    // build the parent node of specific node
	
	  }, {
	    key: '_buildParentNode',
	    value: function _buildParentNode(currentRoot, nodeData, opts, callback) {
	      var table = document.createElement('table');
	
	      nodeData.relationship = '001';
	      this.createNode(nodeData, 0, opts || this.chart.dataset.options).then(function (nodeDiv) {
	        var chart = this.chart;
	
	        nodeDiv.classList.remove('slide-up');
	        nodeDiv.classList.add('slide-down');
	        table.innerHTML = '\n          <tr class="hidden"><td colspan="2"></td></tr>\n          <tr class="lines hidden"><td colspan="2"><div class="downLine"></div></td></tr>\n          <tr class="lines hidden"><td class="rightLine">&nbsp;</td><td class="leftLine">&nbsp;</td></tr>\n          <tr class="nodes"><td colspan="2"></td></tr>\n        ';
	        table.firstChild.firstChild.appendChild(nodeDiv);
	        chart.insertBefore(table, chart.firstChild);
	        table.lastChild.firstChild.appendChild(chart.lastChild);
	        callback();
	      }).catch(function (err) {
	        console.error('Failed to create parent node', err);
	      });
	    }
	    // show the parent node of the specified node
	
	  }, {
	    key: 'showParent',
	    value: function showParent(node) {
	      // just show only one superior level
	      var temp = this._closest(node, function (el) {
	        return el.nodeName === 'TABLE';
	      }).parentNode.children;
	
	      var _iteratorNormalCompletion5 = true;
	      var _didIteratorError5 = false;
	      var _iteratorError5 = undefined;
	
	      try {
	        for (var _iterator5 = temp[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	          var tr = _step5.value;
	
	          tr.classList.remove('hidden');
	        }
	        // just show only one line
	      } catch (err) {
	        _didIteratorError5 = true;
	        _iteratorError5 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion5 && _iterator5.return) {
	            _iterator5.return();
	          }
	        } finally {
	          if (_didIteratorError5) {
	            throw _iteratorError5;
	          }
	        }
	      }
	
	      this._addClass(temp[2].children.slice(1, -1), 'hidden');
	      // show parent node with animation
	      var parent = temp[0].querySelector('.node');
	
	      this._repaint(parent);
	      parent.classList.add('slide');
	      parent.classList.remove('slide-down');
	      parent.addEventListener('transitionend', function () {
	        parent.classList.remove('slide');
	        if (this._isInAction(node)) {
	          this._switchVerticalArrow(node.querySelector(':scope > .topEdge'));
	        }
	      }, { 'once': true });
	    }
	    // hide the sibling nodes of the specified node
	
	  }, {
	    key: 'hideSiblings',
	    value: function hideSiblings(node, direction) {
	      var nodeContainer = this._closest(node, function (el) {
	        return el.nodeName === 'TABLE';
	      }).parentNode;
	
	      var siblings = this._siblings(nodeContainer);
	
	      var _iteratorNormalCompletion6 = true;
	      var _didIteratorError6 = false;
	      var _iteratorError6 = undefined;
	
	      try {
	        for (var _iterator6 = siblings[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	          var _sib2 = _step6.value;
	
	          if (_sib2.querySelector('.spinner')) {
	            this.chart.dataset.inAjax = false;
	          }
	        }
	      } catch (err) {
	        _didIteratorError6 = true;
	        _iteratorError6 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion6 && _iterator6.return) {
	            _iterator6.return();
	          }
	        } finally {
	          if (_didIteratorError6) {
	            throw _iteratorError6;
	          }
	        }
	      }
	
	      if (!direction || direction && direction === 'left') {
	        var preSibs = this._prevAll(nodeContainer);
	
	        var _iteratorNormalCompletion7 = true;
	        var _didIteratorError7 = false;
	        var _iteratorError7 = undefined;
	
	        try {
	          for (var _iterator7 = preSibs[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
	            var sib = _step7.value;
	            var _iteratorNormalCompletion8 = true;
	            var _didIteratorError8 = false;
	            var _iteratorError8 = undefined;
	
	            try {
	              for (var _iterator8 = sib.querySelectorAll('.node')[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
	                var _node = _step8.value;
	
	                if (!this._isVisible(_node)) {
	                  _node.classList.add('slide', 'slide-right');
	                }
	              }
	            } catch (err) {
	              _didIteratorError8 = true;
	              _iteratorError8 = err;
	            } finally {
	              try {
	                if (!_iteratorNormalCompletion8 && _iterator8.return) {
	                  _iterator8.return();
	                }
	              } finally {
	                if (_didIteratorError8) {
	                  throw _iteratorError8;
	                }
	              }
	            }
	          }
	        } catch (err) {
	          _didIteratorError7 = true;
	          _iteratorError7 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion7 && _iterator7.return) {
	              _iterator7.return();
	            }
	          } finally {
	            if (_didIteratorError7) {
	              throw _iteratorError7;
	            }
	          }
	        }
	      }
	      if (!direction || direction && direction !== 'left') {
	        var nextSibs = this._nextAll(nodeContainer);
	
	        var _iteratorNormalCompletion9 = true;
	        var _didIteratorError9 = false;
	        var _iteratorError9 = undefined;
	
	        try {
	          for (var _iterator9 = nextSibs[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
	            var _sib = _step9.value;
	            var _iteratorNormalCompletion10 = true;
	            var _didIteratorError10 = false;
	            var _iteratorError10 = undefined;
	
	            try {
	              for (var _iterator10 = _sib.querySelectorAll('.node')[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
	                var _node2 = _step10.value;
	
	                if (!this._isVisible(_node2)) {
	                  _node2.classList.add('slide', 'slide-left');
	                }
	              }
	            } catch (err) {
	              _didIteratorError10 = true;
	              _iteratorError10 = err;
	            } finally {
	              try {
	                if (!_iteratorNormalCompletion10 && _iterator10.return) {
	                  _iterator10.return();
	                }
	              } finally {
	                if (_didIteratorError10) {
	                  throw _iteratorError10;
	                }
	              }
	            }
	          }
	        } catch (err) {
	          _didIteratorError9 = true;
	          _iteratorError9 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion9 && _iterator9.return) {
	              _iterator9.return();
	            }
	          } finally {
	            if (_didIteratorError9) {
	              throw _iteratorError9;
	            }
	          }
	        }
	      }
	
	      var animatedNodes = [];
	
	      var _iteratorNormalCompletion11 = true;
	      var _didIteratorError11 = false;
	      var _iteratorError11 = undefined;
	
	      try {
	        for (var _iterator11 = this._siblings(nodeContainer)[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
	          var _sib3 = _step11.value;
	
	          animatedNodes.concat(_sib3.querySelectorAll('.slide'));
	        }
	      } catch (err) {
	        _didIteratorError11 = true;
	        _iteratorError11 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion11 && _iterator11.return) {
	            _iterator11.return();
	          }
	        } finally {
	          if (_didIteratorError11) {
	            throw _iteratorError11;
	          }
	        }
	      }
	
	      var lines = [];
	
	      var _iteratorNormalCompletion12 = true;
	      var _didIteratorError12 = false;
	      var _iteratorError12 = undefined;
	
	      try {
	        for (var _iterator12 = animatedNodes[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
	          var _node3 = _step12.value;
	
	          var temp = this._closest(_node3, function (el) {
	            return el.classList.contains('nodes');
	          }).parentNode.firstChild;
	
	          lines.push(temp);
	          lines.push(temp.nextElementSibling);
	        }
	      } catch (err) {
	        _didIteratorError12 = true;
	        _iteratorError12 = err;
	      } finally {
	        try {
	          if (!_iteratorNormalCompletion12 && _iterator12.return) {
	            _iterator12.return();
	          }
	        } finally {
	          if (_didIteratorError12) {
	            throw _iteratorError12;
	          }
	        }
	      }
	
	      lines.forEach(function (line) {
	        line.style.visibility = 'hidden';
	      });
	
	      animatedNodes[0].addEventListener('transitionend', function () {
	        lines.forEach(function (line) {
	          line.removeAttribute('style');
	        });
	        var sibs = [];
	
	        if (direction) {
	          if (direction === 'left') {
	            sibs = this._prevAll(nodeContainer, ':not(.hidden)');
	          } else {
	            sibs = this._nextAll(nodeContainer, ':not(.hidden)');
	          }
	        } else {
	          sibs = this._siblings(nodeContainer);
	        }
	        var temp = this._closest(nodeContainer, function (el) {
	          return el.classList.contains('nodes');
	        }).previousElementSibling.querySelectorAll(':scope > :not(.hidden)');
	
	        var someLines = temp.slice(1, direction ? sibs.length * 2 + 1 : -1);
	
	        this._addClass(someLines, 'hidden');
	        this._removeClass(animatedNodes, 'slide');
	        sibs.querySelectorAll('.node').slice(1).forEach(function (node) {
	          if (this._isVisible(node)) {
	            node.classList.remove('slide-left', 'slide-right');
	            node.classList.add('slide-up');
	          }
	        });
	        this._addClass(sibs.querySelectorAll('.lines'), 'hidden');
	        this._addClass(sibs.querySelectorAll('.nodes'), 'hidden');
	        this._addClass(sibs.querySelectorAll('.verticalNodes'), 'hidden');
	        this._addClass(sibs, 'hidden');
	
	        if (this._isInAction(node)) {
	          this._switchHorizontalArrow(node);
	        }
	      }, { 'once': true });
	    }
	    // recursively hide the ancestor node and sibling nodes of the specified node
	
	  }, {
	    key: 'hideAncestorsSiblings',
	    value: function hideAncestorsSiblings(node) {
	      var temp = this._closest(node, function (el) {
	        return el.classList.contains('nodes');
	      }).parentNode.children;
	
	      if (temp[0].querySelector('.spinner')) {
	        this.chart.dataset.inAjax = false;
	      }
	      // hide the sibling nodes
	      if (this.getNodeState(node, 'siblings').visible) {
	        this.hideSiblings(node);
	      }
	      // hide the lines
	      var lines = temp.slice(1);
	
	      this._css(lines, 'visibility', 'hidden');
	      // hide the superior nodes with transition
	      var parent = temp[0].querySelector('.node'),
	          grandfatherVisible = this.getNodeState(parent, 'parent').visible;
	
	      if (parent && this._isVisible(parent)) {
	        parent.classList.add('slide', 'slide-down');
	        parent.addEventListener('transitionend', function () {
	          parent.classList.remove('slide');
	          this._removeAttr(lines, 'style');
	          this._addClass(temp, 'hidden');
	        }, { 'once': true });
	      }
	      // if the current node has the parent node, hide it recursively
	      if (parent && grandfatherVisible) {
	        this.hideAncestorsSiblings(parent);
	      }
	    }
	    // exposed method
	
	  }, {
	    key: 'addParent',
	    value: function addParent(currentRoot, data, opts) {
	      this._buildParentNode(currentRoot, data, opts, function () {
	        if (!currentRoot.querySelector(':scope .topEdge').length) {
	          var topEdge = document.createElement('i');
	
	          topEdge.setAttribute('class', 'edge verticalEdge topEdge fa');
	          currentRoot.appendChild(topEdge);
	        }
	        this.showParent(currentRoot);
	      });
	    }
	    // define click event handler for the top edge
	
	  }, {
	    key: '_clickTopEdge',
	    value: function _clickTopEdge(event) {
	      event.stopPropagation();
	      var topEdge = event.target,
	          node = topEdge.parentNode,
	          parentState = this.getNodeState(node, 'parent'),
	          opts = this.dataset.options;
	
	      if (parentState.exist) {
	        var temp = this._closest(node, function (el) {
	          return el.classList.contains('nodes');
	        });
	        var parent = temp.parentNode.firstChild.querySelector('.node');
	
	        if (parent.classList.contains('slide')) {
	          return;
	        }
	        // hide the ancestor nodes and sibling nodes of the specified node
	        if (parentState.visible) {
	          this.hideAncestorsSiblings(node);
	          parent.addEventListener('transitionend', function () {
	            if (this._isInAction(node)) {
	              this._switchVerticalArrow(topEdge);
	              tis._switchHorizontalArrow(node);
	            }
	          }, { 'once': true });
	        } else {
	          // show the ancestors and siblings
	          this.showParent(node);
	        }
	      } else {
	        // load the new parent node of the specified node by ajax request
	        var nodeId = topEdge.parentNode.id;
	        // start up loading status
	        if (startLoading(topEdge, node, opts)) {
	          // load new nodes
	          this._getJSON(typeof opts.ajaxURL.parent === 'function' ? opts.ajaxURL.parent(nodeData) : opts.ajaxURL.parent + nodeId).then(function (resp) {
	            var chart = this._closest(node, function (el) {
	              return el.classList.contains('orgchart');
	            });
	            if (chart.dataset.inAjax) {
	              if (!Object.keys(resp).length) {
	                this.addParent(node, data, opts);
	              }
	            }
	          }).catch(function (err) {
	            console.error('Failed to get parent node data.', err);
	          }).finally(function () {
	            this._endLoading(topEdge, node, opts);
	          });
	        }
	      }
	    }
	    // exposed method
	
	  }, {
	    key: 'addChildren',
	    value: function addChildren(node, data, opts) {
	      var opts = opts || $node.closest('.orgchart').data('options');
	      var count = 0;
	      buildChildNode.call($node.closest('.orgchart').parent(), $node.closest('table'), data, opts, function () {
	        if (++count === data.children.length) {
	          if (!$node.children('.bottomEdge').length) {
	            $node.append('<i class="edge verticalEdge bottomEdge fa"></i>');
	          }
	          if (!$node.find('.symbol').length) {
	            $node.children('.title').prepend('<i class="fa ' + opts.parentNodeSymbol + ' symbol"></i>');
	          }
	          showDescendants($node);
	        }
	      });
	    }
	    // bind click event handler for the bottom edge
	
	  }, {
	    key: '_clickBottomEdge',
	    value: function _clickBottomEdge(event) {
	      var _this = this;
	
	      event.stopPropagation();
	      var bottomEdge = event.target,
	          node = bottomEdge.parentNode,
	          childrenState = this.getNodeState(node, 'children');
	
	      if (childrenState.exist) {
	        var temp = this._closest(node, function (el) {
	          return el.matches('tr');
	        }).parentNode.children[3];
	
	        if (temp.fquerySelectorAll('.node').some(function (node) {
	          return _this._isVisible(node) && node.matches('.slide');
	        })) {
	          return;
	        }
	        // hide the descendant nodes of the specified node
	        if (childrenState.visible) {
	          this.hideDescendants(node);
	        } else {
	          // show the descendants
	          this.showDescendants(node);
	        }
	      } else {
	        // load the new children nodes of the specified node by ajax request
	        var nodeId = bottomEdge.parentNode.id;
	
	        if (this._startLoading(bottomEdge, node, opts)) {
	          this._getJSON(typeof opts.ajaxURL.children === 'function' ? opts.ajaxURL.children(nodeData) : opts.ajaxURL.children + nodeId).then(function (resp) {
	            if (this.chart.dataSet.inAjax) {
	              if (resp.children.length) {
	                this.addChildren(node, resp, Object.assign({}, opts, { depth: 0 }));
	              }
	            }
	          }).catch(function (err) {
	            console.error('Failed to get children nodes data', err);
	          }).finally(function () {
	            this._endLoading(bottomEdge, node, opts);
	          });
	        }
	      }
	    }
	    // bind click event handler for the left and right edges
	
	  }, {
	    key: '_clickHorizontalEdge',
	    value: function _clickHorizontalEdge(event) {
	      var _this2 = this;
	
	      event.stopPropagation();
	      var hEdge = event.target,
	          node = hEdge.parentNode,
	          siblingsState = this.getNodeState(node, 'siblings');
	      if (siblingsState.exist) {
	        var temp = this._closest(node, function (el) {
	          return el.matches('table');
	        }).parentNode,
	            siblings = this._siblings(temp);
	
	        if (siblings.querySelectorAll('.node').some(function (node) {
	          return _this2._isVisible(node) && node.matches('.slide');
	        })) {
	          return;
	        }
	        if (opts.toggleSiblingsResp) {
	          var prevSib = this._closest(node, function (el) {
	            return el.matches('table');
	          }).parentNode.previousElementSibling,
	              nextSib = this._closest(node, function (el) {
	            return el.matches('table');
	          }).parentNode.nextElementSibling;
	          if (hEdge.matches('.leftEdge')) {
	            if (prevSib.matches('.hidden')) {
	              this.showSiblings(node, 'left');
	            } else {
	              this.hideSiblings(node, 'left');
	            }
	          } else {
	            if (nextSib.matches('.hidden')) {
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
	        var nodeId = hEdge.parentNode.id,
	            url = this.getNodeState(node, 'parent').exist ? typeof opts.ajaxURL.siblings === 'function' ? opts.ajaxURL.siblings(nodeData) : opts.ajaxURL.siblings + nodeId : typeof opts.ajaxURL.families === 'function' ? opts.ajaxURL.families(nodeData) : opts.ajaxURL.families + nodeId;
	
	        if (this._startLoading(hEdge, node, opts)) {
	          this._getJSON(url).then(function (resp) {
	            if (this.chart.dataSet.inAjax) {
	              if (resp.siblings || resp.children) {
	                this.addSiblings(node, resp, opts);
	              }
	            }
	          }).catch(function (err) {
	            console.err('Failed to get sibling nodes data', err);
	          }).finally(function () {
	            this._endLoading(hEdge, node, opts);
	          });
	        }
	      }
	    }
	    // event handler for toggle buttons in Hybrid(horizontal + vertical) OrgChart
	
	  }, {
	    key: '_clickToggleButton',
	    value: function _clickToggleButton(event) {
	      var that = this,
	          toggleBtn = event.target,
	          descWrapper = toggleBtn.parentNode.nextElementSibling,
	          descendants = descWrapper.querySelectorAll('.node'),
	          children = descWrapper.children.map(function (item) {
	        return item.querySelector('.node');
	      });
	
	      if (children.some(function (item) {
	        return item.matches('.slide');
	      })) {
	        return;
	      }
	      toggleBtn.classList.toggle('fa-plus-square');
	      toggleBtn.classList.toggle('fa-minus-square');
	      if (descendants[0].matches('.slide-up')) {
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
	          var ul = this._closest(descendants[0], function (el) {
	            return el.matches('ul');
	          });
	
	          ul.classList.add('hidden');
	        }, { 'once': true });
	        var subToggleBtn = descendants[0].querySelector('.toggleBtn').classList.remove('fa-minus-square');
	
	        subToggleBtn.classList.add('fa-plus-square');
	      }
	    }
	    // create node
	
	  }, {
	    key: '_createNode',
	    value: function _createNode(nodeData, level, opts) {
	      return new Promise(function (resolve, reject) {
	        var _iteratorNormalCompletion13 = true;
	        var _didIteratorError13 = false;
	        var _iteratorError13 = undefined;
	
	        try {
	          for (var _iterator13 = nodeData.chilren[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
	            var child = _step13.value;
	
	            child.parentId = nodeData.id;
	          }
	
	          // construct the content of node
	        } catch (err) {
	          _didIteratorError13 = true;
	          _iteratorError13 = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion13 && _iterator13.return) {
	              _iterator13.return();
	            }
	          } finally {
	            if (_didIteratorError13) {
	              throw _iteratorError13;
	            }
	          }
	        }
	
	        var nodeDiv = document.createElement('div');
	        if (nodeData[opts.nodeId]) {
	          nodeDiv.id = nodeData[opts.nodeId];
	        }
	        nodeData.setAttribute('class', 'node ' + (nodeData.className || '') + (level >= opts.depth ? ' slide-up' : ''));
	        if (opts.draggable) {
	          nodeDiv.setAttribute('draggable', true);
	        }
	        if (nodeData.parentId) {
	          nodeDiv.setAttribute('data-parent', nodeData.parentId);
	        }
	        nodeDiv.innerHTML = '\n      <div class="title">' + nodeData[opts.nodeTitle] + '</div>\n      ' + (opts.nodeContent ? '<div class="content">' + nodeData[opts.nodeContent] + '</div>' : '') + '\n    ';
	        // append 4 direction arrows or expand/collapse buttons
	        var flags = nodeData.relationship || '';
	
	        if (opts.verticalDepth && level + 2 > opts.verticalDepth) {
	          if (level + 1 >= opts.verticalDepth && Number(flags.substr(2, 1))) {
	            var toggleBtn = document.createElement('i');
	            toggleBtn.setAttribute('class', 'toggleBtn fa fa-minus-square');
	            nodeDiv.appendChild(toggleBtn);
	          }
	        } else {
	          if (Number(flags.substr(0, 1))) {
	            var topEdge = document.createElement('i');
	            topEdge.setAttribute('class', 'edge verticalEdge topEdge fa');
	            $nodeDiv.appendChild(topEdge);
	          }
	          if (Number(flags.substr(1, 1))) {
	            var rightEdge = document.createElement('i');
	            rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
	            nodeDiv.appendChild(rightEdge);
	            var leftEdge = document.createElement('i');
	            rightEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
	            nodeDiv.appendChild(leftEdge);
	          }
	          if (Number(flags.substr(2, 1))) {
	            var bottomEdge = document.createElement('i');
	            bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
	            nodeDiv.appendChild(bottomEdge);
	            var symbol = document.createElement('i');
	            symbol.setAttribute('class', 'fa ' + opts.parentNodeSymbol + ' symbol');
	            var title = nodeDiv.querySelector('.scope > .title');
	            title.insertBefore(symbol, title.children[0]);
	          }
	        }
	
	        nodeDiv.addEventListener('mouseenter', this._hoverNode);
	        nodeDiv.addEventListener('mouseleave', this._hoverNode);
	        nodeDiv.addEventListener('click', this._clickNode);
	        nodeDiv.querySelector('.topEdge').addEventListener('click', this._clickTopEdge);
	        nodeDiv.querySelector('.bottomEdge').addEventListener('click', this._clickBottomEdge);
	        nodeDiv.querySelector('.toggleBtn').addEventListener('click', this._clickToggleButton);
	        nodeDiv.querySelector('.leftEdge').addEventListener('click', this._clickHorizontalEdge);
	        nodeDiv.querySelector('.rightEdge').addEventListener('click', this._clickHorizontalEdge);
	
	        if (opts.draggable) {
	          $nodeDiv.on('dragstart', function (event) {
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
	                nodeCover = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	                ghostNode.appendChild(nodeCover);
	                $nodeDiv.closest('.orgchart').append(ghostNode);
	              } else {
	                ghostNode = $nodeDiv.closest('.orgchart').children('.ghost-node').get(0);
	                nodeCover = $(ghostNode).children().get(0);
	              }
	              var transValues = $nodeDiv.closest('.orgchart').css('transform').split(',');
	              var scale = Math.abs(window.parseFloat(opts.direction === 't2b' || opts.direction === 'b2t' ? transValues[0].slice(transValues[0].indexOf('(') + 1) : transValues[1]));
	              ghostNode.setAttribute('width', $nodeDiv.outerWidth(false));
	              ghostNode.setAttribute('height', $nodeDiv.outerHeight(false));
	              nodeCover.setAttribute('x', 5 * scale);
	              nodeCover.setAttribute('y', 5 * scale);
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
	              if (isFirefox) {
	                // hack for old version of Firefox(< 48.0)
	                nodeCover.setAttribute('fill', 'rgb(255, 255, 255)');
	                nodeCover.setAttribute('stroke', 'rgb(191, 0, 0)');
	                var ghostNodeWrapper = document.createElement('img');
	                ghostNodeWrapper.src = 'data:image/svg+xml;utf8,' + new XMLSerializer().serializeToString(ghostNode);
	                origEvent.dataTransfer.setDragImage(ghostNodeWrapper, xOffset, yOffset);
	              } else {
	                origEvent.dataTransfer.setDragImage(ghostNode, xOffset, yOffset);
	              }
	            }
	            var $dragged = $(this);
	            var $dragZone = $dragged.closest('.nodes').siblings().eq(0).find('.node:first');
	            var $dragHier = $dragged.closest('table').find('.node');
	            $dragged.closest('.orgchart').data('dragged', $dragged).find('.node').each(function (index, node) {
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
	          }).on('dragover', function (event) {
	            event.preventDefault();
	            var $dropZone = $(this);
	            var $dragged = $dropZone.closest('.orgchart').data('dragged');
	            var $dragZone = $dragged.closest('.nodes').siblings().eq(0).find('.node:first');
	            if ($dragged.closest('table').find('.node').index($dropZone) > -1 || opts.dropCriteria && !opts.dropCriteria($dragged, $dragZone, $dropZone)) {
	              event.originalEvent.dataTransfer.dropEffect = 'none';
	            }
	          }).on('dragend', function (event) {
	            $(this).closest('.orgchart').find('.allowedDrop').removeClass('allowedDrop');
	          }).on('drop', function (event) {
	            var $dropZone = $(this);
	            var $orgchart = $dropZone.closest('.orgchart');
	            var $dragged = $orgchart.data('dragged');
	            $orgchart.find('.allowedDrop').removeClass('allowedDrop');
	            var $dragZone = $dragged.closest('.nodes').siblings().eq(0).children();
	            // firstly, deal with the hierarchy of drop zone
	            if (!$dropZone.closest('tr').siblings().length) {
	              // if the drop zone is a leaf node
	              $dropZone.append('<i class="edge verticalEdge bottomEdge fa"></i>').parent().attr('colspan', 2).parent().after('<tr class="lines"><td colspan="2"><div class="downLine"></div></td></tr>' + '<tr class="lines"><td class="rightLine">&nbsp;</td><td class="leftLine">&nbsp;</td></tr>' + '<tr class="nodes"></tr>').siblings(':last').append($dragged.find('.horizontalEdge').remove().end().closest('table').parent());
	            } else {
	              var dropColspan = parseInt($dropZone.parent().attr('colspan')) + 2;
	              var horizontalEdges = '<i class="edge horizontalEdge rightEdge fa"></i><i class="edge horizontalEdge leftEdge fa"></i>';
	              $dropZone.closest('tr').next().addBack().children().attr('colspan', dropColspan);
	              if (!$dragged.find('.horizontalEdge').length) {
	                $dragged.append(horizontalEdges);
	              }
	              $dropZone.closest('tr').siblings().eq(1).children(':last').before('<td class="leftLine topLine">&nbsp;</td><td class="rightLine topLine">&nbsp;</td>').end().next().append($dragged.closest('table').parent());
	              var $dropSibs = $dragged.closest('table').parent().siblings().find('.node:first');
	              if ($dropSibs.length === 1) {
	                $dropSibs.append(horizontalEdges);
	              }
	            }
	            // secondly, deal with the hierarchy of dragged node
	            var dragColspan = parseInt($dragZone.attr('colspan'));
	            if (dragColspan > 2) {
	              $dragZone.attr('colspan', dragColspan - 2).parent().next().children().attr('colspan', dragColspan - 2).end().next().children().slice(1, 3).remove();
	              var $dragSibs = $dragZone.parent().siblings('.nodes').children().find('.node:first');
	              if ($dragSibs.length === 1) {
	                $dragSibs.find('.horizontalEdge').remove();
	              }
	            } else {
	              $dragZone.removeAttr('colspan').find('.bottomEdge').remove().end().end().siblings().remove();
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
	      var _this3 = this;
	
	      // Construct the node
	      var nodeWrapper = void 0,
	          childNodes = nodeData.children,
	          hasChildren = childNodes ? childNodes.length : false,
	          isVerticalNode = opts.verticalDepth && level + 1 >= opts.verticalDepth ? true : false;
	
	      if (Object.keys(nodeData).length > 1) {
	        // if nodeData has nested structure
	        nodeWrapper = isVerticalNode ? appendTo : document.createElement('table');
	        if (!isVerticalNode) {
	          appendTo.appendChild(nodeWrapper);
	        }
	        this._createNode(nodeData, level, opts).then(function (nodeDiv) {
	          if (isVerticalNode) {
	            nodeWrapper.appendChild(nodeDiv);
	          } else {
	            var tr = document.createElement('tr');
	            tr.innerHTML = '\n            <td ' + (hasChildren ? 'colspan="' + childNodes.length * 2 + '"' : '') + '>\n            </td>\n          ';
	            tr.firstChild.appendChild(nodeDiv);
	            nodeWrapper.appendChild(tr);
	          }
	          if (callback) {
	            callback();
	          }
	        }).catch(function (err) {
	          console.error('Failed to creat node', err);
	        });
	      }
	      // Construct the inferior nodes and connectiong lines
	      if (hasChildren) {
	        var isHidden;
	        var isVerticalLayer;
	        var i;
	
	        (function () {
	          if (Object.keys(nodeData).length === 1) {
	            // if nodeData is just an array
	            $nodeWrapper = $appendTo;
	          }
	          isHidden = level + 1 >= opts.depth ? ' hidden' : '';
	          isVerticalLayer = opts.verticalDepth && level + 2 >= opts.verticalDepth ? true : false;
	
	          // draw the line close to parent node
	
	          if (!isVerticalLayer) {
	            var tr = document.createElement('tr');
	            tr.setAttribute('class', 'lines' + isHidden);
	            tr.innerHTML = '\n          <td colspan="' + childNodes.length * 2 + '">\n            <div class="downLine"></div>\n          </td>\n        ';
	            nodeWrapper.appendChild(tr);
	          }
	          // draw the lines close to children nodes
	          for (i = 1; i < $childNodes.length; i++) {
	            lineLayer += '<td class="leftLine topLine">&nbsp;</td><td class="rightLine topLine">&nbsp;</td>';
	          }
	
	          var lineLayer = document.createElement('tr');
	          lineLayer.setAttribute('class', 'lines' + isHidden);
	          lineLayer.innerHTML = '\n          <td class="rightLine"> </td>\n          ' + childNodes.map(function () {
	            return '\n            <td class="leftLine topLine"> </td>\n            <td class="rightLine topLine"> </td>\n          ';
	          }) + '\n          <td class="leftLine"> </td>\n        ';
	          var nodeLayer = void 0;
	
	          if (isVerticalLayer) {
	            nodeLayer = document.createElement('<ul>');
	            if (level + 2 === opts.verticalDepth) {
	              var _tr = document.createElement('tr');
	              _tr.setAttribute('class', 'verticalNodes');
	              _tr.innerHTML = '<td></td>';
	              _tr.firstChild.appendChild(nodeLayer);
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
	          childNodes.map(function () {
	            var nodeCell = void 0;
	
	            if (isVerticalLayer) {
	              nodeCell = document.createElement('li');
	            } else {
	              nodeCell = document.createElement('td');
	              nodeCell.setAttribute('colspan', 2);
	            }
	            nodeLayer.appendChild(nodeCell);
	            buildHierarchy(nodeCell, _this3, level + 1, opts, callback);
	          });
	        })();
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