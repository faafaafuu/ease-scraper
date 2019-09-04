const request = require('request');
const https = require('https');
const mkdirp = require('mkdirp')
const cheerio = require('cheerio');
const kw = ''

const fs = require('fs');
const data_file = fs.readFileSync('data.json')
const db_data = JSON.parse(data_file)

const url = ''


// Data transfered to data.json
function Grab_data(prod_name, description, model, keywords) {
    this.prod_name = prod_name,
    this.description = description, 
    this.model = model,
    this.keywords = keywords
}

const web_url = []
request(url, (error, response, html) => {
    if(!error && response.statusCode == 200) {
        const $ = cheerio.load(html)

       

        $('.product-image').each((i, el) => {
            

            web_url.push($(el).attr('href').replace(/\s\s+/g, ''));
            if(i < 3) {
            const item = $(el).attr('href').replace(/\s\s+/g, '');

            const item_url = item;

            // Parsing process //
            request(item_url, (error, response, html) => {
                console.log(item_url)
                if(!error && response.statusCode == 200) {
                    const $ = cheerio.load(html)
                    // $('.product-top').each((i, el) => {
                    //     const item = $(el).text().replace(/\s\s+/g, '');
                    //     console.log(item);
                    // })

                    const pn = $('.product-brand').text().replace(/\s\s+/g, '') +' '+ $('.product-name').text().replace(/\s\s+/g, '')
                    const dscrp = $("meta[name='description']").attr("content").replace(/\s\s+/g, '')
                    const model = $('.product-name').text().replace(/\s\s+/g, '')
                    const keywords = kw + $('.product-name').text().replace(/\s\s+/g, '').toLowerCase()
                    // const mtt = $('.mtt').text().replace(/\s\s+/g, '')
                    // const mtd = $('.mtd').text().replace(/\s\s+/g, '')
                    // const mtk = $('.mtk').text().replace(/\s\s+/g, '')
                    // const sku = $('.sku').text().replace(/\s\s+/g, '')

                    // const prod_img = []

                    // Create img folder
                    mkdirp(`image/${model}/`)

                    $('.product-gallery-image').each((i, el) => {
                        if(i < 5) {
                            // prod_img.push($(el).find('source').attr('srcset').replace(/\s\s+/g, ''));
                            const pic = $(el).find('source').attr('srcset').replace(/\s\s+/g, '');
                            const file = fs.createWriteStream(`image/${model}/${model}${i}.png`);
                            https.get(pic, function(response) {
                                response.pipe(file);
                            });
                        }
                    })
                
                    
                // Output data 
                    let item = new Grab_data(
                        this.prod_name = pn,
                        this.description = dscrp,
                        this.model = model,
                        this.kw = keywords
                    )
                        console.log(item)
                        db_data.yc_items.push(item)
                        data = JSON.stringify(db_data)
                        
                        fs.writeFile('data.json', data, finished)

              
                    function finished () {
                        console.log('Well done!)')
                    }
                }

            })
            }
        })
    }
})





