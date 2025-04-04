const fs = require('fs');
const anchor = require('@coral-xyz/anchor');

const account = anchor.web3.Keypair.generate();

fs.writeFileSync('./keypair.json', JSON.stringify(account));
