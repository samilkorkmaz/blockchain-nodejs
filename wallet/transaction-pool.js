//https://medium.com/coinmonks/part-7-implementing-blockchain-and-cryptocurrency-with-pow-consensus-algorithm-bf9a16063ec1
const Transaction = require('./transaction');

class TransactionPool {
    constructor() {
        this.transactions = [];
    }

    updateOrAddTransaction(transaction) {
        console.log("transaction-pool.updateOrAddTransaction(...)");
        let transactionWithId = this.transactions.find(t => t.id === transaction.id);
        if (transactionWithId) { //transaction exists in pool, update it with new instance
            console.log("Transaction exists in pool, update it with new instance")
            this.transactions[this.transactions.indexOf(transactionWithId)] = transaction;
        }
        else {
            console.log("Add new transactions")
            this.transactions.push(transaction);
        }
    }

    existingTransaction(address) {
        return this.transactions.find(t => t.input.address === address);
    }

    validTransactions() {
        /**
         * valid transactions are the ones whose total output amounts to the input
         * and whose signatures are same
         */
        return this.transactions.filter((transaction) => {
            // reduce function adds up all the items and saves it in variable
            // passed in the arguments, second param is the initial value of the 
            // sum total
            const outputTotal = transaction.outputs.reduce((total, output) => {
                return total + output.amount;
            }, 0);
            if (transaction.input.amount !== outputTotal) {
                console.log(`Invalid transaction from ${transaction.input.address}! 
                    input.amount ${transaction.input.amount} != outputTotal ${outputTotal}`);
                return;
            }

            if (!Transaction.verifyTransaction(transaction)) {
                console.log(`Invalid signature from ${transaction.input.address}!`);
                return;
            }
            return transaction;
        });
    }

    clear() {
        console.log("transaction-pool.clear()");
        this.transactions = [];
    }
}

module.exports = TransactionPool;