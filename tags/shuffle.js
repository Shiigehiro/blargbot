var e = module.exports = {};
var bu;

var bot;
e.init = (Tbot, blargutil) => {
    bot = Tbot;
    bu = blargutil;

    e.category = bu.TagType.COMPLEX;
};

e.requireCtx = require;

e.isTag = true;
e.name = `shuffle`;
e.args = ``;
e.usage = `{shuffle}`;
e.desc = `Shuffles the args the user provided.`;
e.exampleIn = `{shuffle} {args;0} {args;1} {args;2}`;
e.exampleOut = `Input: <code>one two three</code><br>Output: <code>three one two</code>`;


e.execute = (msg, args, fallback, words) => {
    var replaceString = '';
    var replaceContent = false;

    words = bu.shuffle(words);
    return {
        replaceString: replaceString,
        replaceContent: replaceContent
    };
};