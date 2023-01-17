const { connect, set, connection } = require('mongoose');

exports.connectMongo = () => {
    set('strictQuery', true);
    return connect('mongodb://localhost:27017/jwt-auth-demo');
}

connection.on('connected', () => { console.log('🔥 Database Connected.') });