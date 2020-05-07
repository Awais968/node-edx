const fs = require('fs')
const path = require('path')

const csv = require('csvtojson');

const csvFile = ('C:/users/HAISAM\ ZAHID/customer-data.csv');

csv()
.fromFile(csvFile).then ( (jsonObj) =>{
    console.log(jsonObj)
    fs.writeFile(path.join(__dirname,'customer-data.json'),JSON.stringify(jsonObj,null,1),()=>{
        console.log(jsonObj)
});
})