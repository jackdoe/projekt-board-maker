# projekt

This is the code used to generate the board for [PROJEKT:OVERFLOW](https://punkx.org/overflow)

# install

```
npm install
install riscv toolchain: https://github.com/riscv-software-src/homebrew-riscv
install arm toolchain: arm-none-eabi-gcc
```

# building the overflow board:

```
cd overflow
make 
make pdf
```

and the pdfs should be in build/overflow-*.pdf


[left](overflow/build/overflow-left.pdf)
[right](overflow/build/overflow-right.pdf)


# building the arm example:

```
cd arm-example
make 
make pdf
```

and the pdfs should be in build/arm-*.pdf


[left](arm-example/build/arm-left.pdf)
[right](arm-example/build/arm-right.pdf)


# how it works

Compiled with -g and -O0 then objdump is used to disassemble, and its processed by parse.js then some symbols are fixed by fix-symbols.js and then its drawn from draw.js.


# tips

modify the fromAddress and toAddress in draw.js to work with different values, you might also need to fix the x offsets in draw.js if you want to make it 64bit
