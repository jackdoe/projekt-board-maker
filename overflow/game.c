void exploit(void); //skipme
void set_trap(void); //skipme
void __attribute__((section(".tl"))) bug(void) {
  // 12(sp)
  int index = 98;
  // 8(sp)
  int value = 98;
  // 4(sp)
  int buffer[1];

  if (buffer[0]) {
    bug();
  }

  buffer[index] = value;
}

void __attribute__((section(".cl"))) copy(void) {
  asm("li a5, 296");

  asm("li a4, 98");
  asm("lw a4, 0(a4)");
  asm("sw a4, 0(a5)");

  asm("li a4, 98");
  asm("lw a4, 0(a4)");
  asm("sw a4, 4(a5)");
}

void __attribute__((section(".bl"))) game_over(void) {
  for (;;) {
    // GAME OVER: YOU LOSE
  }
}

int main(void) {
  // 12(sp)
  int run = 1;
  do {
    // 8(sp)
    int choice = 98;
    if (choice) {
      exploit();
    } else {
      bug();
    }
  } while(run);
  
  return 0;
}

void __attribute__((section(".cr"))) exploit(void) {
  // 12(sp)
  int should_set_trap;
  if (should_set_trap) {
    set_trap();
    should_set_trap = 0;
  } else {
    copy();
    copy();
  }
}

void __attribute__((section(".br"))) set_trap(void) {
  asm("li a4, 98");
  asm("csrw mtvec, a4");
}

