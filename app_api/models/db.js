var mongoose = require('mongoose');
//var dbURI = 'mongodb://localhost/mekan32';
var dbURI= 'mongodb+srv://mekan32:bankai12@mekan32.wmi1p.mongodb.net/mekan32?retryWrites=true&w=majority';
mongoose.connect(dbURI,{useNewUrlParse:true});

mongoose.connection.on('error',function(err){
    console.log('Mongoose bağlantı hatası:\n ' + err);
});
mongoose.connection.on('disconnected',function(){
    console.log('Mongoose bağlantısı kesildi\n' );
});
kapat = function(msg,callback){
    mongoose.connection.close(function(){
        console.log('Mongoose kapatıldı\n' + msg);
        callback();
    });
};

process.once('SIGUSR2',function(){
    kapat('nodemon kapatıldı\n',function(){
        process.kill(process.pid,'SIGUSR2');
    });
});

process.on('SIGINT',function(){
    kapat('uygulama kapatıldı\n',function(){
        process.exit(0);
    });
});

process.on('SIGTERM',function(){
    kapat('heroku kapatıldı\n',function(){
        process.exit(0);
    });
});
require('./mekansema');