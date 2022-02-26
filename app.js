require('dotenv').config();
const tmi = require('tmi.js');

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  "apiKey": process.env.AI_API_KEY
});
const openai = new OpenAIApi(configuration);

let res;
let prmpt = "Say something viewer of the Twitch streamer Tealhollow1 would say.";
async function resp(prompt) {
	let response = await openai.createCompletion("text-davinci-001", {
  "prompt": prompt,
  "temperature": 0.7,
  "max_tokens": 64,
  "top_p": 1,
  "frequency_penalty": 0,
 	"presence_penalty": 0
});
	res = response.data.choices[0].text.slice(2);
	return await response.data.choices[0].text.slice(2);
};

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};

(async function() {
    'use strict';

	let times = 0;
	let gam = 0;
	let coins;
	let rum;
	
	resp(prmpt)

	const client = new tmi.Client({
		options: { debug: true },
		identity: {
			username: process.env.TWITCH_USERNAME,
			password: process.env.TWITCH_API_KEY
		},
		channels: [ 'Tealhollow1' ]
	});

client.connect();

/*client.on('message', (channel, tags, message, self) => {
	console.log(channel);
	if (self) return true;
		gam += 1;

		if (gam >= 36) {
			const { username } = tags;
			if (username === 'streamelements') {
				client.say(channel, `!gamble ${Math.trunc((message.substr(40, message.indexOf("Coins", 40) - 40)) / 25)}`);

				gam = 0;
			} else client.say(channel, `!coins`);
		} 
});*/


	client.on('message', async function (channel, tags, message, self) {
		if(!message.startsWith('!')) return true;

		if (message.toLowerCase() === '!rn' || message.toLowerCase() === '!ranum' || message.toLowerCase() === '!randomnum') {
			client.say(channel, `${Math.trunc(Math.random() * (1001))}`);
		}

		const { username } = tags;
		if (message.toLowerCase() === '!msg' && username === process.env.TWITCH_USERNAME) {
			if (res.at(0) === '"' && res.at(res.length - 1) === '"') client.say(channel, res.slice(1, (res.length - 1)));
			else client.say(channel, `${res}`);

			await resp(prmpt);
			await sleep(3000);
		}
	});
	
client.on('message', async function(channel, tags, message, self) {
	if(self || !message.startsWith('!')) return;

	const args = message.slice(1).split(' ');
	const command = args.shift().toLowerCase();

	if(message.toLowerCase() === '!play') {
        times += 1;

        if(times >= 2) {
					client.say(channel, `!play`);
					await sleep(6000);
					times = 0;
				}
    }
});

client.on('message', async function(channel, tags, message, self) {
	if(self) return true;

	rum = Math.trunc(Math.random() * (74));
	
	if (rum == 1 && !message.startsWith('!gamble') && !message.startsWith('!slots') && !message.startsWith('!gift') && !message.startsWith('!roulette') && !message.startsWith('!give') && !message.startsWith('!redeem')) {
		client.say(channel, `${message}`);
	}
	else if (rum == 6) {
		client.say(channel, `pizza`);
	}
	else if (rum == 13) {
		client.say(channel, `brown bricks`);
	}
	else if (rum == 29) {
		client.say(channel, `!ranum`);
	}
	else if (rum >= 60 && rum <= 62) {
		if (res.at(0) === '"' && res.at(res.length - 1) === '"') client.say(channel, res.slice(1, (res.length - 1)));
			else client.say(channel, `${res}`);

			resp(prmpt);
			await sleep(3000);
	}
	else if (rum >= 66) {
		await resp(message)
		client.say(channel, `${res}`);
		await sleep(3000);
	}
});
console.log(res);
})();