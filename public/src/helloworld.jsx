(function(){
  'use strict';
  var React = require('react');
  var ReactDOM = require('react-dom');
  var axios = require('axios');
  var Immutable = require('immutable');
  var _ = require('lodash');

  function getAllIndexes(arr, val) {
      var indexes = [], i = -1;
      while ((i = arr.indexOf(val, i+1)) != -1){
          indexes.push(i);
      }
      return indexes;
  }


  let CommentRow = React.createClass({
    render: function() {
    	let body = this.props.comment.body; // highlightText(, this.props.filter);
      let email = "ayaniv@gmail.com"
     	//let email = highlightText(this.props.comment.email, this.props.filter);

      function highlightText(source, filter) {

        // the function takes the string, and the filter
        // creates a hashmap with the filter as a key and an array of indexes as a value
        // the next time you enter that function, it checked if the filter contains any of the hashmap keys
        // in case there is it will go to the indexes in the key, adding them the delta if needed
        // then look in those indexes to find matches. using the sticky ES6 flag.

        if (!filter) {
          //highlightText.push(source); 
        } else {  

 
          /*
          _.forEach(_.keysIn(filterKeys), function(key) {
            if (key.indexOf(filter))
          });

          //getAllIndexes(source, filter)

          var indexes = getAllIndexes(source, filter);
          filterKeys[filter] = indexes;
*/
        }
        return;    
        var highlightText = [];
        
        if (!filter) {
          highlightText.push(source); 
        } else {  

        
        var list = new Array(source);
        var options = { pre: '<b>', post: '</b>' };
        highlightText = fuzzy.filter(filter, list, options);
        return React.render(highlightText[0].string);  

          var regex = new RegExp(filter, 'gi');
          var segments = source.split(regex);
          var replacements  = source.match(regex);
          segments.forEach(function(segment, i){
              highlightText.push(segment);
              if(i < segments.length -1) {
                highlightText.push(React.DOM.span({
                    className: 'highlight', key: i
                }, replacements[i]));  
              }
          }.bind(this));
        }
 
 
        return highlightText;
      }

      return (
        <div className="comment">
          <div className="commentBody">{body}</div>
          <div className="commentName">{email}</div>
        </div>
      );
    }
  });



  
  
  var filterKeys = {};

  let CommentsTable = React.createClass({

    statics: {
      filterObject: function() {
        
        let findIndexesForFilter = function(collection, filter) {
          var indexes = [];
          _.forEach(collection, function(item, i) {
            if (item.body.indexOf(filter) > -1 || item.email.indexOf(filter) > -1) {
              indexes.push(i)
            }
          });
          return indexes;
        }

        this.getIndexesByFilter = function(collection, filter) {
          if (filter) {
            if (!filterKeys[filter]) {
              filterKeys[filter] = findIndexesForFilter(collection, filter);
            }
          } else {
            filter = '$$null'
            if (!filterKeys[filter]) {
              var a = _.range(0, collection.length);
              console.log(a)  
              filterKeys[filter] = _.range(0, collection.length);  
              console.log(filterKeys);
            }
          }

          return filterKeys[filter]; 
        }
        return this;
      }
    },

    render: function() {
      var rows = [];
      if (this.props.comments) {
        let filterObject = CommentsTable.filterObject();
      var matchesIndexes = filterObject.getIndexesByFilter(this.props.comments, this.props.filterText);
      rows = _.map(matchesIndexes, function(index) {
         var comment = this.props.comments[index];
         return (<CommentRow comment={comment} key={comment.id} filter={this.props.filterText} />);
      }.bind(this));
      
      }
    
      return (
       <div>
        {rows}
       </div>
      );
    }
  });

  let SearchBar = React.createClass({
    handleChange: function() {
      this.props.onUserInput(
        this.refs.filterTextInput.value
      );
    },
    render: function() {
      return (
        <form>
          <input
            className="searchBar"
            type="text"
            placeholder="Search Comment..."
            value={this.props.filterText}
            ref="filterTextInput"
            onChange={this.handleChange}
          />
        </form>
      );
    }
  });

  let FilterableComments = React.createClass({
    getInitialState: function() {
      return {
        filterText: '',
        comments : []
      };
    },

    handleUserInput: function(filterText) {
      this.setState({
        filterText: filterText
      });
    },

    componentDidMount: function() {
  	axios.get(this.props.source)
    	.then(function (response) {
      	let comments = response.data;
        comments = _.map(comments, function(comment) { return _.pick(comment, ['body', 'email', 'id']) });

      	this.setState({
        		comments: comments
      	});
    	}.bind(this))
    	.catch(function (error) {
      	console.log(error);
    	});
    },

    render: function() {
      return (
        <div>

          <SearchBar
            filterText={this.state.filterText}
            onUserInput={this.handleUserInput}
          />
          <CommentsTable
            comments={this.state.comments}
            filterText={this.state.filterText}
          />
        </div>
      );
    }
  });


  ReactDOM.render(
    <FilterableComments source="http://jsonplaceholder.typicode.com/comments" />,
    document.getElementById('container')
  );

})();