import { AnimationEntryMetadata } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInDownAnimation: AnimationEntryMetadata = trigger('fadeInDownAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'translate3d(0, -50%, 0)'
    }),
    animate(
      '0.5s ease',
      style({
        opacity: 1,
        transform: 'translate3d(0, 0, 0)'
      })
    )
  ]),
  transition(':leave', [
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    }),
    animate(
      '0.5s ease',
      style({
        opacity: 0,
        transform: 'translate3d(0, -50%, 0)'
      })
    )
  ])
]);
