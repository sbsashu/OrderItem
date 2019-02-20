const app=require('express')();
const MongoClient=require('mongodb').MongoClient;
const body=require('body-parser');
app.use(body.json());
app.use(body.urlencoded({extended:false}));
app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Headers','X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials',true);
    next()
})
app.get("/getorderitem", function (req, res) {
    MongoClient.connect("mongodb://localhost:27017", function (err, database) {
        var dbo = database.db("OrderItem");
        var coll = dbo.collection('details');
        coll.find({}).toArray(function(err,data){
            res.json(data);
        });
   });
});
app.listen(3000)
// app.post("/addorderitem", function (req, res) {
//     MongoClient.connect("mongodb://localhost:27017", function (err, database) {
//         var dbo = database.db("OrderItem");
//         var coll = dbo.collection('details');
//         console.log(req.body);
//         coll.insert(req.body,function(err,doc)
//         {
//         	if (err) 
//         	{
//         		res.send('Record insertion failed');
//         	}
//         	else
//         	{
//         		res.send('inserted');		
//         	}       	
//         })          
// //    });
// });
