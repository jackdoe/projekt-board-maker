import * as fs from 'fs';
import paper from 'paper';  

const red = '#ff0000'
const faded = '#555555'

function sfc32(a, b, c, d) {
    return function() {
        a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
        var t = (a + b) | 0;
        a = b ^ b >>> 9;
        b = c + (c << 3) | 0;
        c = (c << 21 | c >>> 11);
        d = d + 1 | 0;
        t = t + d | 0;
        c = c + t | 0;
        return (t >>> 0) / 4294967296;
    }
}
Math.random = sfc32()
const pathFromTo = (x1,y1, x2,y2, color) => {
    var path = new paper.Path({
        segments: [
            [x1,y1],
            [x2,y2],
        ],
	strokeColor: color,
    });
    return path
}

let textLine = (v, x,y,size, color='black') => {
    var t = new paper.PointText(new paper.Point(x, y));
    t.fillColor = color;
    t.fontFamily = 'Terminus (TTF)';
    t.fontSize = size + 'px';
    t.content = v
}

const draw = (name, memory, c_code, fromAddress, toAddress, right, bytes, hiddenMessage) => {
    let size = 28
    let lineHeight = size + 2
    let w = 1122.5
    let h = 1587.4
    paper.setup(new paper.Size(w,h));
    let offY = 100;
    let offX = 100;

    let left = !right
    let n = 0;
    let lineXY = {}
    let padding = 5;
    for (let i = fromAddress; i < toAddress; i+= bytes) {
        let r = memory[i]

        let x = left ? w - offX : offX
        let y = offY + n*lineHeight

        // line connections
        if (!r.line) {
            if (left) {
                pathFromTo(w/2,y,w,y,'black')
            } else {
                pathFromTo(0,y,w/2,y,'black')
            }
        } else {
            lineXY[r.line] ||= []
            lineXY[r.line].push({x,y})
        }

        // squares
        let rx = (x + padding)
        if (left) {
            rx = x - size + padding
        }
        let ry = y - size + padding
        var rect = new paper.Rectangle(rx,ry, size - padding*2, size - padding*2);
        var path = new paper.Path.Rectangle(rect);
        path.strokeColor = 'black'
        path.fillColor = 'black'


        // address and instruction
        let addr = r.asm.addr + ''
        if (left) {
            // addr
            x -= (size * 3) - padding*2
            textLine(addr, x, y - padding, size, 'black')

            // inst
            x -= 55
            textLine(r.asm.inst, x, y - padding, size * 0.4, faded)
            x = w/2 + size + 45
        } else {
            // addr
            x += size
            textLine(addr, x, y - padding, size, 'black')

            // inst
            x += (addr.length == 4 ? 70 : 55)
            textLine(r.asm.inst, x, y - padding, size * 0.4, faded)
            x += 75
        }

        // assembly
        let textSize = size
        if (r.asm.asm.length > 20) {
            textSize *= 0.5
        }
        textLine(r.asm.asm, x, y - padding, textSize)
        n++;
    }

    let y = offY
    let zebra = true
    for (let r of c_code) {
        if (!r.code || r.code.match('skipme')) {
            continue
        }

        r.code = r.code.replaceAll(/__attribute__\(\(section\(".*"\)\)\)/g,'')

        let x = left ? offX :  (w - w/3)
        let dst = lineXY[r.lineNo]
        // no stack
        if (!dst && r.code.match(/^(void|int).*?\(.*?\) {/g)) {
            // find the first line
            for (let k = r.lineNo; k < c_code.length - 1; k++) {
                let d = lineXY[k+1]

                if (d) {
                    if (d[0].y > y) {
                        y = d[0].y + (size*0.7)
                    }
                    break;
                }
            }
        }
        if (dst) {
            if (r.code.match(/^(void|int).*?\(.*?\) {/g)) {
                if (dst[0].y > y) {
                    y = dst[0].y + (size*0.7)
                }
            }

            let color = 'black'
            let altColorZebra = '#0000ff'
            for (let d of dst) {
                let pathA;
                let pathB;
                if (left) {
                    pathA = pathFromTo(w/3,y,w/2,d.y,color)
                    pathB = pathFromTo(w,d.y,w/2,d.y,color)
                } else {
                    pathA = pathFromTo(x,y,w/2,d.y,color)
                    pathB = pathFromTo(0,d.y,w/2,d.y,color)
                }
                if (zebra) {
                    pathA.dashArray = [5,5]
                    pathB.strokeColor = altColorZebra
                    pathA.strokeColor = altColorZebra
                }

            }
            if (left) {
                let p = pathFromTo(0,y,w/3,y,'black')
                if (zebra) {
                    p.strokeColor = altColorZebra
                }
            } else {
                let p = pathFromTo(x,y,w,y,'black')
                if (zebra) {
                    p.strokeColor = altColorZebra
                }
            }
            zebra = !zebra
        }

        // svg cant start with spaces, so we need to manually offset
        let n = r.code.length - r.code.trimLeft().length
        x += n * 13
        let t = r.code

        let c = 'black'
        if (t.match(/\d+\(sp\)/)) {
            c = red
        }

        let tsize = size * 0.7
        textLine(t, x, y - padding, tsize,c)

        y += (size*0.7+8)
    }

    if (left) {
        var path = new paper.Path({
            segments: [[w - offX - size, 0],[w - offX - size,h]],
            strokeColor: 'black',
        });
    } else {
        var path = new paper.Path({
            segments: [[offX + size, 0],[offX + size,h]],
            strokeColor: 'black',
        });
    }

    const logo = (startX, startY, radius, text) => {
        let centerX = startX + radius
        let centerY = startY + radius
        
        for (let angle = 0; angle < 360; angle += 14) {
            let x = centerX + Math.cos(angle) * radius
            let y = centerY + Math.sin(angle) * radius
            let strokeW = 1 + Math.random() * 5
            var path = new paper.Path({
                segments: [[centerX, centerY],[x,y]],
                strokeColor: 'black',
                strokeWidth: strokeW
            });
        }

        let y = startY + radius * 2 + text[0].size + 5
        for (let i = 0; i < text.length; i++) {
            let t = text[i]
            textLine(t.text, startX, y, t.size)
            y += i == text.length - 1 ? t.size : text[i+1].size
        }
        var myCircle = new paper.Path.Circle(new paper.Point(centerX, centerY), 65);
        myCircle.strokeColor = red
        myCircle.strokeWidth = 5

    }

    if (right) {
        let title = `OVERFLOW`
        let version = '0.0.5'
        let text = [
            {text: `PROJEKT: ${title}`,size: 30},
            {text: 'https://punkx.org/overflow',size: 15},
            {text: `version: ${version}`,size: 15},
        ]
        
        text = [...text,
                {text: 'license: CC BY 4.0',size: 15},
                {text: 'copyright: jackdoe 2023',size: 15},
               ]

        logo(w - w/3, h/2 - 210, 100, text)
    } else {
        let text = [
            {text: '受け継がれる意志、', size: 20},
            
            {text: '時代のうねり、', size: 20},
            {text: '人の夢。', size: 20},
            
            {text: '人が『自由』の答えを求める限り、', size: 20},
            {text: 'それらは決して止まらない。', size: 20},
            {text: '', size: 15},        
            {text: '海賊王', size: 20},
            
            {text: 'ゴール・D・ロジャー', size: 20},
        ]

        let y = h/2 + 25
        for (let t of text) {
            textLine(t.text, offX, y, t.size)
            y += t.size + 5
        }
    }

    const draw_frame = () => {
        const message = (m, x, h, size) => {
            const each = (cb) => {
                let i = 0;
                for (let s of m) {
                    let c = Number(s.charCodeAt(0)).toString(2).padStart(8,'0');
                    for (let b of c) {
                        cb(parseInt(b), i)
                        i += size + 2
                    }
                    i += size*2
                }
            }

            let totalSize = 0;
            each((b,y) => {
                totalSize = y;
            });
            let y0 = (h - totalSize) / 2

            const rect = (bit, y) => {
                var r = new paper.Rectangle(x,y0 + y, size, size);
                var p = new paper.Path.Rectangle(r);
                if (bit != 0) {
                    p.fillColor = '#ffffff'
                }
            }
            each(rect);
        }

        let i = 0;
        let widths = [40, 30, 20, 20]
        let heights = [200, 100, 150]

        let p = new paper.Path.Rectangle(new paper.Rectangle(0, 0, w, 20));
        p.fillColor = '#000000'

        p = new paper.Path.Rectangle(new paper.Rectangle(0, h-20, w, 20));
        p.fillColor = '#000000'
        
        if (left) {
            p = new paper.Path.Rectangle(new paper.Rectangle(0, 0, 20, h));
            p.fillColor = '#000000'
            p = new paper.Path.Rectangle(new paper.Rectangle(w-2, 0, 2, h));
            p.fillColor = '#000000'
            message(hiddenMessage, 0, h, 10)
        } else {
            p = new paper.Path.Rectangle(new paper.Rectangle(0, 0, 2, h));
            p.fillColor = '#000000'
            p = new paper.Path.Rectangle(new paper.Rectangle(w-20, 0, 20, h));
            p.fillColor = '#000000'

            message(hiddenMessage, w - 10, h, 10)
        }
    }

    draw_frame()
    var svg = paper.project.exportSVG({asString:true});
    fs.writeFileSync(name, svg);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


let fromAddressLeft = 128
let toAddressLeft = 316
let fromAddressRight = 1000
let toAddressRight = 1192

let data = JSON.parse(fs.readFileSync(0))

let codeLeft = []
let codeRight = []
let memoryLeft = []
let memoryRight = []
let bytes = 4;

for (let i = fromAddressLeft; i < toAddressLeft; i += bytes) {
    memoryLeft[i] = {asm: {addr: i, inst: '00000000', asm: ''}, line: ''}
}

for (let i = fromAddressRight; i < toAddressRight; i += bytes) {
    memoryRight[i] = {asm: {addr: i, inst: '00000000', asm: ''}, line: ''}
}

let direction = 'left'
for (let d of data) {
    if (d.code.match('int main')) {
        direction='right'
    }

    if (direction == 'left') {
        codeLeft.push({code: d.code, lineNo: d.lineNo})
    } else {
        codeRight.push({code: d.code, lineNo: d.lineNo})
    }
        
    for (let a of d.asm) {
        if (a.addr >= fromAddressLeft && a.addr <= toAddressLeft) {
            memoryLeft[a.addr] = {asm: a, line: d.lineNo}
        } else if (a.addr >= fromAddressRight && a.addr <= toAddressRight) {
            memoryRight[a.addr] = {asm: a, line: d.lineNo}
        }
    }
}

draw(`${process.argv[2]}-left.svg`, memoryLeft, codeLeft, fromAddressLeft, toAddressLeft, false, bytes, "hello left")
draw(`${process.argv[2]}-right.svg`, memoryRight, codeRight, fromAddressRight, toAddressRight, true, bytes, "hello right")
