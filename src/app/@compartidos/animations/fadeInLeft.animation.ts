import { AnimationEntryMetadata } from '@angular/core';
import { animate, style, transition, trigger, state } from '@angular/animations';

export const fadeInLeftAnimation: AnimationEntryMetadata = trigger('fadeInLeftAnimation', [
  state(
    'inactive',
    style({
      opacity: 0,
      transform: 'translate3d(-100%, 0, 0)'
    })
  ),
  state(
    'active',
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)'
    })
  ),
  transition('inactive => active', animate('0.5s ease')),
  transition('active => inactive', animate('0.5s ease'))
]);
