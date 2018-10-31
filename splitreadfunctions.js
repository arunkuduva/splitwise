var Web3 = require('web3');
var utils = require('C:/Users/Raaghav/Testing/node_modules/web3/lib/utils/utils');
var config = require('./config.json');
var web3 = new Web3(new Web3.providers.HttpProvider(config.network));

var interface = require('./interface');

var contractAddress = config.contractaddress;
var fromaddress = config.address;


const splitWise = web3.eth.contract(interface.interface);
const contractInstance = splitWise.at(contractAddress);

//var splitWise = new web3.eth.contract(interface, contractAddress, {    from: //'0x15e6087A233eF02EF667b9B535Ff87e14Ee05145', // default from address	gasLimit: //web3.toHex(800000),
//    gasPrice: web3.toHex(20000000000)
//});


contractInstance.checkcontractbalance(
 {from: fromaddress}, function(err , result) {
	 if (err){
		 console.log(' check contract balance error ' + err);
	 }else{
		 
		 console.log('check contract balance result ' + utils.fromWei(result, 'ether') + ' ethers ');
	 }
	 
 });

contractInstance.didIwithdraw(
	{from: fromaddress}, function(err , result) {
		if (err){
			console.log(' didIwithdraw error ' + err);
		}else{
			
			console.log('didIwithdraw result ' +result);
		}
		
	});

contractInstance.amIfunded(
		{from: fromaddress}, function(err , result) {
			if (err){
				console.log(' amI funded error  ' + err);
			}else{
				
				console.log('am I funded ?  ' + result);
			}
			
		});

 

contractInstance.get_totalamountcol(
			{from: fromaddress}, function(err , result) {
				if (err){
					console.log('get_totalamountcol error  ' + err);
				}else{
					
					console.log('get_totalamountcol  ' + utils.fromWei(result, 'ether') + ' ethers ');
				}
				
			});	
			
contractInstance.get_numberofparti(
	{from: fromaddress}, function(err , result) {
		if (err){
			console.log('get_numberofparti error  ' + err);
		}else{
			
			console.log('get_numberofparti  ' + result );
		}
		
	});	
