describe('showcase', function() {
  before(async () => {
    await page.goto(`${PATH}/showcase.html`);
  });

  it('loads showcase', async function() {
    const name = await page.evaluate("Sifrr.Dom.elements['sifrr-showcase'].elementName");
    expect(name).to.equal('sifrr-showcase');
  });

  it('loads single showcase', async function() {
    const name = await page.evaluate("Sifrr.Dom.elements['sifrr-single-showcase'].elementName");
    expect(name).to.equal('sifrr-single-showcase');
  });
});
