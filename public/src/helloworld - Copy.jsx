//yaniv aharon ayaniv@gmail.com
(function(){
  'use strict';
  var React = require('react');
  var ReactDOM = require('react-dom');
  var axios = require('axios');
  var Immutable = require('immutable');




  var TrieSearch = require('trie-search');
  var _ = require('lodash')
  var trie = new TrieSearch(['body', 'email'], trieOptions);

  var trieOptions = {
    
  min: 1,  // Minimum length of a key to store and search. By default this is 1, but you might improve performance by using 2 or 3
  ignoreCase: true,
  indexField: undefined, // Defaults to undefined. If specified, determines which rows are unique when using get().
  splitOnRegEx: false //   /\s/g // Default regular expression to split all keys into tokens. By default this is any whitespace. Set to 'false' if you have whitespace in your keys!

  }


  

  let CommentRow = React.createClass({
    render: function() {
    	let body = highlightText(this.props.comment.body, this.props.filter);
     	let email = this.props.comment.email; //highlightText(this.props.comment.email, this.props.filter);



      function highlightText(source, filter) {
 





        var highlightText = [];
        if (!filter) {
          highlightText.push(source); 
        } else {  
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

  let CommentsTable = React.createClass({
    render: function() {
      let rows = [];

      this.props.comments.forEach(function(comment) {

        if (comment.body.toLowerCase().indexOf(this.props.filterText) === -1
        	&&
        	comment.email.toLowerCase().indexOf(this.props.filterText) === -1) {
          return;
        }
        rows.push(<CommentRow comment={comment} key={comment.id} filter={this.props.filterText.toLowerCase()} />);
        
      }.bind(this));
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
      	let comments = response.data;//.slice(0, 10);
        for (var i=0; i<3; i++)
        {
         // comments = comments.concat(comments);
        }
 
        comments = _.map(comments, function(comment) { return _.pick(comment, ['body', 'email', 'id']) });
        comments.forEach(function(item) { trie.add(item) });
 
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