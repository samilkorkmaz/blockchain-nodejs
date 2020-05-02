//https://medium.com/coinmonks/implementing-blockchain-and-cryptocurrency-with-pow-consensus-algorithm-in-node-js-part-2-4524d0bf36a1
const Block = require('./block');

/**
 * describe is jest specific function
 * name of the object as string for which the test is written
 * function that will define a series of tests
 */
describe("Block", () => {

    let validTransactions, lastBlock, block;
    /**
     * beforeEach allows us to run some code before
     * running any test
     * example creating an instance
     */
    beforeEach(() => {
        validTransactions = 'bar';
        lastBlock = Block.genesis();
        block = Block.mineBlock(lastBlock, validTransactions);
    });
    /**
     * it function is used to write unit tests
     * first param is a description
     * second param is callback arrow function
     */
    it("sets the `data` to match the input", () => {
        /**
         * expect is similar to assert
         * it expects something
         */
        expect(block.validTransactions).toEqual(validTransactions);
    });

    it("sets the `lastHash` to match the hash of the last block", () => {
        expect(block.lastHash).toEqual(lastBlock.hash);
    });
    it('generates a hash that matches the difficutly', () => {
        // use the dynamic difficulty to match the difficulty
        //console.log("difficulty: ", block.difficulty, ", hash: ", block.hash);
        expect(block.hash.substring(0, block.difficulty)).toEqual('0'.repeat(block.difficulty));
    });

    it('lower the difficulty for a slower generated block', () => {
        // 300000 will make it insanely slow
        expect(Block.adjustDifficulty(block, block.timestamp + 300000)).toEqual(block.difficulty - 1);
    });

    it('raise the difficulty for a faster generated block', () => {
        expect(Block.adjustDifficulty(block, block.timestamp + 1)).toEqual(block.difficulty + 1);
    });

})