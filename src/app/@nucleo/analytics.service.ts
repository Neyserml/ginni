import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as store from 'app/@compartidos/store';

declare const gtag: any;
declare const GA_ID: any;

interface EventParam {
  method?: string;
  event_category?: string; // The category to which the event belongs
  event_action?: string; // The type of interaction
  event_label?: string; // The additional information for the event
  value?: number; // A non-negative numeric value associated with the event
}

@Injectable()
export class AnalyticsService {
  public enabled: boolean;
  private user_id: string;
  private isLoggedIn: boolean;
  private path$ = this.appState$.select(store.getPath);

  constructor(private appState$: Store<store.State>) {
    this.enabled = false;
  }

  /**
   * Enable google analytics tracking
   */
  public enableTrack() {
    if (!this.enabled) {
      this.enabled = true;
    }
  }

  private config(options: any) {
    gtag('config', GA_ID, {
      ...options
    });
  }

  /**
   * Implement page tracking for Google Analytics.
   */
  public trackPageViews() {
    this.path$.subscribe(path => {
      if (this.enabled && path) {
        if (this.isLoggedIn && this.user_id) {
          this.config({
            user_id: this.user_id,
            page_path: path
          });
        } else {
          this.config({
            page_path: path
          });
        }
      }
    });
  }

  /**
   * Send events to Google Analytics.
   * @param eventName The event_name is the default value for event_action.
   * @param params Event parameters
   */
  public trackEvent(eventName: string, params: EventParam) {
    if (this.enabled) {
      gtag('event', eventName, params);
    }
  }
}
