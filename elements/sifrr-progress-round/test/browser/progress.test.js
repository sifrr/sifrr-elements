async function getDegree() {
  return page.$eval('sifrr-progress-round', el => {
    const bar = el.$('.bar.left');
    const transform = window.getComputedStyle(bar).getPropertyValue('transform');
    const vals = transform.split('(')[1].split(')')[0].split(',');
    return Math.round(Math.atan(vals[1] / vals[0]) * (180 / Math.PI));
  });
}

describe('shows correct progress', () => {
  before(async () => {
    await page.goto(`${PATH}/progress.html`);
  });

  it('has correct progress in start', async () => {
    assert.equal(await getDegree(), 0);
  });

  it('has correct progress after setting', async () => {
    await page.$eval('sifrr-progress-round', el => el.progress = 10);
    assert.equal(await getDegree(), 36);

    await page.$eval('sifrr-progress-round', el => el.progress = 70);
    assert.equal(await getDegree(), 72);
  });
});
