var markdown = window.markdownit()
    .use(window.markdownitSub)
    .use(window.markdownitSup)
    .use(window.markdownitContainer)
    .use(window.markdownitEmoji);

markdown.options.typographer = true;
markdown.options.breaks = true;

markdown.renderer.rules.emoji = function(token, idx) {
    return window.twemoji.parse(token[idx].content, {size:16});
};

var TerminalLine = React.createClass({
    render: function() {
        console.log(this);
        var rawMarkup = markdown.render(this.props.children.toString());
        return (
            <div className="entry">
                <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
            </div>
        );
    }
});

var TerminalBuffer = React.createClass({
    render: function() {
        console.log(this.props.contents);
        var commentNodes = this.props.contents.map(function (entry) {
            console.log(entry);
            return (
                <TerminalLine>
                    {entry}
                </TerminalLine>
            );
        });
        return (
            <div className="terminal">
                {commentNodes}
            </div>
        );
    }
});

var TotalUI = React.createClass({
    getInitialState: function() {
        return {terminal: []};
    },
    updateTerminal: function(data) {
        if (data.error) {
            console.log(data.error);
            return;
        }
        var terminal = this.state.terminal;
        terminal.push(data.out);
        this.setState({terminal:terminal});
    },
    componentDidMount: function() {
        this.socket = io.connect();
        this.socket.on('terminalOut', this.updateTerminal);
    },
    sendCommand: function(text) {
        this.socket.emit('terminalIn', text);
    },
    render: function() {
        return (
            <div className="container">
                <TerminalBuffer contents={this.state.terminal}/>
                <TerminalEntry send={this.sendCommand} />
            </div>
        );
    }
});

React.render(
  <TotalUI/>,
  document.getElementById('content')
);
