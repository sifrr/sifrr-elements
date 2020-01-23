describe('tab-container', function() {
  before(async () => {
    await page.goto(`${PATH}/tabcontainer.html`);
    await page.evaluate(async () => await Sifrr.Dom.loading());
  });

  it('loads tab-container', async function() {
    const name = await page.evaluate("Sifrr.Dom.elements['sifrr-tab-container'].elementName");
    expect(name).to.equal('sifrr-tab-container');
  });
});
