const fs = require('fs');
const path = require('path');

(() => {
    const reg = /2002:(?:[A-F0-9]{1,4}:){2,6}([A-F0-9]{1,4}|:)/gmi
    const dirname = 'in';

    const zeroPad = number => number <= 99 ? ("000" + number).slice(-2) : number;

    fs.readdir(dirname, (err, filenames) => {
        if (err) throw err;

        let files = 0;
        filenames.forEach((filename) => {
            content = fs.readFileSync(path.join(dirname, filename), 'utf-8');

            let replaces = 0;

            const replacedContent = content.replace(reg, (input) => {
                const dataPart = input.match(/2002:(.*)/)[1];
                const hextett = dataPart.split(':');

                const h0 = parseInt(hextett[0], 16);
                const h1 = parseInt(hextett[1], 16);

                const output = `${h0 >> 8}.${0x00ff & h0}.${h1 >> 8}.${0x00ff & h1}`;

                console.info(`- (${zeroPad(++replaces)}) Replaced [${input}] → [${output}]`)

                return output;
            });

            fs.writeFileSync(path.join('out', filename), replacedContent);
            console.info(`[${zeroPad(++files)}] Outputting [${path.join('out', filename)}] (${replaces} replacements)`);
        });
    });
})();