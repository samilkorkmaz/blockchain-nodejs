const Transaction = require('./transaction');
const Wallet = require('./index');
const {MINING_REWARD} =require('../config');

describe('Transaction', () => {

    let transaction, wallet, recipient, amountToRecipient;

    beforeEach(() => {
        wallet = new Wallet();
        amountToRecipient = 50;
        recipient = 'r3c1p13nt';
        transaction = new Transaction(wallet, recipient, amountToRecipient);
    });

    it('outputs the `amount` subtracted from the wallet balance', () => {
        //amount sent back to wallet = balance - amountSentToRecipient
        expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(wallet.balance - amountToRecipient);
    });

    it('outputs the `amount` added to the recipient', () => {
        expect(transaction.outputs.find(output => output.address === recipient).amount).toEqual(amountToRecipient);
    });

    it('inputs the balance of the wallet', () => {
        expect(transaction.input.amount).toEqual(wallet.balance);
    });

    it('validates a valid transaction', () => {
        expect(Transaction.verifyTransaction(transaction)).toBe(true);
    });

    it('invalidates a invalid transaction', () => {
        transaction.outputs[0].amount = 500000;
        expect(Transaction.verifyTransaction(transaction)).toBe(false);
    });

    describe('transacting with less balance', () => {
        beforeEach(() => {
            amountToRecipient = 5000;
            transaction = new Transaction(wallet, recipient, amountToRecipient);
        });

        it('does not create the transaction', () => {
            expect(transaction.id).toEqual(undefined);
        })
    });

    describe('updated transaction', () => {
        let amountToNextRecipient, nextRecipient;

        beforeEach(() => {
            amountToNextRecipient = 20;
            nextRecipient = 'n3xt-4ddr355';
            transaction = transaction.update(wallet, nextRecipient, amountToNextRecipient);
        });

        it('substracts the next amount from the sender\'s outouts', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
                .toEqual(wallet.balance - amountToRecipient - amountToNextRecipient);
        });

        it('outputs an amount for the next recipient', () => {
            expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
                .toEqual(amountToNextRecipient);
        })
    });

    describe('creating a reward transaction', () => {
        beforeEach(() => {
            transaction = Transaction.rewardTransaction(wallet, Wallet.blockchainWallet());
        });

        it('reward the miners wallet', () => {
            expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount).toEqual(MINING_REWARD);
        });

    });
});
