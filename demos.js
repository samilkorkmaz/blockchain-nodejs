// server.js
const port = process.env.PORT;
console.log(`Your port is ${port}`);
//argv: 0: node.exe, 1: server.js, 2: HTTP_PORT, 3: P2P_PORT, 4: PEERS
console.log("Command line arguments length: " + process.argv.length);
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
})
console.log("process.argv.slice(2): " + process.argv.slice(2));
const peers = [];
for (let i = 4; i < process.argv.length; i++) {
    peers.push("ws://localhost:" + process.argv[i]);
}
console.log("peers:");
for (let i = 0; i < peers.length; i++) {
    console.log(peers[i]);
}
arrA = [];
arrB = [];
out = [{ e1: 5 }, { e2: 10 }];
arrA.push(out);
arrB.push(...out);
for (let i = 0; i < arrA.length; i++) {
    console.log("arrA[%d]: ", i, arrA[i]);
}
for (let i = 0; i < arrB.length; i++) {
    console.log("arrB[%d]: ", i, arrB[i]);
}
arrC = [];
arrC.push(...[1, 2, 3]);
for (let i = 0; i < arrC.length; i++) {
    console.log("arrC[%d]: ", i, arrC[i]);
}
console.log("reduce() demo");
maxVal = [5, 1, 3, 7].reduce((prev, curr) => //{
    //console.log("prev = ", prev, ", curr = ", curr);
    //return prev > curr ? prev : curr;
    //}
    prev > curr ? prev : curr
);
console.log("maxVal = ", maxVal);
