(function(){
  'use strict';
  var React = require('react');
  var ReactDOM = require('react-dom');
  var axios = require('axios');
  var Immutable = require('immutable');
  var _ = require('lodash');

  let CommentRow = React.createClass({
    render: function() {
    	let body = highlightText(this.props.comment.body, this.props.filter);
     	let email = highlightText(this.props.comment.email, this.props.filter);

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