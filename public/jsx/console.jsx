var TerminalBuffer = React.createClass({
    render: function() {
        return (
            <div className="terminal">
                <div className="entry">
                    <p>Hello, my old friend.</p>
                </div>
            </div>
        );
    }
});

var TerminalEntry = React.createClass({
    render: function() {
        return (
            <span className="entry">&gt;
            <input type="text" ref="entry" className="hilight" onKeyDown={this.onKeyDownCapture} />
            </span>
        );
    },
    commandBuffer: [],
    commandBufferIndex: 0,
    sendCommand: function() {
        var commandText = React.findDOMNode(this.refs.entry).value;

        if (commandText.trim() === '')
            return;

        React.findDOMNode(this.refs.entry).value = '';

        this.commandBuffer.push(commandText);
        while (this.commandBuffer.length > 100)
            this.commandBuffer.pop();

        this.commandBufferIndex = this.commandBuffer.length;

        this.props.send(commandText);
    },
    scrollUp: function() {
        if (this.commandBufferIndex === 0)
            return;

        this.commandBufferIndex--;
        var text = this.commandBuffer[this.commandBufferIndex] || '';
        React.findDOMNode(this.refs.entry).value = text;
    },
    scrollDown: function() {
        if (this.commandBufferIndex == this.commandBuffer.length)
            return;

        this.commandBufferIndex++;
        var text = (this.commandBufferIndex == this.commandBuffer.length)?'':(this.commandBuffer[this.commandBufferIndex] || '');
        React.findDOMNode(this.refs.entry).value = text;
    },
    firstCommand: function() {
        this.commandBufferIndex = 0;
        var text = this.commandBuffer[0] || '';
        React.findDOMNode(this.refs.entry).value = text;
    },
    lastCommand: function() {
        this.commandBufferIndex = this.commandBuffer.length;
        React.findDOMNode(this.refs.entry).value = '';
    },
    onKeyDownCapture: function(event) {
        if (event.keyCode == 38) {
            this.scrollUp();
            event.preventDefault();
        } else if (event.keyCode == 40) {
            this.scrollDown();
            event.preventDefault();
        } else if (event.keyCode == 36) {
            this.firstCommand();
            event.preventDefault();
        } else if (event.keyCode == 35) {
            this.lastCommand();
            event.preventDefault();
        } else if (event.keyCode == 13) {
            this.sendCommand();
            event.preventDefault();
        }
    }
});

var TotalUI = React.createClass({
    updateUI: function(data) {
    },
    componentDidMount: function() {
        this.socket = io.connect();
        this.socket.on('updateComments', this.updateUI);
    },
    sendCommand: function(text) {

    },
    render: function() {
        return (
            <div className="container">
                <TerminalBuffer/>
                <TerminalEntry send={this.sendCommand} />
            </div>
        );
    }
});

React.render(
  <TotalUI/>,
  document.getElementById('content')
);
