import { FormControl } from '@angular/forms';
import { NotEmptyValidator } from './not-empty.validator';

describe('NotEmptyValidator', () => {
  it('should validate', () => {
    const res = NotEmptyValidator(new FormControl('123'));
    expect(res(new FormControl('123'))).toEqual(null);
  });

  it('should not validate', () => {
    const res = NotEmptyValidator(new FormControl(''));
    expect(res(new FormControl(''))).toEqual({
      empty: true
    });
  });
});
