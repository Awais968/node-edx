const mongodb = require('mongodb')
const url = 'mongodb://localhost:27017/'
const customers = require('./m3-customer-data.json')
const customerAddresses= require('./m3-customer-address-data.json')
const async = require('async')
console.log(customerAddresses)

let tasks = []

const limit = parseInt(process.argv[2], 10) || 1000
mongodb.MongoClient.connect(url,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    }, (error, client) => {
    if (error) process.exit(1)
    var db = client.db('edx-course-students')
    customers.forEach((customer, index, list) => {
        customers[index] = Object.assign(customer, customerAddresses[index])
        if (index % limit == 0) {
            const start = index
            const end = (start+limit > customers.length) ? customers.length-1 : start+limit
            tasks.push((done) =>{
            console.log(`Processing ${start}-${end} tasks out of ${customers.length}`)
            db.collection('customers').insertMany(customers.slice(start, end), (error, results) =>{
                done(error, results)
            })
        })
    }
    })
    console.log(`Launching ${tasks.length} parallel task(s)`)
    const startTime = Date.now()
    async.parallel(tasks, (error, results)=>{
        if (error) process.exit(1)
        const endTime = Date.now()
        console.log(`Execution Time ${endTime}-${startTime} `)
        //console.log(results)
        client.close()
    })



})