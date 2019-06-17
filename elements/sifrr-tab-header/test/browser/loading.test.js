describe('tab-header', function() {
  before(async () => {
    await page.goto(`${PATH}/tabheader.html`);
  });

  it('loads tab-header', async function() {
    const name = await page.evaluate("Sifrr.Dom.elements['sifrr-tab-header'].elementName");
    expect(name).to.equal('sifrr-tab-header');
  });
});
