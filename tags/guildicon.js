var e = module.exports = {};
var bu;

var bot;
e.init = (Tbot, blargutil) => {
    bot = Tbot;
    bu = blargutil;

    e.category = bu.TagType.SIMPLE;
};

e.requireCtx = require;

e.isTag = true;
e.name = `guildicon`;
e.args = ``;
e.usage = `{guildicon}`;
e.desc = `Returns the icon of the current guild`;
e.exampleIn = `The guild's icon is {guildicon}`;
e.exampleOut = `The guild's icon is (icon url)`;


e.execute = (msg, args, fallback) => {
    var replaceString = `https://cdn.discordapp.com/icons/${msg.channel.guild.id}/${msg.channel.guild.icon}.jpg`;
    var replaceContent = false;


    return {
        replaceString: replaceString,
        replaceContent: replaceContent
    };
};