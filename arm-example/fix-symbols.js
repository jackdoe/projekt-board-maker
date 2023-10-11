import * as fs from 'fs';

let data = JSON.parse(fs.readFileSync(0));

for (let d of data) {
    d.code = d.code.replace('99','⚄').replaceAll('98','✎').replaceAll('296','▲')
    for (let c of d.asm) {
        c.asm = c.asm.replaceAll("\t"," ")
        if (c.asm.match("#98 @ 0x62")) {
            c.asm = c.asm.replaceAll('98 @ 0x62','✎')
            c.inst = '????????'
        }

        if (c.asm.match("#296 @ 0x128")) {
            c.asm = c.asm.replaceAll('296 @ 0x128','▲')
            c.inst = '????????'
        }
    }
}
console.log(JSON.stringify(data, null, 2))
