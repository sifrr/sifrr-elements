describe('carousel', function() {
  before(async () => {
    await page.goto(`${PATH}/carousel.html`);
  });

  it('loads carousel', async function() {
    const name = await page.evaluate("Sifrr.Dom.elements['sifrr-carousel'].elementName");
    expect(name).to.equal('sifrr-carousel');
  });
});
