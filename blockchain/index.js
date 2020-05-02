//https://medium.com/coinmonks/implementing-blockchain-and-cryptocurrency-with-pow-consensus-algorithm-in-node-js-part-2-4524d0bf36a1
const Block = require('./block');

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }
    addBlock(validTransactions) {
        const lastBlock = this.chain[this.chain.length - 1];
        const block = Block.mineBlock(lastBlock, validTransactions);
        this.chain.push(block);
        return block;
    }
    isValidChain(chain) {
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
            console.log("JSON.stringify(chain[0])        = " + JSON.stringify(chain[0]));
            console.log("JSON.stringify(Block.genesis()) = " + JSON.stringify(Block.genesis()));
            return false;
        }
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const lastBlock = chain[i - 1];
            if ((block.lastHash !== lastBlock.hash) || (block.hash !== Block.blockHash(block))) {
                console.log("block.lastHash = " + block.lastHash);
                console.log("lastBlock.hash = " + lastBlock.hash);
                console.log("block.hash             = " + block.hash);
                console.log("Block.blockHash(block) = " + Block.blockHash(block));
                return false;
            }
        }
        return true;
    }
    replaceChain(newChain) {
        console.log("chain.length = " + this.chain.length + ", newChain.length = " + newChain.length);
        if (newChain.length <= this.chain.length) {
            console.log("Received chain is not longer than the current chain");
            return;
        } else if (!this.isValidChain(newChain)) {
            console.log("Received chain is invalid");
            return;
        }
        console.log("Replacing the current chain with new longer chain");
        this.chain = newChain;
    }
}

module.exports = Blockchain;