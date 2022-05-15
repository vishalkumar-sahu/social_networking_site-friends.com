const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const mongoose = require('mongoose');

async function main(){
    try{
        mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000})
        
        mongoose.connection.on('connected', ()=>{~
            console.log('Connected MongoDb Atlas..');
        });
        
    
    }catch(error){
        console.log(error.reason)
    }
  
}
main();

require('./models/user');
require('./models/post')

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));
// app.use(require('./routes/otp'));
// app.use(require('./routes/google_auth_register'))
// app.use("/routes", express.static('./routes/'));

app.use(express.static(__dirname + '/public'));

// app.set('views', 'views/');
// app.set('view engine', 'ejs');

// app.get('/', (req, res)=>{
//     res.render('index.ejs');
// })

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Connected on port : ${PORT}`);
});
