const express = require('express');
const Blockchain = require('../blockchain');
const bodyParser = require('body-parser');
const P2pServer = require('./p2p-server.js');
const Wallet = require('../wallet');
const TransactionPool = require('../wallet/transaction-pool');
const Miner = require('./miner');

const wallet = new Wallet();
const transactionPool = new TransactionPool();

//get the port from the user or set the default port
//const HTTP_PORT = process.env.HTTP_PORT || 3001;
console.log("process.argv[2]: " + process.argv[2]);
const HTTP_PORT = parseInt(process.argv[2]) || 3001;

const app = express();
app.use(bodyParser.json());

const blockchain = new Blockchain();
const p2pServer = new P2pServer(blockchain, transactionPool);
const miner = new Miner(blockchain, transactionPool, wallet, p2pServer);

//HTTP APIs
app.get('/blocks', (req, res) => {
    res.json(blockchain.chain);
});

//mine/add blocks
app.post('/mine', (req, res) => {
    const block = blockchain.addBlock(req.body.data);
    console.log(`New block added: ${block.toString()}`);
    res.redirect('/blocks'); //returns updated chain to caller
    p2pServer.syncChain();
});

app.get('/viewTransactions', (req, res) => {
    res.json(transactionPool.transactions);
});

app.post('/createTransaction', (req, res) => {
    console.log("Creating a transaction...");
    const { recipient, amount } = req.body;
    const transaction = wallet.createTransaction(
        recipient,
        amount,
        blockchain,
        transactionPool);
    p2pServer.broadcastTransaction(transaction);
    res.redirect('/viewTransactions');
});

app.get('/public-key', (req, res) => {
    res.json({ publicKey: wallet.publicKey });
});

app.get('/mine-transactions', (req, res) => {
    const block = miner.mine();
    res.redirect('/blocks');
});

// app server configurations
app.listen(HTTP_PORT, () => {
    console.log(`HTTP (GET/POST) listening on port ${HTTP_PORT}`);
})

p2pServer.listen();
