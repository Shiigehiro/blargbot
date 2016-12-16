var e = module.exports = {};

var gm = require('gm');
var path = require('path');
var moment = require('moment');
var util = require('util');
const reload = require('require-reload');
const Jimp = reload('jimp');

e.init = () => {
    e.category = bu.CommandType.GENERAL;
};

e.requireCtx = require;

e.isCommand = true;
e.hidden = false;
e.usage = 'caption [url] [flags]';
e.info = `Captions an image. If url isn't provided, you must give an attachment.`;
e.longinfo = `<p>Captions an image. If url isn't provided, you must give an attachment.</p>`;

e.flags = [{
    flag: 't',
    word: 'top',
    desc: 'The top caption.'
}, {
    flag: 'b',
    word: 'bottom',
    desc: 'The bottom caption.'
}, {
    flag: 'f',
    word: 'font',
    desc: 'The font to use (case insensitive). Use the command with the -l flag to view the available fonts. Defaults to impact.'
}, {
    flag: 'l',
    word: 'list',
    desc: 'Lists the available fonts.'
}]

const fonts = {
    arcena: 'ARCENA.ttf',
    arial: 'arial.ttf',
    animeace: 'animeace.ttf',
    annieuseyourtelescope: 'AnnieUseYourTelescope.ttf',
    comicjens: 'comicjens.ttf',
    impact: 'impact.ttf',
    sftoontime: 'SFToontime.ttf',
    delius: 'delius.ttf',
    indieflower: 'IndieFlower.ttf',
    roboto: 'Roboto-Regular.ttf',
    ubuntu: 'Ubuntu-Regular.ttf',
    comicsans: 'comicsans.ttf'
}

e.execute = async function(msg, words) {
    let input = bu.parseInput(e.flags, words);
    if (input.l) {
        let availFonts = Object.keys(fonts).sort().map(m => '**' + m.toUpperCase() + '**').join('\n - ')
        bu.send(msg, `Currently available fonts:\n - ${availFonts}`);
        return;
    }
    if ((!input.t || input.t.length == 0) && (!input.b || input.t.length == 0)) {
        bu.send(msg, `You have to have at least one caption!`);
        return;
    }
    if (!input.f) input.f = ['impact'];
    let font = fonts[input.f.join(' ').toLowerCase()];
    if (!font) font = fonts['impact'];
    bot.sendChannelTyping(msg.channel.id);
    let url;
    if (msg.attachments.length > 0) url = msg.attachments[0].url;
    else if (input.undefined.length > 0) url = input.undefined.join(' ');
    else {
        bu.send(msg, `You must provide an image, either via url or attachment!`);
        return;
    }
    if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/.test(url)) {
        url = url.match(/(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/)[0];
    } else {
        bu.send(msg, `That's not a valid url!`);
        return;
    }
    try {
        let imgbuf = (await bu.request({
            url,
            encoding: null
        })).body;
        let img = await Jimp.read(imgbuf);
        let height = img.bitmap.height;
        let width = img.bitmap.width;
        let topbuf;
        let botbuf;
        if (input.t) {
            topbuf = await bu.createCaption({
                text: input.t.join(' '),
                font,
                size: `${width}x${height / 6}`,
                gravity: 'north',
                fill: 'white',
                stroke: 'black',
                strokewidth: 4
            })
            let topcap = await Jimp.read(topbuf);
            img.composite(topcap, 0, 0);
        }
        if (input.b) {
            botbuf = await bu.createCaption({
                text: input.b.join(' '),
                font,
                size: `${width}x${height / 6}`,
                gravity: 'south',
                fill: 'white',
                stroke: 'black',
                strokewidth: 4
            })
            let botcap = await Jimp.read(botbuf);
            img.composite(botcap, 0, height / 6 * 5);
        }
        img.scaleToFit(800, 800);

        img.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
            bu.send(msg, undefined, {
                file: buffer,
                name: 'caption.jpeg'
            });
        })

        img.write(path.join('..', 'temp.jpeg'));

    } catch (err) {
        logger.error(err);
    }
};