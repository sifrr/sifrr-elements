describe('code editor', function() {
  before(async () => {
    await page.goto(`${PATH}/codeeditor.html`);
  });

  it('loads code editor', async function() {
    const textarea = await page.$eval('sifrr-code-editor', el => el.$('textarea'));
    expect(textarea).to.exist;
  });
});