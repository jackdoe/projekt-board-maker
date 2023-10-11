import * as fs from 'fs';

let data = JSON.parse(fs.readFileSync(0));

for (let d of data) {
    for (let c of d.asm) {
        if (c.asm.match(",98")) {
            c.asm = c.asm.replaceAll('98','✎')
            c.inst = c.asm.match('a5') ? '???00793' : '???00713'
        }

        if (c.asm.match(",296")) {
            c.asm = c.asm.replaceAll('296','▲')
            c.inst = c.asm.match('a5') ? '???00793' : '???00713'
        }

    }
}

console.log(JSON.stringify(data, null, 2))
