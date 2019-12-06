let express = require('express');
let bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/styles', express.static('styles'));

app.get('/', (request, response) => response.sendFile(__dirname + "/index.html"));

app.post('/new', (request, response) => {

    let postBody = request.body;

    postBody.cusID = "";
    postBody.first = "";
    postBody.last = "";
    postBody.address = "";
    postBody.city = "";
    postBody.province = "";
    postBody.postal = "";

    response.send(postBody);
});

app.post('/add', (request, response) => {
    let sql = require("mssql");

    let postBody = request.body;
    let firstName = postBody.first;
    let lastName = postBody.last;
    let address = postBody.address;
    let city = postBody.city;
    let province = postBody.province;
    let postal = postBody.postal;

    let config = {
        user: 'sa',
        password: 'emily7',
        server: 'MSI\\SQLEXPRESS',
        database: 'store'
    };
    
    sql.connect(config, function (err) {

        if (err) {
            console.log(err);
        }
        let queryString = "INSERT INTO Customers (firstName, lastName, address, city, province, postal) VALUES (@firstName, @lastName, @address, @city, @province, @postal)";
        let request = new sql.Request();

        request.input("firstName", sql.NVarChar(50), firstName)
            .input("lastName", sql.NVarChar(50), lastName)
            .input("address", sql.NVarChar(50), address)
            .input("city", sql.NVarChar(50), city)
            .input("province", sql.NVarChar(25), province)
            .input("postal", sql.NVarChar(10), postal)
        
         .query(queryString, function (err, recordset) {
            if (err) {
                console.log(err);
            }

            // send recordset as a response for debugging purposes
            console.log(recordset);

            // create the SQL to get the last "identity" field value
            queryString = "SELECT @@IDENTITY AS 'identity'";
            request.query(queryString, function (err, returnVal) {
                if (err) {
                    console.log(err);
                }
                // extract the "CusID" assigned by SQL Server for the last INSERT
                let identValue = returnVal.recordset[0].identity;
                console.log("New CusID = " + identValue);
                sql.close();
            });
        });
    });
});

app.post('/update', (request, response) => {
    let sql = require("mssql")

    let postBody = request.body;
    let cusID = postBody.cusID;
    let firstName = postBody.first;
    let lastName = postBody.last;
    let address = postBody.address;
    let city = postBody.city;
    let province = postBody.province;
    let postal = postBody.postal;

    let config = {
        user: 'sa',
        password: 'emily7',
        server: 'MSI\\SQLEXPRESS',
        database: 'store'
    };

    sql.connect(config, function (err) {

        if (err) {
            console.log(err);
        }
        
        let queryString = "UPDATE Customers SET firstName=@firstName, lastName=@lastName, address=@address, city=@city, province=@province, postal=@postal WHERE cusID=@cusID";
        let request = new sql.Request();

        request.input("cusID", sql.Int, cusID)
            .input("firstName", sql.NVarChar(50), firstName)
            .input("lastName", sql.NVarChar(50), lastName)
            .input("address", sql.NVarChar(50), address)
            .input("city", sql.NVarChar(50), city)
            .input("province", sql.NVarChar(25), province)
            .input("postal", sql.NVarChar(10), postal)

        .query(queryString, function (err, recordset) {
            if (err) {
                console.log(err);
            }

            // send recordset as a response for debugging purposes
            console.log(recordset);

            // create the SQL to get the last "identity" field value
            queryString = "SELECT @@IDENTITY AS 'identity'";
            request.query(queryString, function (err, returnVal) {
                if (err) {
                    console.log(err);
                }
                // extract the "CusID" assigned by SQL Server for the last INSERT
                let identValue = returnVal.recordset[0].identity;
                console.log("New CusID = " + identValue);
                sql.close();
            });
        });
    });
});

app.post('/delete', (request, response) => {
    let sql = require("mssql")

    let postBody = request.body;
    let cusID = postBody.cusID;

    let config = {
        user: 'sa',
        password: 'emily7',
        server: 'MSI\\SQLEXPRESS',
        database: 'store'
    };

    sql.connect(config, function (err) {

        if (err) {
            console.log(err);
        }

        let queryString = "DELETE FROM Customers WHERE cusID=@cusID";
        let request = new sql.Request();

        request.input("cusID", sql.Int, cusID)

        .query(queryString, function (err, recordset) {
                if (err) {
                    console.log(err);
                }

                // send recordset as a response for debugging purposes
                console.log(recordset);

                // create the SQL to get the last "identity" field value
                queryString = "SELECT @@IDENTITY AS 'identity'";
            request.query(queryString, function (err, returnVal) {
                    if (err) {
                        console.log(err);
                    }
                    // extract the "CusID" assigned by SQL Server for the last INSERT
                    let identValue = returnVal.recordset[0].identity;
                    console.log("New CusID = " + identValue);
                    sql.close();
            });
        });
    });
});

app.post('/find', (request, response) => {
    let sql = require("mssql")

    let postBody = request.body;
    let cusID = postBody.cusID;

    let config = {
        user: 'sa',
        password: 'emily7',
        server: 'MSI\\SQLEXPRESS',
        database: 'store'
    };

    sql.connect(config, function (err) {

        if (err) {
            console.log(err);
        }

        let queryString = "SELECT * FROM Customers WHERE cusID=@cusID ";

        let request = new sql.Request();

        request.input("cusID", sql.Int, cusID)

        .query(queryString, function (err, recordset) {
                if (err) {
                    console.log(err);
                }

                // send recordset as a response for debugging purposes
                console.log(recordset);

                // create the SQL to get the last "identity" field value
                queryString = "SELECT @@IDENTITY AS 'identity'";
            request.query(queryString, function (err, returnVal) {
                    if (err) {
                        console.log(err);
                    }
                    // extract the "CusID" assigned by SQL Server for the last INSERT
                    let identValue = returnVal.recordset[0].identity;
                    console.log("New CusID = " + identValue);
                    sql.close();
            });
        });
    });
});

let server = app.listen(3000, function () {
    console.log('Server is running..');
});
