import { AnimationEntryMetadata } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInAnimation: AnimationEntryMetadata = trigger('fadeInAnimation', [
  transition(':enter', [
    style({
      opacity: 0
    }),
    animate(
      '0.5s ease',
      style({
        opacity: 1
      })
    )
  ]),
  transition(':leave', [
    style({
      opacity: 1
    }),
    animate(
      '0.5s ease',
      style({
        opacity: 0
      })
    )
  ])
]);
