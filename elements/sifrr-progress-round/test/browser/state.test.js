describe('state managements', () => {
  before(async () => {
    await page.goto(`${PATH}/progress.html`);
  });

  it('has default 0 progress', async () => {
    assert.equal(await page.$eval('sifrr-progress-round', el => el.state.progress), 0);
  });

  it('change state on attribute change', async () => {
    await page.$eval('sifrr-progress-round', el => el.setAttribute('progress', 10));
    assert.equal(await page.$eval('sifrr-progress-round', el => el.state.progress), 10);
  });

  it('change state on property change', async () => {
    await page.$eval('sifrr-progress-round', el => el.progress = 80);
    assert.equal(await page.$eval('sifrr-progress-round', el => el.state.progress), 80);
  });

  it('progress property is same as state', async () => {
    await page.$eval('sifrr-progress-round', el => el.progress = 50);
    assert.equal(await page.$eval('sifrr-progress-round', el => el.state.progress), await page.$eval('sifrr-progress-round', el => el.progress));
  });

  it('not change state twice on other attribute change', async () => {
    await page.$eval('sifrr-progress-round', el => el.setAttribute('data-sifrr-state', '{"progress": 55}'));
    assert.equal(await page.$eval('sifrr-progress-round', el => el.state.progress), 55);
  });
});
