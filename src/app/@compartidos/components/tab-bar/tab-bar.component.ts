import { Component, OnInit, OnDestroy, ElementRef, ViewChild, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import * as animateScrollTo from 'animated-scroll-to';
import { Subscription } from 'rxjs/Subscription';
import * as last from 'lodash/last';

import { TabbarItemInterface } from './tab-bar.interface';
import * as store from 'app/@compartidos/store';

@Component({
  selector: 'ginni-tab-bar',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.scss']
})
export class TabBarComponent implements OnInit, OnDestroy {
  @Input() tabs: TabbarItemInterface[];

  @ViewChild('menuContainer', { read: ElementRef })
  menuContainer;

  _animateScrollTo = animateScrollTo;

  private path$ = this.appState$.select(store.getPath);
  private subscriptions: Subscription[] = [];

  constructor(private appState$: Store<store.State>) {}

  private desregistrarEventos() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private registrarEventos() {
    this.subscriptions.push(
      this.path$.subscribe(path => {
        if (path) {
          setTimeout(() => {
            const lastPath = last(path.split('/'));
            let indexSelected;
            const $menuContainer = this.menuContainer.nativeElement;
            const elementsItems: HTMLElement[] = $menuContainer.children[0].children;

            [].forEach.call(elementsItems, ($element: HTMLElement, index: number) => {
              const attrHref = $element.children[0].attributes['href'];
              if (attrHref && attrHref.value.indexOf(lastPath) > -1) {
                indexSelected = index;
              }
            });
            if (indexSelected !== undefined) {
              const offsetLeft = elementsItems[indexSelected].offsetLeft;
              this._animateScrollTo.default(offsetLeft <= 50 ? offsetLeft : offsetLeft - 50, {
                element: $menuContainer,
                horizontal: true
              });
            }
          }, 100);
        }
      })
    );
  }

  ngOnInit() {
    this.registrarEventos();
  }

  ngOnDestroy() {
    this.desregistrarEventos();
  }
}
