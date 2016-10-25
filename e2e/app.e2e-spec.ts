import { MumfrogNgPage } from './app.po';

describe('mumfrog-ng App', function() {
  let page: MumfrogNgPage;

  beforeEach(() => {
    page = new MumfrogNgPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
