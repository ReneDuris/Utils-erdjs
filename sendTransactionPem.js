const fs = require("fs");
const { UserSigner } = require("@elrondnetwork/erdjs-walletcore/out/userSigner");
const { UserSecretKey } = require("@elrondnetwork/erdjs-walletcore/out/userKeys");
const { Transaction, TransactionPayload,Address,TokenPayment, Account} = require("@elrondnetwork/erdjs");
const { ProxyNetworkProvider}= require ("@elrondnetwork/erdjs-network-providers");
const proxy = new ProxyNetworkProvider("https://devnet-gateway.elrond.com",{ timeout: 30000 });

const pemFile = ("./wallet.pem")

async function GenerateTransaction(){ 
const pem = fs.readFileSync(pemFile).toString('utf8');
let secretKey = UserSecretKey.fromPem(pem, 0);
let account = new Account(secretKey.generatePublicKey().toAddress());
let OnNetwork = await proxy.getAccount(secretKey.generatePublicKey().toAddress());
account.update(OnNetwork);
const signer = new UserSigner(secretKey);

console.log("Build transaction...");
const transaction = new Transaction({
    data: new TransactionPayload("ESDTTransfer@4145524f2d343538626266@6bb72a146c3d2c0000"),
    gasLimit: 500000,
    receiver: new Address("erd1...."),
    value: TokenPayment.egldFromAmount(0),
    chainID: "D"
});
transaction.setNonce(account.getNonceThenIncrement());
console.log("Sign transaction...");
signer.sign(transaction);
console.log("Send transaction...  " + transaction.getHash());
await proxy.sendTransaction(transaction);
}
GenerateTransaction();