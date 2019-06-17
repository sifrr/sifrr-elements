describe('code editor', function() {
  before(async () => {
    await page.goto(`${PATH}/carousel.html`);
  });

  it('loads code editor', async function() {
    const hljs = await page.$eval('sifrr-carousel', el => el.$('.hljs'));
    expect(hljs).to.exist;
  });
});