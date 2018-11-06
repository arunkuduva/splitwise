var vo = {};
new Promise(function(resolve, reject) {
    setTimeout(() => resolve(1), 1000); // (*)
  }).then(function(result) { // (**)
  
    
    vo.first = 1;
    console.log(result); // 1
    return vo;
  
  }).then(function(result) { // (***)
  
    
    vo.second = 2;
    console.log(result); // 2
    return vo;
  
  }).then(function(result) {
  
    
    vo.third = 3;
    console.log(result); // 4
    
  
  });