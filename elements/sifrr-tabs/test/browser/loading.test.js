describe('tabs', function() {
  before(async () => {
    await page.goto(`${PATH}/tabs.html`);
  });

  it('loads tabs', async function() {
    const name = await page.evaluate("Sifrr.Dom.elements['sifrr-tabs'].elementName");
    expect(name).to.equal('sifrr-tabs');
  });
});
