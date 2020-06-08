import { Params } from '@angular/router';

export interface IBreadcrumb {
  key: string;
  label?: string;
  params: Params;
  url: string;
}
