const mongoose = require('mongoose');
const dotenv = require('dotenv');

const app = require('./app');

dotenv.config();

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
})
.then(() => console.log('Connected to DB...'))
.catch(err => console.log('DB Error : ', err))

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Backend server started at: ${PORT}`);
})