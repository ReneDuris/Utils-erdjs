const fs = require("fs");
const {Mnemonic} = require("@elrondnetwork/erdjs-walletcore")
const bip39_1 = require("bip39");
const MNEMONIC_STRENGTH = 256;

let seed = bip39_1.generateMnemonic(MNEMONIC_STRENGTH);
const mnemonic = Mnemonic.fromString(seed);
const buff = mnemonic.deriveKey();
const secretKeyHex = buff.hex();
const pubKeyHex = buff.generatePublicKey().hex();
const combinedKeys = Buffer.from(secretKeyHex + pubKeyHex).toString(
  'base64'
);
const addressFromPubKey = buff.generatePublicKey().toAddress().bech32();
const header = `-----BEGIN PRIVATE KEY for ${addressFromPubKey}-----`;
const footer = `-----END PRIVATE KEY for ${addressFromPubKey}-----`;
const content = `${header}\n${combinedKeys.replace(
  /([^\n]{1,64})/g,
  '$1\n'
)}${footer}`;

fs.writeFileSync('./wallet.pem', content);

