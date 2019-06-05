describe('code editor', function() {
  before(async () => {
    await page.goto(`${PATH}/codeeditor.html`);
  });

  it('loads code editor', async function() {
    const hljs = await page.$eval('sifrr-code-editor', el => el.$('.hljs'));
    expect(hljs).to.exist;
  });
});