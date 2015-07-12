var Comment = React.createClass({
    render: function() {
        var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
        return (
            <div className="comment">
                <h2 className="commentAuthor">{this.props.author}</h2>
                <span dangerouslySetInnerHTML={{__html:rawMarkup}} />
            </div>
        );
    }
});

var CommentList = React.createClass({
    render: function() {
        var comments = this.props.data.map(function(comment) {
            return (
                <Comment author={comment.author}>{comment.text}</Comment>
            );
        });
        return (
            <div className="commentList">
                {comments}
            </div>
        );
    }
});

var CommentForm = React.createClass({
    sendComment: function(event) {
        event.preventDefault();
        var author = React.findDOMNode(this.refs.author).value.trim();
        var comment = React.findDOMNode(this.refs.comment).value.trim();
        if (!comment || !author)
            return;

        //Send Request
        this.props.onSubmit({author:author, text:comment});

        React.findDOMNode(this.refs.author).value = "";
        React.findDOMNode(this.refs.comment).value = "";
    },
    render: function() {
        return (
            <form className="commentForm" onSubmit={this.sendComment}>
              <input type="text" placeholder="Your name" ref="author" />
              <input type="text" placeholder="Say something..." ref="comment" />
              <input type="submit" value="Post" />
            </form>
        );
    }
});

var CommentBox = React.createClass({
    getInitialState: function() {
        return {data:[]};
    },
    updateUI: function(data) {
        this.setState({data:data});
    },
    onSubmit: function(commentData) {
        this.state.data.push(commentData);
        this.setState(this.state.data);
        this.socket.emit('sendComment', commentData);
    },
    componentDidMount: function() {
        this.socket = io.connect();
        this.socket.on('updateComments', this.updateUI);
    },
    render: function() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.data} />
                <CommentForm onSubmit={this.onSubmit} />
            </div>
        );
    }
});

React.render(
  <CommentBox url="comments" pollInterval={2000}/>,
  document.getElementById('content')
);
