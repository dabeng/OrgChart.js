(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("OrgChart", [], factory);
	else if(typeof exports === 'object')
		exports["OrgChart"] = factory();
	else
		root["OrgChart"] = factory();
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
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var OrgChart = function () {
	  function OrgChart() {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	        chartContainer = _ref.chartContainer,
	        data = _ref.data,
	        _ref$nodeTitle = _ref.nodeTitle,
	        nodeTitle = _ref$nodeTitle === undefined ? 'name' : _ref$nodeTitle,
	        nodeContent = _ref.nodeContent,
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
	    this.data = data;
	    this.options = {
	      'chartContainer': chartContainer,
	      'nodeTitle': nodeTitle,
	      'nodeContent': nodeContent,
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
	          data = this.data,
	          chart = document.createElement('div');
	
	      this.chart = chart;
	      chart.dataset.options = JSON.stringify(opts);
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
	      document.querySelector(opts.chartContainer).appendChild(chart);
	    }
	  }, {
	    key: '_closest',
	    value: function _closest(el, fn) {
	      return el && (fn(el) ? el : this._closest(el.parentNode, fn));
	    }
	  }, {
	    key: '_siblings',
	    value: function _siblings(el, expr) {
	      return Array.from(el.parentNode.children).filter(function (child) {
	        if (child !== el) {
	          if (expr) {
	            return el.matches(expr);
	          }
	          return true;
	        }
	        return false;
	      });
	    }
	  }, {
	    key: '_prevAll',
	    value: function _prevAll(el, expr) {
	      var sibs = [],
	          prevSib = el.previousElementSibling;
	
	      while (prevSib) {
	        if (!expr || prevSib.matches(expr)) {
	          sibs.push(prevSib);
	        }
	        prevSib = prevSib.previousElementSibling;
	      }
	      return sibs;
	    }
	  }, {
	    key: '_nextAll',
	    value: function _nextAll(el, expr) {
	      var sibs = [];
	      var nextSib = el.nextElementSibling;
	
	      while (nextSib) {
	        if (!expr || nextSib.matches(expr)) {
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
	    value: function _addClass(elements, classNames) {
	      elements.forEach(function (el) {
	        if (classNames.indexOf(' ') > 0) {
	          classNames.split(' ').forEach(function (className) {
	            return el.classList.add(className);
	          });
	        } else {
	          el.classList.add(classNames);
	        }
	      });
	    }
	  }, {
	    key: '_removeClass',
	    value: function _removeClass(elements, classNames) {
	      elements.forEach(function (el) {
	        if (classNames.indexOf(' ') > 0) {
	          classNames.split(' ').forEach(function (className) {
	            return el.classList.remove(className);
	          });
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
	    key: '_one',
	    value: function _one(el, type, listener, self) {
	      var one = function one(event) {
	        try {
	          listener.call(self, event);
	        } finally {
	          el.removeEventListener(type, one);
	        }
	      };
	
	      el.addEventListener(type, one);
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
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;
	
	      try {
	        for (var _iterator = li.querySelector('ul').children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var subLi = _step.value;
	
	          if (!subObj.children) {
	            subObj.children = [];
	          }
	          subObj.children.push(this._buildJsonDS(subLi));
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
	
	            this._attachRel(item, '1' + (data.children.length > 1 ? 1 : 0));
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
	    // detect the exist/display state of related node
	
	  }, {
	    key: '_getNodeState',
	    value: function _getNodeState(node, relation) {
	      var _this = this;
	
	      var criteria = void 0,
	          state = { 'exist': false, 'visible': false };
	
	      if (relation === 'parent') {
	        criteria = this._closest(node, function (el) {
	          return el.classList.contains('nodes');
	        });
	        if (criteria) {
	          state.exist = true;
	        }
	        if (this._isVisible(criteria.previousElementSibling)) {
	          state.visible = true;
	        }
	      } else if (relation === 'children') {
	        criteria = this._closest(node, function (el) {
	          return el.nodeName === 'TR';
	        }).nextElementSibling;
	        if (criteria) {
	          state.exist = true;
	        }
	        if (this._isVisible(criteria)) {
	          state.visible = true;
	        }
	      } else if (relation === 'siblings') {
	        criteria = this._siblings(this._closest(node, function (el) {
	          return el.nodeName === 'TABLE';
	        }).parentNode);
	        if (criteria.length) {
	          state.exist = true;
	        }
	        if (criteria.some(function (el) {
	          return _this._isVisible(el);
	        })) {
	          state.visible = true;
	        }
	      }
	
	      return state;
	    }
	    // find the related nodes
	
	  }, {
	    key: 'getRelatedNodes',
	    value: function getRelatedNodes(node, relation) {
	      if (relation === 'parent') {
	        return this._closest(node, function (el) {
	          return el.classList.contains('nodes');
	        }).parentNode.children[0].querySelector('.node');
	      } else if (relation === 'children') {
	        return Array.from(this._closest(node, function (el) {
	          return el.nodeName === 'TABLE';
	        }).lastChild.children).map(function (el) {
	          return el.querySelector('.node');
	        });
	      } else if (relation === 'siblings') {
	        return this._siblings(this._closest(node, function (el) {
	          return el.nodeName === 'TABLE';
	        }).parentNode).map(function (el) {
	          return el.querySelector('.node');
	        });
	      }
	    }
	  }, {
	    key: '_switchHorizontalArrow',
	    value: function _switchHorizontalArrow(node) {
	      var opts = this.chart.dataset.options,
	          leftEdge = node.querySelector('.leftEdge'),
	          rightEdge = node.querySelector('.rightEdge'),
	          temp = this._closest(node, function (el) {
	        return el.nodeName === 'TABLE';
	      }).parentNode;
	
	      if (opts.toggleSiblingsResp && (typeof opts.ajaxURL === 'undefined' || this._closest(node, function (el) {
	        return el.classList.contains('.nodes');
	      }).dataset.siblingsLoaded)) {
	        var prevSib = temp.previousElementSibling,
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
	        var sibs = this._siblings(temp),
	            sibsVisible = sibs.length ? !sibs.some(function (el) {
	          return el.classList.contains('hidden');
	        }) : false;
	
	        leftEdge.classList.toggle('fa-chevron-right', sibsVisible);
	        leftEdge.classList.toggle('fa-chevron-left', !sibsVisible);
	        rightEdge.classList.toggle('fa-chevron-left', sibsVisible);
	        rightEdge.classList.toggle('fa-chevron-right', !sibsVisible);
	      }
	    }
	  }, {
	    key: '_hoverNode',
	    value: function _hoverNode(event) {
	      var node = event.target,
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
	        Array.from(node.querySelectorAll(':scope > .edge')).forEach(function (el) {
	          el.classList.remove('fa-chevron-up', 'fa-chevron-down', 'fa-chevron-right', 'fa-chevron-left');
	        });
	      }
	    }
	    // define node click event handler
	
	  }, {
	    key: '_clickNode',
	    value: function _clickNode(event) {
	      var node = event.target;
	
	      this.chart.querySelector('.focused').classList.remove('focused');
	      node.classList.add('focused');
	    }
	    // build the parent node of specific node
	
	  }, {
	    key: '_buildParentNode',
	    value: function _buildParentNode(currentRoot, nodeData, opts, callback) {
	      var table = document.createElement('table');
	
	      nodeData.relationship = '001';
	      this._createNode(nodeData, 0, opts || this.chart.dataset.options).then(function (nodeDiv) {
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
	  }, {
	    key: '_switchVerticalArrow',
	    value: function _switchVerticalArrow(arrow) {
	      arrow.classList.toggle('fa-chevron-up');
	      arrow.classList.toggle('fa-chevron-down');
	    }
	    // show the parent node of the specified node
	
	  }, {
	    key: 'showParent',
	    value: function showParent(node) {
	      // just show only one superior level
	      var temp = this._closest(node, function (el) {
	        return el.nodeName === 'TABLE';
	      }).parentNode.children;
	
	      var _iteratorNormalCompletion3 = true;
	      var _didIteratorError3 = false;
	      var _iteratorError3 = undefined;
	
	      try {
	        for (var _iterator3 = temp[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
	          var tr = _step3.value;
	
	          tr.classList.remove('hidden');
	        }
	        // just show only one line
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
	    // show the sibling nodes of the specified node
	
	  }, {
	    key: 'showSiblings',
	    value: function showSiblings(node, direction) {
	      var _this2 = this;
	
	      // firstly, show the sibling td tags
	      var siblings = [],
	          temp = this._closest(node, function (el) {
	        return el.nodeName === 'TABLE';
	      }).parentNode;
	
	      if (direction) {
	        siblings = direction === 'left' ? this._prevAll(temp) : this._nextAll(temp);
	      } else {
	        siblings = this._siblings(temp);
	      }
	      this._removeClass(siblings, 'hidden');
	      // secondly, show the lines
	      var upperLevel = this._prevAll(this._closest(node, function (el) {
	        return el.classList.contains('nodes');
	      }));
	
	      temp = Array.from(upperLevel[0].querySelectorAll(':scope > .hidden'));
	      if (direction) {
	        this._removeClass(temp.slice(0, siblings.length * 2), 'hidden');
	      } else {
	        this._removeClass(temp, 'hidden');
	      }
	      // thirdly, do some cleaning stuff
	      if (!this._getNodeState(node, 'parent').visible) {
	        this._removeClass(upperLevel, 'hidden');
	        var parent = upperLevel[0].querySelector('.node');
	
	        this._one(parent, 'transitionend', function (event) {
	          event.target.classList.remove('slide');
	        }, this);
	        this._repaint(parent);
	        parent.classLIst.add('slide');
	        parent.classLIst.remove('slide-down');
	      }
	      // lastly, show the sibling nodes with animation
	      siblings.forEach(function (sib) {
	        Array.from(sib.querySelectorAll('.node')).forEach(function (node) {
	          if (_this2._isVisible(node)) {
	            node.classList.add('slide');
	            node.classList.remove('slide-left', 'slide-right');
	          }
	        });
	      });
	      this._one(siblings[0].querySelector('.slide'), 'transitionend', function () {
	        var _this3 = this;
	
	        siblings.forEach(function (sib) {
	          _this3._removeClass(Array.from(sib.querySelectorAll('.slide')), 'slide');
	        });
	        if (this._isInAction(node)) {
	          this._switchHorizontalArrow(node);
	          node.querySelector('.topEdge').classList.remove('fa-chevron-up');
	          node.querySelector('.topEdge').classList.add('fa-chevron-down');
	        }
	      }, this);
	    }
	    // hide the sibling nodes of the specified node
	
	  }, {
	    key: 'hideSiblings',
	    value: function hideSiblings(node, direction) {
	      var _this4 = this;
	
	      var nodeContainer = this._closest(node, function (el) {
	        return el.nodeName === 'TABLE';
	      }).parentNode,
	          siblings = this._siblings(nodeContainer);
	
	      siblings.forEach(function (sib) {
	        if (sib.querySelector('.spinner')) {
	          _this4.chart.dataset.inAjax = false;
	        }
	      });
	
	      if (!direction || direction && direction === 'left') {
	        var preSibs = this._prevAll(nodeContainer);
	
	        preSibs.forEach(function (sib) {
	          Array.from(sib.querySelectorAll('.node')).forEach(function (node) {
	            if (_this4._isVisible(node)) {
	              node.classList.add('slide', 'slide-right');
	            }
	          });
	        });
	      }
	      if (!direction || direction && direction !== 'left') {
	        var nextSibs = this._nextAll(nodeContainer);
	
	        nextSibs.forEach(function (sib) {
	          Array.from(sib.querySelectorAll('.node')).forEach(function (node) {
	            if (_this4._isVisible(node)) {
	              node.classList.add('slide', 'slide-left');
	            }
	          });
	        });
	      }
	
	      var animatedNodes = [];
	
	      this._siblings(nodeContainer).forEach(function (sib) {
	        Array.prototype.push.apply(animatedNodes, Array.from(sib.querySelectorAll('.slide')));
	      });
	      var lines = [];
	
	      var _iteratorNormalCompletion4 = true;
	      var _didIteratorError4 = false;
	      var _iteratorError4 = undefined;
	
	      try {
	        for (var _iterator4 = animatedNodes[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
	          var _node = _step4.value;
	
	          var temp = this._closest(_node, function (el) {
	            return el.classList.contains('nodes');
	          }).previousElementSibling;
	
	          lines.push(temp);
	          lines.push(temp.previousElementSibling);
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
	
	      lines = [].concat(_toConsumableArray(new Set(lines)));
	      lines.forEach(function (line) {
	        line.style.visibility = 'hidden';
	      });
	
	      this._one(animatedNodes[0], 'transitionend', function (event) {
	        var _this5 = this;
	
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
	        var temp = Array.from(this._closest(nodeContainer, function (el) {
	          return el.classList.contains('nodes');
	        }).previousElementSibling.querySelectorAll(':scope > :not(.hidden)'));
	
	        var someLines = temp.slice(1, direction ? sibs.length * 2 + 1 : -1);
	
	        this._addClass(someLines, 'hidden');
	        this._removeClass(animatedNodes, 'slide');
	        sibs.forEach(function (sib) {
	          Array.from(sib.querySelectorAll('.node')).slice(1).forEach(function (node) {
	            if (_this5._isVisible(node)) {
	              node.classList.remove('slide-left', 'slide-right');
	              node.classList.add('slide-up');
	            }
	          });
	        });
	        sibs.forEach(function (sib) {
	          _this5._addClass(Array.from(sib.querySelectorAll('.lines')), 'hidden');
	          _this5._addClass(Array.from(sib.querySelectorAll('.nodes')), 'hidden');
	          _this5._addClass(Array.from(sib.querySelectorAll('.verticalNodes')), 'hidden');
	        });
	        this._addClass(sibs, 'hidden');
	
	        if (this._isInAction(node)) {
	          this._switchHorizontalArrow(node);
	        }
	      }, this);
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
	      if (this._getNodeState(node, 'siblings').visible) {
	        this.hideSiblings(node);
	      }
	      // hide the lines
	      var lines = temp.slice(1);
	
	      this._css(lines, 'visibility', 'hidden');
	      // hide the superior nodes with transition
	      var parent = temp[0].querySelector('.node'),
	          grandfatherVisible = this._getNodeState(parent, 'parent').visible;
	
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
	          parentState = this._getNodeState(node, 'parent'),
	          opts = this.chart.dataset.options;
	
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
	              this._switchHorizontalArrow(node);
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
	        if (this._startLoading(topEdge, node, opts)) {
	          // load new nodes
	          this._getJSON(typeof opts.ajaxURL.parent === 'function' ? opts.ajaxURL.parent(node.dataset.source) : opts.ajaxURL.parent + nodeId).then(function (resp) {
	            if (this.chart.dataset.inAjax) {
	              if (!Object.keys(resp).length) {
	                this.addParent(node, resp, opts);
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
	    // recursively hide the descendant nodes of the specified node
	
	  }, {
	    key: 'hideDescendants',
	    value: function hideDescendants(node) {
	      var that = this,
	          temp = this._nextAll(node.parentNode.parentNode),
	          lines = [];
	
	      if (temp[2].querySelector('.spinner')) {
	        this.chart.dataset.inAjax = false;
	      }
	      var descendants = Array.from(temp[2].querySelectorAll('.node')).filter(function (el) {
	        return that._isVisible(el);
	      }),
	          isVerticalDesc = temp[2].classList.contains('verticalNodes');
	
	      if (!isVerticalDesc) {
	        descendants.forEach(function (desc) {
	          Array.prototype.push.apply(lines, that._prevAll(that._closest(desc, function (el) {
	            return el.classList.contains('nodes');
	          }), '.lines'));
	        });
	        lines = [].concat(_toConsumableArray(new Set(lines)));
	        this._css(lines, 'visibility', 'hidden');
	      }
	      this._one(descendants[0], 'transitionend', function (event) {
	        if (event.propertyName === 'top') {
	          this._removeClass(descendants, 'slide');
	          if (isVerticalDesc) {
	            that._addClass(temp, 'hidden');
	          } else {
	            lines.forEach(function (el) {
	              el.removeAttribute('style');
	              el.classList.add('hidden');
	              el.parentNode.lastChild.classList.add('hidden');
	            });
	            this._addClass(Array.from(temp[2].querySelectorAll('.verticalNodes')), 'hidden');
	          }
	          if (this._isInAction(node)) {
	            this._switchVerticalArrow(node.querySelector('.bottomEdge'));
	          }
	        }
	      }, this);
	      this._addClass(descendants, 'slide slide-up');
	    }
	    // show the children nodes of the specified node
	
	  }, {
	    key: 'showDescendants',
	    value: function showDescendants(node) {
	      var _this6 = this;
	
	      var that = this,
	          temp = this._nextAll(node.parentNode.parentNode),
	          descendants = [];
	
	      this._removeClass(temp, 'hidden');
	      if (temp.some(function (el) {
	        return el.classList.contains('verticalNodes');
	      })) {
	        temp.forEach(function (el) {
	          Array.prototype.push.apply(descendants, Array.from(el.querySelectorAll('.node')).filter(function (el) {
	            return that._isVisible(el);
	          }));
	        });
	      } else {
	        Array.from(temp[2].children).forEach(function (el) {
	          Array.prototype.push.apply(descendants, Array.from(el.querySelector('tr').querySelectorAll('.node')).filter(function (el) {
	            return that._isVisible(el);
	          }));
	        });
	      }
	      // the two following statements are used to enforce browser to repaint
	      this._repaint(descendants[0]);
	      this._one(descendants[0], 'transitionend', function (event) {
	        _this6._removeClass(descendants, 'slide');
	        if (_this6._isInAction(node)) {
	          _this6._switchVerticalArrow(node.querySelector('.bottomEdge'));
	        }
	      }, this);
	      this._addClass(descendants, 'slide');
	      this._removeClass(descendants, 'slide-up');
	    }
	    // exposed method
	
	  }, {
	    key: 'addChildren',
	    value: function addChildren(node, data, opts) {
	      if (!opts) {
	        opts = this.chart.dataset.options;
	      }
	      var count = 0;
	
	      this._buildChildNode(this._closest(node, function (el) {
	        return el.nodeName === 'TABLE';
	      }), data, opts, function () {
	        if (++count === data.children.length) {
	          if (!node.querySelector('.bottomEdge')) {
	            var bottomEdge = document.createElement('i');
	
	            bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
	            node.appendChild(bottomEdge);
	          }
	          if (!node.querySelector('.symbol')) {
	            var symbol = document.createElement('i');
	
	            symbol.setAttribute('class', 'fa ' + opts.parentNodeSymbol + ' symbol');
	            node.querySelector(':scope > .title').appendChild(symbol);
	          }
	          this.showDescendants(node);
	        }
	      });
	    }
	    // bind click event handler for the bottom edge
	
	  }, {
	    key: '_clickBottomEdge',
	    value: function _clickBottomEdge(event) {
	      var _this7 = this;
	
	      event.stopPropagation();
	      var opts = this.chart.dataset.options,
	          bottomEdge = event.target,
	          node = bottomEdge.parentNode,
	          childrenState = this._getNodeState(node, 'children');
	
	      if (childrenState.exist) {
	        var temp = this._closest(node, function (el) {
	          return el.nodeName === 'TR';
	        }).parentNode.children[3];
	
	        if (Array.from(temp.querySelectorAll('.node')).some(function (node) {
	          return _this7._isVisible(node) && node.classList.contains('slide');
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
	          this._getJSON(typeof opts.ajaxURL.children === 'function' ? opts.ajaxURL.children(node.dataset.source) : opts.ajaxURL.children + nodeId).then(function (resp) {
	            if (this.chart.dataset.inAjax) {
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
	      var _this8 = this;
	
	      event.stopPropagation();
	      var opts = this.chart.dataset.options,
	          hEdge = event.target,
	          node = hEdge.parentNode,
	          siblingsState = this._getNodeState(node, 'siblings');
	
	      if (siblingsState.exist) {
	        var temp = this._closest(node, function (el) {
	          return el.nodeName === 'TABLE';
	        }).parentNode,
	            siblings = this._siblings(temp);
	
	        if (siblings.some(function (el) {
	          var node = el.querySelector('.node');
	
	          return _this8._isVisible(node) && node.classList.contains('slide');
	        })) {
	          return;
	        }
	        if (opts.toggleSiblingsResp) {
	          var prevSib = this._closest(node, function (el) {
	            return el.nodeName === 'TABLE';
	          }).parentNode.previousElementSibling,
	              nextSib = this._closest(node, function (el) {
	            return el.nodeName === 'TABLE';
	          }).parentNode.nextElementSibling;
	
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
	        var nodeId = hEdge.parentNode.id,
	            url = this._getNodeState(node, 'parent').exist ? typeof opts.ajaxURL.siblings === 'function' ? opts.ajaxURL.siblings(node.dataset.source) : opts.ajaxURL.siblings + nodeId : typeof opts.ajaxURL.families === 'function' ? opts.ajaxURL.families(node.dataset.source) : opts.ajaxURL.families + nodeId;
	
	        if (this._startLoading(hEdge, node, opts)) {
	          this._getJSON(url).then(function (resp) {
	            if (this.chart.dataset.inAjax) {
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
	        return item.classList.contains('.slide');
	      })) {
	        return;
	      }
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
	          var ul = this._closest(descendants[0], function (el) {
	            return el.nodeName === 'ul';
	          });
	
	          ul.classList.add('hidden');
	        }, { 'once': true });
	        var subToggleBtn = descendants[0].querySelector('.toggleBtn').classList.remove('fa-minus-square');
	
	        subToggleBtn.classList.add('fa-plus-square');
	      }
	    }
	  }, {
	    key: '_dispatchClickEvent',
	    value: function _dispatchClickEvent(event) {
	      var classList = event.target.classList;
	
	      if (classList.contains('topEdge')) {
	        this._clickNode(event);
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
	  }, {
	    key: '_onDragStart',
	    value: function _onDragStart(event) {
	      var nodeDiv = event.target,
	          opts = this.chart.dataset.options,
	          isFirefox = /firefox/.test(window.navigator.userAgent.toLowerCase());
	
	      if (isFirefox) {
	        event.dataTransfer.setData('text/html', 'hack for firefox');
	      }
	      // if users enable zoom or direction options
	      if (this.chart.style.transform !== 'none') {
	        var ghostNode = void 0,
	            nodeCover = void 0;
	
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
	        var transValues = this.chart.style.transform.split(','),
	            scale = Math.abs(window.parseFloat(opts.direction === 't2b' || opts.direction === 'b2t' ? transValues[0].slice(transValues[0].indexOf('(') + 1) : transValues[1]));
	
	        ghostNode.setAttribute('width', nodeDiv.offsetWidth);
	        ghostNode.setAttribute('height', nodeDiv.offsetHeight);
	        nodeCover.setAttribute('x', 5 * scale);
	        nodeCover.setAttribute('y', 5 * scale);
	        nodeCover.setAttribute('width', 120 * scale);
	        nodeCover.setAttribute('height', 40 * scale);
	        nodeCover.setAttribute('rx', 4 * scale);
	        nodeCover.setAttribute('ry', 4 * scale);
	        nodeCover.setAttribute('stroke-width', 1 * scale);
	        var xOffset = event.offsetX * scale,
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
	        if (isFirefox) {
	          // hack for old version of Firefox(< 48.0)
	          var ghostNodeWrapper = document.createElement('img');
	
	          ghostNodeWrapper.src = 'data:image/svg+xml;utf8,' + new XMLSerializer().serializeToString(ghostNode);
	          event.dataTransfer.setDragImage(ghostNodeWrapper, xOffset, yOffset);
	          nodeCover.setAttribute('fill', 'rgb(255, 255, 255)');
	          nodeCover.setAttribute('stroke', 'rgb(191, 0, 0)');
	        } else {
	          event.dataTransfer.setDragImage(ghostNode, xOffset, yOffset);
	        }
	      }
	      var dragged = event.target,
	          dragZone = this._closest(dragged, function (el) {
	        return el.classList.contains('.nodes');
	      }).parentNode.children[0].querySelector('.node'),
	          dragHier = this._closest(dragged, function (el) {
	        return el.nodeName === 'TABLE';
	      }).querySelectorAll('.node');
	
	      this.chart.dataset.dragged = dragged;
	      Array.from(this.chart.querySelectorAll('.node')).forEach(function (node) {
	        if (dragHier.index(node) === -1) {
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
	  }, {
	    key: '_onDragOver',
	    value: function _onDragOver(event) {
	      event.preventDefault();
	      var opts = this.chart.dataset.options,
	          dropZone = event.target,
	          dragged = this.chart.dataset.dragged,
	          dragZone = this._closest(dragged, function (el) {
	        return el.classList.contains('.nodes');
	      }).parentNode.children[0].querySelector('.node');
	
	      if (Array.from(this._closest(dragged, function (el) {
	        return el.nodeName === 'TABLE';
	      }).querySelectorAll('.node')).includes(dropZone) || opts.dropCriteria && !opts.dropCriteria(dragged, dragZone, dropZone)) {
	        event.dataTransfer.dropEffect = 'none';
	      }
	    }
	  }, {
	    key: '_onDragEnd',
	    value: function _onDragEnd(event) {
	      Array.from(this.chart.querySelectorAll('.allowedDrop')).forEach(function (el) {
	        el.classList.remove('allowedDrop');
	      });
	    }
	  }, {
	    key: '_onDrop',
	    value: function _onDrop(event) {
	      var dropZone = event.target,
	          chart = this.chart,
	          dragged = chart.dataset.dragged,
	          dragZone = this._closest(dragged, function (el) {
	        return el.classList.contains('.nodes');
	      }).parentNode.children[0].firstChild;
	
	      this._removeClass(chart.querySelectorAll('.allowedDrop'), 'allowedDrop');
	      // firstly, deal with the hierarchy of drop zone
	      if (!dropZone.parentNode.parentNode.nextElementSibling) {
	        // if the drop zone is a leaf node
	        var bottomEdge = document.createElement('i');
	
	        bottomEdge.setAttribute('class', 'edge verticalEdge bottomEdge fa');
	        dropZone.appendChild(bottomEdge);
	        dropZone.parentNode.setAttribute('colspan', 2);
	        var table = this._closest(dropZone, function (el) {
	          return el.nodeName === 'TABLE';
	        }),
	            tr = document.createElement(tr);
	
	        tr.setAttribute('class', 'lines');
	        tr.innerHTML = '<td colspan="2"><div class="downLine"></div></td>';
	        table.appendChild(tr);
	        tr.innerHTML = '<td class="rightLine">&nbsp;</td><td class="leftLine">&nbsp;</td>';
	        table.appendChild(tr);
	        tr.setAttribute('class', 'nodes');
	        tr.innerHTML = '';
	        table.appendChild(tr);
	        var _iteratorNormalCompletion5 = true;
	        var _didIteratorError5 = false;
	        var _iteratorError5 = undefined;
	
	        try {
	          for (var _iterator5 = dragged.querySelectorAll('.horizontalEdge')[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
	            var hEdge = _step5.value;
	
	            dragged.removeChild(hEdge);
	          }
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
	
	        var draggedTd = this._closest(dragged, function (el) {
	          return el.nodeName === 'TABLE';
	        }).parentNode;
	
	        tr.appendChild(draggedTd);
	      } else {
	        var dropColspan = window.parseInt(dropZone.parentNode.colspan) + 2,
	            _hEdge = document.createElement('i');
	
	        dropZone.parentNode.setAttribute('colspan', dropColspan);
	        dropZone.parentNode.parentNode.nextElementSibling.firstChild.setAttribute('colspan', dropColspan);
	        if (!dragged.find('.horizontalEdge').length) {
	          _hEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
	          dragged.appendChild(_hEdge);
	          _hEdge.classList.remove('rightEdge');
	          _hEdge.classList.add('leftEdge');
	          dragged.appendChild(_hEdge);
	        }
	        var temp = dropZone.parentNode.parentNode.nextElementSibling.nextElementSibling,
	            line = document.createElement('td');
	
	        line.setAttribute('class', 'leftLine topLine');
	        line.innerHTML = '&nbsp;';
	        temp.insertBefore(line, temp.lastChild);
	        line.classList.remove('leftLine');
	        line.classList.add('rightLine');
	        temp.insertBefore(line, temp.lastChild);
	        temp.nextElementSibling.appendChild(this._closest(dragged, function (el) {
	          return el.nodeName === 'TABLE';
	        }).parentNode);
	
	        var dropSibs = this._closest(dragged, function (el) {
	          return el.classList.contains('nodes');
	        }).children;
	
	        if (dropSibs.length === 1) {
	          dropSibs[0].firstChild.appendChild(_hEdge);
	          _hEdge.classList.remove('leftEdge');
	          _hEdge.classList.add('rightEdge');
	          dropSibs[0].firstChild.appendChild(_hEdge);
	        }
	      }
	      // secondly, deal with the hierarchy of dragged node
	      var dragColspan = window.parseInt(dragZone.colspan);
	
	      if (dragColspan > 2) {
	        dragZone.setAttribute('colspan', dragColspan - 2);
	        dragZone.parentNode.nextElementSibling.firstChild.setAttribute('colspan', dragColspan - 2);
	        var _temp = dragZone.parentNode.nextElementSibling.nextElementSibling;
	
	        _temp.removeChild(_temp.children[1]);
	        _temp.removeChild(_temp.children[2]);
	
	        var dragSibs = Array.from(dragZone.parentNode.parentNode.children[3].children).map(function (td) {
	          return td.querySelector('.node');
	        });
	
	        if (dragSibs.length === 1) {
	          dragSibs[0].removeChild(dragSibs[0].querySelector('.horizontalEdge'));
	        }
	      } else {
	        dragZone.removeAttribute('colspan');
	        dragZone.removeChild(dragZone.querySelector('.bottomEdge'));
	        Array.from(dragZone.parentNode.parentNode.children).slice(1).forEach(function (tr) {
	          return dragged.parentNode.parentNode.removeChild(tr);
	        });
	      }
	      var customE = new CustomEvent('nodedropped.orgchart', {
	        'draggedNode': dragged,
	        'dragZone': dragZone.children,
	        'dropZone': dropZone
	      });
	
	      chart.dispatchEvent(customE);
	    }
	    // create node
	
	  }, {
	    key: '_createNode',
	    value: function _createNode(nodeData, level, opts) {
	      var that = this;
	
	      return new Promise(function (resolve, reject) {
	        if (nodeData.children) {
	          var _iteratorNormalCompletion6 = true;
	          var _didIteratorError6 = false;
	          var _iteratorError6 = undefined;
	
	          try {
	            for (var _iterator6 = nodeData.children[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
	              var child = _step6.value;
	
	              child.parentId = nodeData.id;
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
	        }
	
	        // construct the content of node
	        var nodeDiv = document.createElement('div');
	
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
	        nodeDiv.innerHTML = '\n        <div class="title">' + nodeData[opts.nodeTitle] + '</div>\n        ' + (opts.nodeContent ? '<div class="content">' + nodeData[opts.nodeContent] + '</div>' : '') + '\n      ';
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
	            nodeDiv.appendChild(topEdge);
	          }
	          if (Number(flags.substr(1, 1))) {
	            var rightEdge = document.createElement('i'),
	                leftEdge = document.createElement('i');
	
	            rightEdge.setAttribute('class', 'edge horizontalEdge rightEdge fa');
	            nodeDiv.appendChild(rightEdge);
	            leftEdge.setAttribute('class', 'edge horizontalEdge leftEdge fa');
	            nodeDiv.appendChild(leftEdge);
	          }
	          if (Number(flags.substr(2, 1))) {
	            var bottomEdge = document.createElement('i'),
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
	          nodeDiv.addEventListener('dragstart', that._onDragStart);
	          nodeDiv.addEventListener('dragover', that._onDragOver);
	          nodeDiv.addEventListener('dragend', that._onDragEnd);
	          nodeDiv.addEventListener('drop', that._onDrop);
	        }
	        // allow user to append dom modification after finishing node create of orgchart
	        if (opts.createNode) {
	          opts.createNode(nodeDiv, nodeData);
	        }
	
	        resolve(nodeDiv);
	      });
	    }
	  }, {
	    key: 'buildHierarchy',
	    value: function buildHierarchy(appendTo, nodeData, level, opts, callback) {
	      // Construct the node
	      var that = this,
	          nodeWrapper = void 0,
	          childNodes = nodeData.children,
	          isVerticalNode = opts.verticalDepth && level + 1 >= opts.verticalDepth;
	
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
	
	            tr.innerHTML = '\n            <td ' + (childNodes ? 'colspan="' + childNodes.length * 2 + '"' : '') + '>\n            </td>\n          ';
	            tr.children[0].appendChild(nodeDiv);
	            nodeWrapper.appendChild(tr);
	          }
	          if (callback) {
	            callback();
	          }
	          // Construct the inferior nodes and connectiong lines
	          if (childNodes) {
	            (function () {
	              if (Object.keys(nodeData).length === 1) {
	                // if nodeData is just an array
	                nodeWrapper = appendTo;
	              }
	              var isHidden = level + 1 >= opts.depth ? ' hidden' : '',
	                  isVerticalLayer = opts.verticalDepth && level + 2 >= opts.verticalDepth;
	
	              // draw the line close to parent node
	              if (!isVerticalLayer) {
	                var _tr = document.createElement('tr');
	
	                _tr.setAttribute('class', 'lines' + isHidden);
	                _tr.innerHTML = '\n              <td colspan="' + childNodes.length * 2 + '">\n                <div class="downLine"></div>\n              </td>\n            ';
	                nodeWrapper.appendChild(_tr);
	              }
	              // draw the lines close to children nodes
	              var lineLayer = document.createElement('tr');
	
	              lineLayer.setAttribute('class', 'lines' + isHidden);
	              lineLayer.innerHTML = '\n            <td class="rightLine">&nbsp;</td>\n            ' + childNodes.slice(1).map(function () {
	                return '\n              <td class="leftLine topLine">&nbsp;</td>\n              <td class="rightLine topLine">&nbsp;</td>\n              ';
	              }).join('') + '\n            <td class="leftLine">&nbsp;</td>\n          ';
	              var nodeLayer = void 0;
	
	              if (isVerticalLayer) {
	                nodeLayer = document.createElement('<ul>');
	                if (level + 2 === opts.verticalDepth) {
	                  var _tr2 = document.createElement('tr');
	
	                  _tr2.setAttribute('class', 'verticalNodes');
	                  _tr2.innerHTML = '<td></td>';
	                  _tr2.firstChild.appendChild(nodeLayer);
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
	              childNodes.forEach(function (child) {
	                var nodeCell = void 0;
	
	                if (isVerticalLayer) {
	                  nodeCell = document.createElement('li');
	                } else {
	                  nodeCell = document.createElement('td');
	                  nodeCell.setAttribute('colspan', 2);
	                }
	                nodeLayer.appendChild(nodeCell);
	                that.buildHierarchy(nodeCell, child, level + 1, opts, callback);
	              });
	            })();
	          }
	        }).catch(function (err) {
	          console.error('Failed to creat node', err);
	        });
	      }
	    }
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
//# sourceMappingURL=OrgChart.js.map