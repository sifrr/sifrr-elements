describe('sifrr-lazy-picture', () => {
  before(async () => {
    await page.goto(`${PATH}/lazypicture.html`);
  });

  it('register sifrr-lazy-picture', async () => {
    expect(await page.evaluate('!!Sifrr.Dom.elements["sifrr-lazy-picture"]')).to.be.true;
  });

  it('hasn\'t loaded pictures yet', async () => {
    expect(await page.$eval('picture img', (el) => !!el.getAttribute('data-src'))).to.be.true;
    expect(await page.$eval('picture img', (el) => !!el.getAttribute('src'))).to.be.false;

    expect(await page.$eval('picture source', (el) => !!el.getAttribute('data-srcset'))).to.be.true;
    expect(await page.$eval('picture source', (el) => !!el.getAttribute('srcset'))).to.be.false;
  });

  it('loads pictures on scroll', async () => {
    await page.$eval('picture', (el) => el.scrollIntoView());

    await new Promise(res => setTimeout(res, 100));

    expect(await page.$eval('picture img', (el) => !!el.getAttribute('data-src'))).to.be.false;
    expect(await page.$eval('picture img', (el) => !!el.getAttribute('src'))).to.be.true;

    expect(await page.$eval('picture source', (el) => !!el.getAttribute('data-srcset'))).to.be.false;
    expect(await page.$eval('picture source', (el) => !!el.getAttribute('srcset'))).to.be.true;
  });
});
