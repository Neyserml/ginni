import { AnimationEntryMetadata } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

export const zoomAnimation: AnimationEntryMetadata = trigger('zoomAnimation', [
  transition(':enter', [
    style({
      opacity: 0,
      transform: 'scale3d(0.3, 0.3, 0.3)'
    }),
    animate(
      '0.5s ease',
      style({
        opacity: 1,
        transform: 'scale3d(1, 1, 1)'
      })
    )
  ]),
  transition(':leave', [
    style({
      opacity: 1,
      transform: 'scale3d(1, 1, 1)'
    }),
    animate(
      '0.5s ease',
      style({
        opacity: 0,
        transform: 'scale3d(0.3, 0.3, 0.3)'
      })
    )
  ])
]);
