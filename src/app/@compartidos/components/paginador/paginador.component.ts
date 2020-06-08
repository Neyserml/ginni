import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnChanges
} from '@angular/core';
import * as uniqueId from 'lodash/uniqueId';

@Component({
  selector: 'ginni-paginador',
  template: `
    <ng-container *ngIf="totalItems">
      <input
        type="hidden"
        *ngFor="
          let item of pages
            | paginate
              : {
                  id: id,
                  itemsPerPage: itemsPerPage,
                  currentPage: currentPage,
                  totalItems: totalItems
                }
        "
      />
      <pagination-controls
        [maxSize]="maxSize"
        [id]="id"
        (pageChange)="currentPageChange.emit($event)"
        previousLabel=""
        nextLabel=""
        screenReaderPaginationLabel=""
        screenReaderCurrentLabel=""
        screenReaderPageLabel=""
      ></pagination-controls>
    </ng-container>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./paginador.component.scss']
})
export class PaginadorComponent implements OnChanges {
  @Input()
  maxSize = 6;

  @Input()
  currentPage: number;

  @Input()
  itemsPerPage = 10;

  @Input()
  totalItems: number;

  @Output()
  currentPageChange = new EventEmitter();

  public id = uniqueId();
  public pages = [1];

  constructor() {}

  ngOnChanges() {}
}
