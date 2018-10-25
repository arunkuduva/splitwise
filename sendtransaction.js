var Web3 = require('web3');
var util = require('ethjs-util');
var tx = require('ethereumjs-tx');
var lightwallet = require('eth-lightwallet');
var config = require('./config.json');
var txutils = lightwallet.txutils;

var web3 = new Web3(new Web3.providers.HttpProvider(config.network));
var interface = require('./interface');

//var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));


var address = config.address; // '0x15e6087A233eF02EF667b9B535Ff87e14Ee05145';
var key = config.key;

var contractAddress = config.contract;
var txOptions = {
    nonce: web3.toHex(web3.eth.getTransactionCount(address)),
    gasLimit: web3.toHex(config.gaslimit),
    gasPrice: web3.toHex(config.gasprice),
    to: config.contractaddress,
	value: web3.toHex(web3.toWei(.0001, 'ether'))
};

var rawTx = txutils.functionTx(interface.interface, 'addfund',[ '0x15e6087A233eF02EF667b9B535Ff87e14Ee05145',10000], txOptions);

function sendRaw(rawTx) {
    var privateKey = new Buffer(key, 'hex');
    var transaction = new tx(rawTx);
    transaction.sign(privateKey);
    var serializedTx = transaction.serialize().toString('hex');
    web3.eth.sendRawTransaction(
    '0x' + serializedTx, function(err, result) {
        if(err) {
            console.log('error is' + err);
        } else {
            console.log('result is ' + result);
        }
    });
}

sendRaw(rawTx);