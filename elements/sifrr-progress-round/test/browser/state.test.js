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

  it('not change state twice on other attribute change', async () => {
    await page.$eval('sifrr-progress-round', el =>
      el.setAttribute(':sifrr-state', '{"progress": 55}')
    );
    assert.equal(await page.$eval('sifrr-progress-round', el => el.state.progress), 55);
  });
});
