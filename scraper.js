const axios = require('axios');
const cheerio = require('cheerio');
const accents = require('remove-accents');

const url = 'https://queroworkar.com.br/';
const vagas = [];

axios(url)
	.then(response => {
		const html = response.data;
		const $ = cheerio.load(html);
		const content = $('.nextajax-wrap > article');

		content.each(function () {
			const titulo = $(this).find('.loop-item-content > h2 > a').text();
			if(accents.remove(titulo).toLowerCase().includes('estagio')) {
				const link = $(this).find('.job-details-link').attr("href");
				
				vagas.push({
					titulo,
					link,
				});
			}
		});
	})
	.then( response => {
		vagas.forEach((item, index) => {
			item.company = index;
		})
	console.log(vagas);
	})
	.catch(console.error);