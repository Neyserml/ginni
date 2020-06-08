import { CapitalizeTextPipe } from './capitalize-text.pipe';

describe('CapitalizeTextPipe', () => {
  let pipe: CapitalizeTextPipe;

  beforeEach(() => {
    pipe = new CapitalizeTextPipe();
  });

  afterEach(() => {
    pipe = null;
  });

  it('should capitalize any text', () => {
    const string = 'nicolás';
    const transformed = pipe.transform(string);
    expect(transformed).toEqual('Nicolás');
  });
});
