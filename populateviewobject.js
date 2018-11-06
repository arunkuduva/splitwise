var Web3 = require('web3');
var utils = require('C:/Users/Raaghav/Testing/node_modules/web3/lib/utils/utils');
var config = require('./config.json');
var web3 = new Web3(new Web3.providers.HttpProvider(config.network));

var interface = require('./interface');

var contractAddress = config.contractaddress;
var fromaddress = config.address;


const splitWise = web3.eth.contract(interface.interface);
const contractInstance = splitWise.at(contractAddress);

// var readcontract = require('./splitreadfunctions.js')

// console.log(JSON.stringify(readcontract));
var viewobject = {};
new Promise(function(resolve, reject){
    
    resolve(viewobject);
    //return viewobject;
}).
then((viewobject)=>{
    return new Promise((resolve, reject) => {
            contractInstance.checkcontractbalance(
                {from: fromaddress}, function(err , result) {
                    if (err){
                    console.log(' check contract balance error ' + err);
                    viewobject.contract_balance_err = err;
                    reject( viewobject);
                    }else{
                    
                    viewobject.contract_balance = utils.fromWei(result, 'ether');
                    console.log('inside promise ' + JSON.stringify(viewobject));
                    resolve( viewobject);
                    }
                });

            });        	
})
.then( (viewobject)=>{
    return new Promise((resolve, reject)=> {
        contractInstance.amIfunded(
            {from: fromaddress}, function(err , res) {
                if (err){
                    console.log(' amI funded error  ' + err);
                    error = err;
                    viewobject.am_i_funded_err = error;
                    reject( viewobject);
                }else{
                    
                    console.log('am I funded ?  ' + res);
                    viewobject.am_i_funded = res;
                    
                    console.log('inside nested promise 2' + JSON.stringify(viewobject));
                    resolve( viewobject);   
                }
                
            });
            
    });
})
.then((viewobject)=>{
    return new Promise((resolve, reject)=>{
        contractInstance.didIwithdraw(
            {from: fromaddress}, function(err , result) {
                if (err){
                    console.log(' didIwithdraw error ' + err);
                    viewobject.did_i_withdraw_err = err;
                    reject(viewobject);
                    
                }else{
                    
                    console.log('didIwithdraw result ' +result);
                    viewobject.did_i_withdraw = result;
                    resolve(viewobject);
                    console.log('inside nested promise 3 ' + JSON.stringify(viewobject));
                }
                
            });
            
    });
    
})
.then((viewobject)=>{

    return new Promise((resolve,reject)=>{
        contractInstance.get_totalamountcol(
			{from: fromaddress}, function(err , result) {
				if (err){
                    console.log('get_totalamountcol error  ' + err);
                    viewobject.total_amount_collected_err = err;
                    reject(viewobject);
				}else{
					
					console.log('get_totalamountcol  ' + utils.fromWei(result, 'ether') + ' ethers ');
                    viewobject.total_amount_collected = utils.fromWei(result, 'ether');
                    
                    resolve(viewobject);
                    console.log('inside nested promise 4 ' + JSON.stringify(viewobject));
				}
				
			});	
    });
})
.then((viewobject)=>{

    return new Promise((resolve,reject)=>{
        			
            contractInstance.get_numberofparti(
	            {from: fromaddress}, function(err , result) {
		            if (err){
                        console.log('get_numberofparti error  ' + err);
                        viewobject.get_numberofparti_err = err;
                         reject(viewobject);
		            }else{
			
			            console.log('get_numberofparti  ' + result );
			            viewobject.number_of_parti = result;
                        console.log('inside nested promise 5 ' + JSON.stringify(viewobject));
		            }
		
	            });	
    });
});

module.exports = {viewobject};
