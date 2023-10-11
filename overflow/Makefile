all:
	mkdir -p build
	riscv64-unknown-elf-gcc -fomit-frame-pointer -fno-inline-small-functions -mno-shorten-memrefs -march=rv32g  -mabi=ilp32 -ffreestanding -nostdlib -nostartfiles -T link.ld -O0 -fverbose-asm -g -o /tmp/game game.c
	riscv64-unknown-elf-objdump -S -dl /tmp/game | node ../parse.js game.c | node fix-symbols.js | node ../draw.js build/overflow

path:
	inkscape  build/overflow-left.svg --export-text-to-path -o build/overflow-left-path.svg
	inkscape  build/overflow-right.svg --export-text-to-path -o build/overflow-right-path.svg

pdf:
	inkscape --export-pdf=build/overflow-left.pdf --export-text-to-path build/overflow-left.svg
	inkscape --export-pdf=build/overflow-right.pdf --export-text-to-path build/overflow-right.svg
