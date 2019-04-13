describe('sifrr-lazy-picture', () => {
  before(async () => {
    await page.goto(`${PATH}/lazyimg.html`);
  });

  it('register sifrr-lazy-img', async () => {
    expect(await page.evaluate('!!Sifrr.Dom.elements["sifrr-lazy-img"]')).to.be.true;
  });

  it('hasn\'t loaded image yet', async () => {
    expect(await page.$eval('img', (el) => !!el.getAttribute('data-src'))).to.be.true;
    expect(await page.$eval('img', (el) => !!el.getAttribute('src'))).to.be.false;
  });

  it('loads pictures on scroll', async () => {
    await page.$eval('img', (el) => el.scrollIntoView());

    await new Promise(res => setTimeout(res, 100));

    expect(await page.$eval('img', (el) => !!el.getAttribute('data-src'))).to.be.false;
    expect(await page.$eval('img', (el) => !!el.getAttribute('src'))).to.be.true;
  });

  it('unobserve', async () => {
    await page.$eval('img', (el) => el.remove());
  });
});
