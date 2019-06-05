describe('include', function() {
  before(async () => {
    await page.goto(`${PATH}/include.html`);
  });

  it('loads include', async function() {
    const name = await page.evaluate("Sifrr.Dom.elements['sifrr-include'].elementName");
    expect(name).to.equal('sifrr-include');
  });
});
