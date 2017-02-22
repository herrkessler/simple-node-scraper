var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

var app = express();
var port = process.env.PORT || 5123;

app.get('/scrape', function(req, res) {

    url = "http://" + "username" + ":" + "password" + "@domain.example.com/";

    request(url, function(error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);
            var json = [];

            $('.element-item:not(.grid, .funfacts)').each(function(index, item) {
                var data = $(this);
                var title = data.find('.category-hover-text').find('h2').text();
                var types = data.data('category');
                if (types == 'recipe') {
                    types = 'rezepte'
                } else if (types == 'decoration') {
                    types = 'dekoration'
                } else if (types == 'do-it-your-self') {
                    types = 'frühling'
                }
                json.push({
                    'id': index,
                    'modal_title': title,
                    'types': types
                });
            })
        } else {
            console.log(error);
        }


        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err) {

            console.log('File successfully written! - Check your project directory for the output.json file');

        })

        res.send('Check your console!')

    });
})

app.listen(port);

console.log('Magic happens on port ' + port);
