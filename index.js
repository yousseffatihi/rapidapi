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
                    cores: $($(el).find('td')[2]).text().replace(/(\r\n|\n|\r|\t)/gm, "").replace('  ', ' '),
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

app.get('/cpu/year/:year', (req, res) => {
    let year = req.params.year
    //Check the year params is an number
    if(isNaN(year)) {
        result = {
            error: '002',
            name: 'mistype',
            description: 'the year must be a number'
        }
        res.json(result);
        return;
    }

    year = parseInt(year);

    if(year < 2000 || year > (new Date().getFullYear()) ) {
        result = {
            error: '003',
            name: 'Unexpected number',
            description: 'the year must be between 2000 and ' + (new Date().getFullYear())
        }
        res.json(result);
        return;
    }

    axios.get('https://www.techpowerup.com/cpu-specs/?released='+ year +'&sort=released')
        .then(response => {
            const $ = cheerio.load(response.data);
            const popular = [];
            const amd = [];
            const intel = [];
            $('#list > table > tbody:nth-child(3) > tr').each((i, el) => {
                cpu = {
                    name: $($(el).find('td')[0]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    codename: $($(el).find('td')[1]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    cores: $($(el).find('td')[2]).text().replace(/(\r\n|\n|\r|\t)/gm, "").replace('  ', ' '),
                    clock: $($(el).find('td')[3]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    socket: $($(el).find('td')[4]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    process: $($(el).find('td')[5]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    cache: $($(el).find('td')[6]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    tdp: $($(el).find('td')[7]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    released: $($(el).find('td')[8]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    link: 'https://www.techpowerup.com' + $(el).find('a').attr("href")
                };
                amd.push(cpu);
            });

            $('#list > table > tbody:nth-child(6) > tr').each((i, el) => {
                cpu = {
                    name: $($(el).find('td')[0]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    codename: $($(el).find('td')[1]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    cores: $($(el).find('td')[2]).text().replace(/(\r\n|\n|\r|\t)/gm, "").replace('  ', ' '),
                    clock: $($(el).find('td')[3]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    socket: $($(el).find('td')[4]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    process: $($(el).find('td')[5]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    cache: $($(el).find('td')[6]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    tdp: $($(el).find('td')[7]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    released: $($(el).find('td')[8]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    link: 'https://www.techpowerup.com' + $(el).find('a').attr("href")
                };
                intel.push(cpu);
            });

            popular.push({
                'amd': amd,
                'intel': intel
            });

            res.json(popular);
        }).catch(err => {
            res.json(err);
        });
});

app.get('/cpu/brand/:brand', (req, res) => {

    let brand = req.params.brand;

    if (brand.toString().toLowerCase() !== "intel" && brand.toString().toLowerCase() !== "amd") {
        result = {
            error: '001',
            name: 'Unexpected brand name',
            description: 'the url accept only two brands, intel or amd'
        }
        res.json(result);
        return;
    }

    if (brand.toString().toLowerCase() == 'intel') {
        brand = 'Intel';
    }else {
        brand = 'AMD'
    }

    axios.get('https://www.techpowerup.com/cpu-specs/?mfgr='+ brand +'&sort=released')
        .then(response => {
            const $ = cheerio.load(response.data);
            const popular = [];
            let test = '';
            $('div#list > table > tbody > tr').each((i, el) => {
                cpu = {
                    name: $($(el).find('td')[0]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    codename: $($(el).find('td')[1]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    cores: $($(el).find('td')[2]).text().replace(/(\r\n|\n|\r|\t)/gm, "").replace('  ', ' '),
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

app.get('/cpu/processor/:query', (req, res) => {
    var query = req.params.query;
    axios.get('https://www.techpowerup.com/cpu-specs/?ajaxsrch=' + query)
        .then(response => {
            const $ = cheerio.load(response.data);
            const popular = [];
            $('body > table > tbody > tr').each((i, el) => {
                cpu = {
                    name: $($(el).find('td')[0]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    codename: $($(el).find('td')[1]).text().replace(/(\r\n|\n|\r|\t)/gm, ""),
                    cores: $($(el).find('td')[2]).text().replace(/(\r\n|\n|\r|\t)/gm, "").replace('  ', ' '),
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