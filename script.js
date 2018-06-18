const fs = require('fs');
const path = require('path');

(() => {
    const reg = /2002:(?:[A-F0-9]{1,4}:){2,6}([A-F0-9]{1,4}|:)/gmi
    const dirname = 'in';

    fs.readdir(dirname, (err, filenames) => {
        if (err) throw err;

        filenames.forEach((filename) => {
            fs.readFile(path.join(dirname, filename), 'utf-8', (err, content) => {
                if (err) throw err;

                const replacedContent = content.replace(reg, (sub) => {
                    const dataPart = sub.match(/2002:(.*)/)[1];
                    const hextett = dataPart.split(':');

                    const h0 = parseInt(hextett[0], 16);
                    const h1 = parseInt(hextett[1], 16);

                    return `${h0 >> 8}.${0x00ff & h0}.${h1 >> 8}.${0x00ff & h1}`;
                });

                fs.writeFile(path.join('out', filename), replacedContent, (err) => {
                    if (err) throw err;
                });
            });
        });
    });
})();