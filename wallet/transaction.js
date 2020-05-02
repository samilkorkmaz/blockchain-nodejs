const ChainUtil = require('../chain-util');
const {MINING_REWARD} = require('../config');

class Transaction {
    constructor(senderWallet, recipientPublicKey, amountToRecipient) {
        if (amountToRecipient > senderWallet.balance) {
            console.log(`AmountToRecipient (${amountToRecipient}) exceeds balance (${senderWallet.balance}), cannot create transaction!`);
            return;
        }
        this.id = ChainUtil.id();
        this.outputs = [
            { address: senderWallet.publicKey, amount: senderWallet.balance - amountToRecipient }, /*amount returned to wallet*/
            { address: recipientPublicKey, amount: amountToRecipient }];
        Transaction.createInput(this, senderWallet);
    }

    static createInput(transaction, senderWallet) {
        transaction.input = {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(ChainUtil.hash(transaction.outputs))
        }
    }

    static verifyTransaction(transaction) {
        return ChainUtil.verifySignature(
            transaction.input.address,
            transaction.input.signature,
            ChainUtil.hash(transaction.outputs)
        )
    }
    update(senderWallet, recipient, amountNext) { //update transactions sent from senderWallet
        console.log("transaction.update(...)");
        const senderOutput = this.outputs.find(output => output.address === senderWallet.publicKey);
        if (amountNext > senderWallet.amount) {
            console.log(`AmountNext (${amountNext}) exceeds balance (${senderWallet.amount}), cannot update transaction!`);
            return;
        }
        senderOutput.amount = senderOutput.amount - amountNext;
        this.outputs.push({ amount: amountNext, address: recipient });
        Transaction.createInput(this, senderWallet);
        return this;
    }

    static rewardTransaction(minerWallet, blockchainWallet) {
        return new this(blockchainWallet /*sender*/, minerWallet.publicKey /*recipient*/, MINING_REWARD);
    }
}

module.exports = Transaction;