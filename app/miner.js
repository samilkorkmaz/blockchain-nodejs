//https://medium.com/coinmonks/part-8-implementing-blockchain-and-cryptocurrency-with-pow-consensus-algorithm-74e839158f1b
const Transaction = require('../wallet/transaction');
const Wallet = require('../wallet/index');

class Miner {
    constructor(blockchain,transactionPool,wallet,p2pServer){
        this.blockchain = blockchain;
        this.p2pServer = p2pServer;
        this.wallet = wallet;
        this.transactionPool = transactionPool;
    }

    mine() {
        const validTransactions = this.transactionPool.validTransactions();
        if (validTransactions) { //if there is at least one valid transaction
            validTransactions.push(Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet()));
            const block = this.blockchain.addBlock(validTransactions);
            this.p2pServer.syncChain();
            this.transactionPool.clear();
            this.p2pServer.broadcastClearTransactions(); //broadcast every miner to clear their pool
            console.log(`New block mined: ${block.toString()}`);
            return block;
        } else {
            console.log("No valid transactions in pool, cannot mine.");
        }
    }

}

module.exports = Miner;