/******/ (function(modules) { // webpackBootstrap
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
/*!***********************************!*\
  !*** ./public/src/helloworld.jsx ***!
  \***********************************/
/***/ function(module, exports) {

	'use strict';
	
	//yaniv aharon ayaniv@gmail.com
	(function () {
	  'use strict';
	  //var trie = require('trie-search');
	  //var ts = new TrieSearch();
	
	
	  var cache = {};
	  var CommentRow = React.createClass({
	    displayName: 'CommentRow',
	
	    render: function render() {
	      var body = highlightText(this.props.comment.body, this.props.filter);
	      var name = highlightText(this.props.comment.name, this.props.filter);
	
	      function highlightText(source, filter) {
	        var highlightText = [];
	        if (!filter) {
	          highlightText.push(source);
	        } else {
	          var regex = new RegExp(filter, 'gi');
	          var segments = source.split(regex);
	          var replacements = source.match(regex);
	          segments.forEach(function (segment, i) {
	            highlightText.push(segment);
	            if (i < segments.length - 1) {
	              highlightText.push(React.DOM.span({
	                className: 'highlight', key: i
	              }, replacements[i]));
	            }
	          }.bind(this));
	          cache["yaniv"] = "yaniv_aharon";
	          console.log(cache["yaniv"]);
	        }
	        return highlightText;
	      }
	
	      return React.createElement(
	        'div',
	        { className: 'comment' },
	        React.createElement(
	          'div',
	          { className: 'commentBody' },
	          body
	        ),
	        React.createElement(
	          'div',
	          { className: 'commentName' },
	          name
	        )
	      );
	    }
	  });
	
	  var CommentsTable = React.createClass({
	    displayName: 'CommentsTable',
	
	    render: function render() {
	      var rows = [];
	
	      this.props.comments.forEach(function (comment) {
	        if (comment.body.toLowerCase().indexOf(this.props.filterText) === -1 && comment.name.toLowerCase().indexOf(this.props.filterText) === -1) {
	          return;
	        }
	        rows.push(React.createElement(CommentRow, { comment: comment, key: comment.id, filter: this.props.filterText.toLowerCase() }));
	      }.bind(this));
	      return React.createElement(
	        'div',
	        null,
	        rows
	      );
	    }
	  });
	
	  var SearchBar = React.createClass({
	    displayName: 'SearchBar',
	
	    handleChange: function handleChange() {
	      this.props.onUserInput(this.refs.filterTextInput.value);
	    },
	    render: function render() {
	      return React.createElement(
	        'form',
	        null,
	        React.createElement('input', {
	          className: 'searchBar',
	          type: 'text',
	          placeholder: 'Search Comment...',
	          value: this.props.filterText,
	          ref: 'filterTextInput',
	          onChange: this.handleChange
	        })
	      );
	    }
	  });
	
	  var FilterableComments = React.createClass({
	    displayName: 'FilterableComments',
	
	    getInitialState: function getInitialState() {
	      return {
	        filterText: '',
	        comments: []
	      };
	    },
	
	    handleUserInput: function handleUserInput(filterText) {
	      this.setState({
	        filterText: filterText
	      });
	    },
	
	    componentDidMount: function componentDidMount() {
	      axios.get(this.props.source).then(function (response) {
	        var comments = response.data.slice(0, 10);
	        //console.log(comments);
	        //ts.addFromObject(comments);
	        this.setState({
	          comments: comments
	        });
	      }.bind(this)).catch(function (error) {
	        console.log(error);
	      });
	    },
	
	    render: function render() {
	      return React.createElement(
	        'div',
	        null,
	        React.createElement(SearchBar, {
	          filterText: this.state.filterText,
	          onUserInput: this.handleUserInput
	        }),
	        React.createElement(CommentsTable, {
	          comments: this.state.comments,
	          filterText: this.state.filterText.toLowerCase()
	        })
	      );
	    }
	  });
	
	  ReactDOM.render(React.createElement(FilterableComments, { source: 'http://jsonplaceholder.typicode.com/comments' }), document.getElementById('container'));
	})();

/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map