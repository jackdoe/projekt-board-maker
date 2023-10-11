import * as fs from 'fs';

let c_file = fs.readFileSync(process.argv[2]).toString().split("\n");
let currentFileLine = -1;
let code = []
let asmByLine = {}

for (let l of fs.readFileSync(0).toString().split("\n")) {
    const regex = /^\s*([a-f0-9]+):\t([a-z0-9]+)\s*(.*)$/i;
    const jumpToRe = /([a-f0-9]+) <\w.*>$/i;
    let match = l.match(regex);
    if (match) {
        let addr = parseInt(match[1], 16);
        let inst = match[2];
        let asm = match[3].replace("\t"," ");
        let jumpto = ''
        let jumpMatch = asm.match(jumpToRe)
        if (jumpMatch) {
            jumpto = parseInt('0x' + jumpMatch[1],16)
            asm = asm.replace(jumpToRe, jumpto)
        }

        let a = asmByLine[currentFileLine-1] || (asmByLine[currentFileLine-1] = [])
        a.push({addr, inst, asm})
    } else {
        const regexFileLine = /\.c:(\d+)/i;
        match = l.match(regexFileLine)
        if (match) {
            currentFileLine = parseInt(match[1])
        }
    }
}

let lineNo = 0;
for (let l of c_file) {
    if (l.match('skipme')) {
        lineNo++;
        continue;
    }
    let parsed = {
        code: l,
        lineNo: lineNo,
        asm: []
    };
    let asm = asmByLine[lineNo]
    if (asm) {
        parsed.asm = parsed.asm.concat(asm)
    }

    code.push(parsed)
    
    lineNo++;
}
console.log(JSON.stringify(code, null, 2))
