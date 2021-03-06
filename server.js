const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');

const totals = [];

const sync = async() => {
    try {
        const url = 'http://africanelephantdatabase.org/report/2016/Africa';
        const response = await axios.get(url)
        const {data} = response;
        const $ = cheerio.load(data);
        
        $('.table > tbody > tr > td').each((_idx, el) => {
            const total = $(el).text()
            totals.push(total)
        });
        return totals;
    }
    catch(error){
        throw error;
    }
}

app.get('/', async(req, res, next)=>{
    try{
        const lastYear = totals.findIndex((i) => i === "Totals 2015")
        console.log(totals[lastYear+1]);
        res.send(totals[lastYear+1]);
    }
    catch(ex){
        next(ex);
    }
})

const init = async() => {
    try{
        await sync();
        const port = process.env.PORT || 3000;
        app.listen(port, () => console.log(`listening on ${port}`));
    }
    catch(ex){
        console.log(ex.stack);
    }
}

init();