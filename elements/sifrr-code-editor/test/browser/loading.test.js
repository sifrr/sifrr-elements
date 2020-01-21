async function assertValue(selector, value) {
  await page.$eval(selector, async el => await el.cmLoaded());

  const value0 = await page.$eval(selector, el => el.value);
  expect(value0).to.be.equal(value);

  const value1 = await page.$eval(selector, el => el.$('textarea').value);
  expect(value1).to.be.equal(value);

  const value2 = await page.$eval(selector, el => el.cm.getValue());
  expect(value2).to.be.equal(value);
}

describe('code editor', function() {
  before(async () => {
    await page.goto(`${PATH}/codeeditor.html`);
    await page.evaluate(async () => await Sifrr.Dom.loading());
  });

  it('loads code editor', async function() {
    const type = await page.$eval('sifrr-code-editor', el => typeof el.$('textarea'));
    expect(type).to.be.equal('object');
  });

  it('has value from prop', async function() {
    await assertValue('sifrr-code-editor', 'bang');
  });

  it('sets value from prop', async function() {
    await page.$eval('sifrr-code-editor', el => ((el.value = 'ok'), el.onPropChange('value')));
    await assertValue('sifrr-code-editor', 'ok');
  });

  it('works with controlled input event', async function() {
    await page.$eval('sifrr-code-editor', el => ((el.value = 'ok'), el.onPropChange('value')));
    await assertValue('sifrr-code-editor', 'ok');
  });
});
