const express = require('express');
const {engine} = require('express-handlebars');
const methodOverride = require('method-override');
const {clientRouter} = require('./routers/client');
const {homeRouter} = require('./routers/home');
const {db} = require('./utils/db');
const {handleError} = require('./utils/errors');

const app = express();

app.use(methodOverride('_method'));
app.use(express.urlencoded({
    extended: true,
}));
app.use(express.static('public'));
app.use(express.json());
app.engine('.hbs',
    engine({
        extname: '.hbs',
    }));
app.set('view engine', '.hbs');

app.use('/', homeRouter);
app.use('/client', clientRouter);

//middlewear do obsługi błedów jest zawsze na końcu przed samym listenem
app.use(handleError);

app.listen(3000, 'localhost', ()=>{
    console.log('Listening on http://localhost:3000')
})
