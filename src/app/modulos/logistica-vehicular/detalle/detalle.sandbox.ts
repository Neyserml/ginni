import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';

@Injectable()
export class DetalleSandbox {
  constructor(private activatedRoute: ActivatedRoute) {}

  private getChildrenOfActiveRoute(
    activatedRoute: ActivatedRouteSnapshot,
    iterate = 1
  ): ActivatedRouteSnapshot {
    if (activatedRoute) {
      if (iterate === 1) {
        return activatedRoute.children[0];
      } else {
        return this.getChildrenOfActiveRoute(activatedRoute.children[0], iterate - 1);
      }
    }
  }

  public obtenerId(nivel = 4) {
    if (this.activatedRoute.snapshot) {
      const activatedRouter = this.getChildrenOfActiveRoute(this.activatedRoute.snapshot, nivel);
      return activatedRouter ? activatedRouter.params['id'] : null;
    }
  }
}
