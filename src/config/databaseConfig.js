const mongoose = require('mongoose');
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, options)
    .then(_ => console.log('Veritabanı bağlantısı yapıldı'))
    .catch((err) => {console.error(err)});
