SECTIONS
{

    . = 1000;

    .text : { *(.text) }

    .tl 128 : { *(.top_left) }
    .cl 252 : { *(.center_left) }
    .bl 300 : { *(.bottom_left) }
    .cr 1108 : { *(.bottom_right) }
    .br 1168 : { *(.bottom_right) }


    .data : { *(.data) } 
    .bss  : { *(.bss)  }
}
