//https://medium.com/coinmonks/implementing-blockchain-and-cryptocurrency-with-pow-consensus-algorithm-in-node-js-part-2-4524d0bf36a1
const ChainUtil = require('../chain-util');
const { DIFFICULTY, MINE_RATE } = require('../config');

class Block {
    constructor(timestamp, lastHash, hash, validTransactions, nonce, difficulty) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;//hash of the last block on the chain
        this.hash = hash;
        this.validTransactions = validTransactions;
        this.nonce = nonce;
        this.difficulty = difficulty || DIFFICULTY;
        //console.log("difficulty: ", difficulty, ", DIFFICULTY", DIFFICULTY);
    }
    toString() {
        return `Block - 
        Timestamp         : ${this.timestamp}
        Last Hash         : ${this.lastHash.substring(0, 10)}...
        Hash              : ${this.hash.substring(0, 10)}...
        Nonce             : ${this.nonce}
        validTransactions : ${this.validTransactions}
        Difficulty        : ${this.difficulty}`;
    }
    static genesis() {
        return new this('genesis-time', 'genesis-lasthash', 'genesis-hash', [], 0, DIFFICULTY);
    }
    static hash(timestamp, lastHash, data, nonce, difficulty) {
        return ChainUtil.hash(`${timestamp}${lastHash}${data}${nonce}${difficulty}`);
    }
    static mineBlock(lastBlock, validTransactions) {
        let hash;
        let timestamp;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;
        do {
            nonce++;
            timestamp = Date.now();
            difficulty = Block.adjustDifficulty(lastBlock, timestamp);
            hash = Block.hash(timestamp, lastHash, validTransactions, nonce, difficulty);
            // check if we have the required nb of leading number of zeros
        } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));
        return new this(timestamp, lastHash, hash, validTransactions, nonce, difficulty);
    }
    static blockHash(block) {
        const { timestamp, lastHash, validTransactions, nonce, difficulty } = block;
        return Block.hash(timestamp, lastHash, validTransactions, nonce, difficulty);
    }
    static adjustDifficulty(lastBlock, currentTime) {
        let { difficulty } = lastBlock;
        difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty + 1 : difficulty - 1;
        return difficulty;
    }
}

module.exports = Block;
