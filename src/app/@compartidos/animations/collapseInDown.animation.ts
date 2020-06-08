import { AnimationEntryMetadata } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';

export const collapseInDownAnimation: AnimationEntryMetadata = trigger('collapseInDownAnimation', [
  transition(':enter', [
    style({
      height: 0,
      overflow: 'hidden'
    }),
    animate(
      '0.2s ease',
      style({
        height: '*'
      })
    )
  ]),
  transition(':leave', [
    style({
      height: '*'
    }),
    animate(
      '0.2s ease',
      style({
        height: 0,
        overflow: 'hidden'
      })
    )
  ])
]);
