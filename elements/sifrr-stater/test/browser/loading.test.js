describe('stater', function() {
  before(async () => {
    await page.goto(`${PATH}/stater.html`);
  });

  it('loads stater', async function() {
    const name = await page.evaluate("Sifrr.Dom.elements['sifrr-stater'].elementName");
    expect(name).to.equal('sifrr-stater');
  });
});
