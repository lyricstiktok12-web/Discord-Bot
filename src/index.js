const Discord = require('discord.js');
const chalk = require('chalk');
const axios = require('axios');
const webhook = require("./config/webhooks.json");
const config = require("./config/bot.js");

// Check if bot is up to date
const { version } = require('../package.json');
axios.get('https://api.github.com/repos/CorwinDev/Discord-Bot/releases/latest')
    .then(res => {
        if (res.data.tag_name !== version) {
            console.log(chalk.red.bgYellow(`Your bot is not up to date! Please update! ${version} -> ${res.data.tag_name}`));
        }
    }).catch(() => {
        console.log(chalk.red.bgYellow(`Failed to check if bot is up to date!`));
    });

// Check if environment variables for webhooks are set
const webHooksArray = ['startLogs', 'shardLogs', 'errorLogs', 'dmLogs', 'voiceLogs', 'serverLogs', 'serverLogs2', 'commandLogs', 'consoleLogs', 'warnLogs', 'voiceErrorLogs', 'creditLogs', 'evalLogs', 'interactionLogs'];
if (process.env.WEBHOOK_ID && process.env.WEBHOOK_TOKEN) {
    for (const webhookName of webHooksArray) {
        webhook[webhookName].id = process.env.WEBHOOK_ID;
        webhook[webhookName].token = process.env.WEBHOOK_TOKEN;
    }
}

// Create main webhooks
const startLogs = new Discord.WebhookClient({ id: webhook.startLogs.id, token: webhook.startLogs.token });
const shardLogs = new Discord.WebhookClient({ id: webhook.shardLogs.id, token: webhook.shardLogs.token });
const consoleLogs = new Discord.WebhookClient({ id: webhook.consoleLogs.id, token: webhook.consoleLogs.token });
const warnLogs = new Discord.WebhookClient({ id: webhook.warnLogs.id, token: webhook.warnLogs.token });

// Sharding manager
const manager = new Discord.ShardingManager('./src/bot.js', {
    totalShards: 'auto',
    token: process.env.DISCORD_TOKEN,
    respawn: true
});

// Top.gg autoposter if token exists
if (process.env.TOPGG_TOKEN) {
    const { AutoPoster } = require('topgg-autoposter');
    AutoPoster(process.env.TOPGG_TOKEN, manager);
}

// Console logs
console.clear();
console.log(chalk.blue.bold("System"), ">>", chalk.green("Starting up..."));
console.log(chalk.red(`© CorwinDev | 2021 - ${new Date().getFullYear()}`));
console.log(chalk.blue.bold("System"), ">>", chalk.red(`Version ${require(`${process.cwd()}/package.json`).version}`), chalk.green("loaded"));
