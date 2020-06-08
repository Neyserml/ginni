import { Component } from '@angular/core';

@Component({
  selector: 'test-cmp',
  template: `
    <ginni-tabs>
      <ginni-tab-control></ginni-tab-control>
      <ginni-tab tabTitle="Tab 1"> Body tab1 </ginni-tab>
      <ginni-tab tabTitle="Tab 2"> Body tab2</ginni-tab>
    </ginni-tabs>
  `
})
export class TestTabComponent {}
