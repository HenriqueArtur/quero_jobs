'use strict'

require('dotenv').config();
const Axios = require('axios');
const Cheerio = require('cheerio');
const Accents = require('remove-accents');
const Telegram = require('telegram-node-bot');
const TelegramBaseController = Telegram.TelegramBaseController;
const TextCommand = Telegram.TextCommand;
const chatbot = new Telegram.Telegram(process.env.TK_TELEGRAM);

const url = 'https://queroworkar.com.br/';
var jobs = [];

class EventsController extends TelegramBaseController {
	vagasAction(scope) {
		let msg = jobs[0];
		// jobs.forEach(function(element) {
		// 	// titulo = `Vaga: ${element.title}`;
		// 	// link = `Link: ${element.link}`;
		// 	// msg += (titulo + '\n' + link + '\n');
		// });
		scope.sendMessage(msg);
	}

	get routes() {
		return {'vagasEvent': 'vagasAction'}
	}
}

chatbot.router
	.when(
		new TextCommand('/vagas', 'vagasEvent'), new EventsController()
	);

const siteCheck = setInterval(() => { getScraper() }, 5000);

function getScraper() {
	Axios(url)
		.then(response => {
			const html = response.data;
			const $ = Cheerio.load(html);
			const content = $('.nextajax-wrap > article');
			var job = [];
	
			content.each(function () {
				const title = $(this).find('.loop-item-content > h2 > a').text();
				if(Accents.remove(title).toLowerCase().includes('estagio')) {
					const link = $(this).find('.job-details-link').attr("href");
					const time = Date.now();
					
					job = { title, link, time, };

					const in_jobs = jobs.some(elem => (elem.title === job.title && elem.link === job.link));
					if(!in_jobs) { jobs.unshift(job); }
					
				}
			});
			// console.log(jobs);
		})
		.catch(console.error);
}

function stopCheck() {
	clearInterval(siteCheck);
}