describe('shimmer', function() {
  before(async () => {
    await page.goto(`${PATH}/shimmer.html`);
  });

  it('loads shimmer', async function() {
    const name = await page.evaluate("Sifrr.Dom.elements['sifrr-shimmer'].elementName");
    expect(name).to.equal('sifrr-shimmer');
  });
});
