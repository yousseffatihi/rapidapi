const port = 8000;

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

app.use(express.static('public'));

//Get / and return a Welcome Text
app.get('/', (req, res) => {
    res.json('Welcome to the Scraper');
});

app.get('/cpu', (req, res) => {
    axios.get('https://www.techpowerup.com/cpu-specs/')
        .then(response => {
            const $ = cheerio.load(response.data);
            const popular = [];
            let test = '';
            $('div#list > table > tbody > tr').each((i, el) => {
                cpu = {
                    name: $($(el).find('td')[0]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    codename: $($(el).find('td')[1]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    cores: $($(el).find('td')[2]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    clock: $($(el).find('td')[3]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    socket: $($(el).find('td')[4]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    process: $($(el).find('td')[5]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    cache: $($(el).find('td')[6]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    tdp: $($(el).find('td')[7]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    released: $($(el).find('td')[8]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    link: 'https://www.techpowerup.com' + $(el).find('a').attr("href")
                };
                popular.push(cpu);
            });
            res.json(popular);
        }).catch(err => {
            res.json(err);
        });
});

//Get Id  as parameter and use it in the url


app.get('/cpu/:query', (req, res) => {
    var query = req.params.query;
    console.log(query);
    axios.get('https://www.techpowerup.com/cpu-specs/?ajaxsrch='+query)
        .then(response => {
            const $ = cheerio.load(response.data);
            const popular = [];
            $('body > table > tbody > tr').each((i, el) => {
                console.log(el);
                cpu = {
                    name: $($(el).find('td')[0]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    codename: $($(el).find('td')[1]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    cores: $($(el).find('td')[2]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    clock: $($(el).find('td')[3]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    socket: $($(el).find('td')[4]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    process: $($(el).find('td')[5]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    cache: $($(el).find('td')[6]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    tdp: $($(el).find('td')[7]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    released: $($(el).find('td')[8]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    link: 'https://www.techpowerup.com' + $(el).find('a').attr("href")
                };
                popular.push(cpu);
            });
            res.json(popular);
    }).catch(err => {
        res.json(err);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port} : http://localhost:${port}`);
});