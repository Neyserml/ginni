import { SanitizeUrlPipe } from './sanitize-url.pipe';

describe('SanitizeUrlPipe', () => {
  let pipe: SanitizeUrlPipe;
  let sanitizer;

  beforeEach(() => {
    sanitizer = {
      bypassSecurityTrustResourceUrl: () => ''
    };
    pipe = new SanitizeUrlPipe(sanitizer);
  });

  afterEach(() => {
    pipe = null;
  });

  it('should transform by sanitizing', () => {
    const string = 'v';
    const transformed = pipe.transform(string);
    expect(transformed).toEqual('');
  });
});
