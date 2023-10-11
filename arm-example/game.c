void exploit(void); //skipme
void win(void); //skipme
void __attribute__((section(".tl"))) bug(void) {
  int index = 98;
  int value = 98;
  int buffer[1];

  if (buffer[0]) {
    bug();
  }

  buffer[index] = value;
}

void __attribute__((section(".cl"))) copy(void) {
  int *a = 98;
  int *b = 296;
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
  copy();
  copy();
}


void __attribute__((section(".bl"))) win(void) {
  for (;;) {
    // YOU WIN
  }
}
