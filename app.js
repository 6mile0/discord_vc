// VC接続履歴管理Bot
// 2023/02/25
// Author: 6mile
// ==========================================
const token = "" // トークン
const channelID = "" // ログを送信するチャンネルのID
// ==========================================
import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';

const client = new Client({
    intents: Object.values(GatewayIntentBits).reduce((a, b) => a | b)
});

client.once("ready", async () => {
    client.user.setPresence({ activities: [{ name: "Ver " + "001" }] });
    console.log("準備完了");
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content === "ping") {
        message.channel.send("pong");
    }
});

client.on("voiceStateUpdate", (oldState, newState) => {
    if (newState && oldState) {
        // 接続したとき
        if (oldState.channelId == undefined && newState.channelId != undefined) {
            console.log(`Connect`);
            client.users.fetch(newState.id).then(user => {
                console.log(user.username);
                const embed = new EmbedBuilder()
                    .setColor(0X32CD32)
                    .setTitle(`${user.username} さんが ${newState.channel.name} に接続しました`)
                    .addFields(
                        { name: '接続先', value: newState.channel.name },
                        { name: '接続先VCの現在人数', value: String(client.channels.cache.get(newState.channelId).members.size) + "人" },
                    )
                    .setTimestamp()
                client.channels.cache.get(channelID).send({ embeds: [embed] });
            });
        }

        // チャンネル移動したとき
        if (newState.channelId != undefined && oldState.channelId != undefined) {
            console.log(`Move`);
            if (newState.channelId != oldState.channelId) {
                client.users.fetch(newState.id).then(user => {
                    console.log(user.username);
                    const embed = new EmbedBuilder()
                        .setColor(0XFFFF00)
                        .setTitle(`${user.username} さんが ${oldState.channel.name} から ${newState.channel.name} に移動しました`)
                        .addFields(
                            { name: '移動元', value: oldState.channel.name },
                            { name: '移動元VCの現在人数', value: String(client.channels.cache.get(oldState.channelId).members.size) + "人" },
                            { name: '移動先', value: newState.channel.name },
                            { name: '移動先VCの現在人数', value: String(client.channels.cache.get(newState.channelId).members.size) + "人" },
                        )
                        .setTimestamp()
                    client.channels.cache.get(channelID).send({ embeds: [embed] });
                });
            }
        }
    }

    // 切断したとき
    if (newState.channelId == undefined && oldState.channelId != undefined) {
        console.log("Disconnect");
        console.log(client.channels.cache.get(oldState.channelId).members.size);
        client.users.fetch(newState.id).then(user => {
            console.log(user.username);
            const embed = new EmbedBuilder()
                .setColor(0XFF0000)
                .setTitle(`${user.username} さんが ${oldState.channel.name} から切断しました`)
                .addFields(
                    { name: '切断元', value: oldState.channel.name },
                    { name: '切断元VCの現在人数', value: String(client.channels.cache.get(oldState.channelId).members.size) + "人" },
                )
                .setTimestamp()
            client.channels.cache.get(channelID).send({ embeds: [embed] });
        });
    }
});


client.login(token);