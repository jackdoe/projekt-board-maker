all:
	mkdir -p build
	arm-none-eabi-gcc -fomit-frame-pointer -fno-inline-small-functions -ffreestanding -nostdlib -nostartfiles -T link.ld -O0 -g -o /tmp/game game.c
	arm-none-eabi-objdump -S -dl /tmp/game | node ../parse.js game.c | node fix-symbols.js | node ../draw.js build/arm

path:
	inkscape  build/arm-left.svg --export-text-to-path -o build/arm-left-path.svg
	inkscape  build/arm-right.svg --export-text-to-path -o build/arm-right-path.svg

pdf:
	inkscape --export-pdf=build/arm-left.pdf --export-text-to-path build/arm-left.svg
	inkscape --export-pdf=build/arm-right.pdf --export-text-to-path build/arm-right.svg
