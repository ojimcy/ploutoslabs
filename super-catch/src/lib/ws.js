import EventBus from './eventBus';

let socket;
let eventBus = new EventBus();
let messageTopic = eventBus.getTopic('wsMessage');

export const initWebsocket = (gameCode, userId) => {
  const root = 'wss://mining-api-123lfk.ploutoslabs.io';
  // const root = 'ws://91.108.113.167'
  // const root = 'ws://127.0.0.1:3001';
  console.log(`${root}/ws?gameId=${gameCode}&id=${userId}`)
  socket = new WebSocket(`${root}/ws?gameId=${gameCode}&id=${userId}`);

  socket.onmessage = (e) => {
    const msg = JSON.parse(e.data)
    messageTopic.dispatch(msg.type.toString(), msg)
  }

  socket.onopen = () => {
    console.log('connected')
  }

  return socket;
};

export const wsSend = (message) => {
  socket.send(JSON.stringify(message))
}

export const onMessage = (binding, callback) => {
  messageTopic.addListener(binding.toString(), callback);
};
