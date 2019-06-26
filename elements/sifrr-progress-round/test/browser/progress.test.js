async function getProgress() {
  return page.$eval('sifrr-progress-round', el => {
    const bar = el.$('#top');
    const strokeOffset = bar.getAttribute('stroke-dashoffset');
    return Math.round((Number(strokeOffset) / 188.5) * 100);
  });
}

describe('shows correct progress', () => {
  before(async () => {
    await page.goto(`${PATH}/progress.html`);
  });

  it('has correct progress in start', async () => {
    assert.equal(await getProgress(), 100);
  });

  it('has correct progress after setting', async () => {
    await page.$eval('sifrr-progress-round', el => (el.state = { progress: 10 }));
    assert.equal(await getProgress(), 90);

    await page.$eval('sifrr-progress-round', el => (el.state = { progress: 70 }));
    assert.equal(await getProgress(), 30);
  });
});
