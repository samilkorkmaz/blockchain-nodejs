const WebSocket = require('ws');

//declare the peer to peer server port 
//const P2P_PORT = process.env.P2P_PORT || 5001;
console.log("process.argv[3]: " + process.argv[3]);
const P2P_PORT = parseInt(process.argv[3]) || 5001;

//list of address to connect to
//const peers = process.env.PEERS ? process.env.PEERS.split(',') : [];
const peers = [];
for (let i = 4; i < process.argv.length; i++) {
    peers.push("ws://localhost:" + process.argv[i]);
}
console.log("peers:");
for (let i = 0; i < peers.length; i++) {
    console.log(peers[i]);
}

const MESSAGE_TYPE = {
    chain: 'CHAIN',
    transaction: 'TRANSACTION',
    clear_transactions: 'CLEAR_TRANSACTIONS'
}

class P2pserver {
    constructor(blockchain, transactionPool) {
        this.blockchain = blockchain;
        this.sockets = [];
        this.transactionPool = transactionPool;
    }
    // create a new p2p server and connections
    listen() {
        // create the p2p server with port as argument
        const server = new WebSocket.Server({ port: P2P_PORT });
        // on any new connection the current instance will send the current chain
        // to the newly connected peer
        server.on('connection', socket => {
            console.log("server.on('connection'...");
            this.connectSocket(socket)
        });
        this.connectToPeers();
        console.log(`Websocket listening for peer to peer connection on port : ${P2P_PORT}`);
    }
    // after making connection to a socket
    connectSocket(socket) {
        this.sockets.push(socket);
        socket.on('message', message => { //called when another peer sends a chain, transaction or clear_transactions
            console.log("socket.on('message'...)");
            const data = JSON.parse(message);
            console.log("P2P_PORT: ", P2P_PORT, ", data ", data);
            switch (data.type) {
                case MESSAGE_TYPE.chain:
                    this.blockchain.replaceChain(data.chain);
                    break;
                case MESSAGE_TYPE.transaction:
                    this.transactionPool.updateOrAddTransaction(data.transaction);
                    break;
                case MESSAGE_TYPE.clear_transactions:
                    this.transactionPool.clear();
                    break;
            }
        });
        this.sendChain(socket); //Share existing chain with peer 
    }

    connectToPeers() {
        console.log("connectToPeers()");
        peers.forEach(peer => {
            const socket = new WebSocket(peer);
            // open event listener is emitted when connection is established with a peer
            // saving the socket in the array
            socket.on('open', () => {
                console.log("socket.on('open'...)");
                this.connectSocket(socket);
            });
        });
    }

    sendChain(socket) {
        console.log("sendChain()")
        socket.send(JSON.stringify({ //triggers socket.on('message'...) of other peers
            type: MESSAGE_TYPE.chain,
            chain: this.blockchain.chain
        }));
    }

    syncChain() {
        console.log("syncChain() called from P2P_PORT " + P2P_PORT);
        this.sockets.forEach(socket => {
            this.sendChain(socket);
        });
    }

    broadcastTransaction(transaction) {
        this.sockets.forEach(socket => {
            this.sendTransaction(socket, transaction);
        });
    }

    sendTransaction(socket, transaction) {
        socket.send(JSON.stringify({ //triggers socket.on('message'...) of other peers
            type: MESSAGE_TYPE.transaction,
            transaction: transaction
        }));
    }

    broadcastClearTransactions() {
        this.sockets.forEach(socket => {
            socket.send(JSON.stringify({//triggers socket.on('message'...) of other peers
                type: MESSAGE_TYPE.clear_transactions
            }))
        })
    }
}

module.exports = P2pserver;