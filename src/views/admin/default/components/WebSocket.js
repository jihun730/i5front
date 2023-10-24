import React, { Component } from 'react';

class WebSocketExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      inputMessage: '',
      socket: null // WebSocket 객체
    };
  }

  componentDidMount() {
    // WebSocket 서버 주소를 지정하여 연결 생성
    const socket = new WebSocket('ws://10.10.10.111:8080/websocket');

    socket.onopen = () => {
      console.log('WebSocket 연결 성공!');
      this.setState({ socket });
    };

    socket.onmessage = event => {
      const receivedMessage = event.data;
      this.setState({ message: receivedMessage });
    };

    socket.onclose = () => {
      console.log('WebSocket 연결 종료');
    };
  }

  componentWillUnmount() {
    // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
    if (this.state.socket) {
      this.state.socket.close();
    }
  }

  sendMessage = () => {
    const { socket, inputMessage } = this.state;
    if (socket) {
      socket.send(inputMessage);
    }
  };

  render() {
    return (
      <div>
        {/* <h1>WebSocket Example</h1> */}
        {/* <div>
          {this.state.message && (
            <p>서버에서 받은 메시지: {this.state.message}</p>
          )}
          <input
            type="text"
            value={this.state.inputMessage}
            onChange={e => this.setState({ inputMessage: e.target.value })}
          />
          <button onClick={this.sendMessage}>메시지 보내기</button>
        </div> */}
      </div>
    );
  }
}

export default WebSocketExample;