describe('tab-header', function() {
  before(async () => {
    await page.goto(`${PATH}/tabheader.html`);
  });

  describe('only header', async function() {
    it('has correct widths', async () => {
      const widths = await page.$eval('#single', el => {
        const cs = Array.from(el.children);
        return {
          children: cs.map(c => c.offsetWidth).reduce((a, b) => a + b, 0),
          self: el.scrollWidth
        };
      });

      expect(Math.abs(widths.self - widths.children)).to.be.at.most(1);
    });

    it('has correct scroll position', async () => {
      assert.equal(
        await page.$eval('#single', async el => {
          el.active = 0;
          await delay(100);
          return el.scrollLeft;
        }),
        0
      );

      const next = await page.$eval('#single', async el => {
        el.active = 1;
        await delay(100);
        return el.scrollLeft;
      });
      expect(next).to.be.above(0);
    });

    it('has correct active', async () => {
      const ans = await page.$eval('#single', async el => {
        el.children[0].click();
        await delay(100);
        const zero = el.active;
        el.children[1].click();
        await delay(100);
        const one = el.active;
        return { zero, one };
      });
      expect(ans.zero).to.equal(0);
      expect(ans.one).to.equal(1);
    });
  });

  describe('with container', async function() {
    it('syncs active', async () => {
      const active = await page.evaluate(async () => {
        document.$('#container').active = 2;
        await delay(100);
        return document.$('#tabs').active;
      });

      assert.equal(active, 2);

      const active1 = await page.evaluate(async () => {
        document.$('#tabs').children[1].click();
        await delay(100);
        return document.$('#container').active;
      });
      expect(active1).to.equal(1);
    });
  });
});
