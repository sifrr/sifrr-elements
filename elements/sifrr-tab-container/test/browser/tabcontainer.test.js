describe('tab-container', function() {
  before(async () => {
    await page.goto(`${PATH}/tabcontainer.html`);
  });

  describe('single tab', async function() {
    it('has correct widths', async () => {
      const widths = await page.$eval('#single', el => {
        const cs = Array.from(el.children);
        return cs.map(c => c.clientWidth);
      });
      widths.forEach(w => {
        assert.equal(w, 400);
      });

      assert.equal(
        await page.$eval('#single', el => el.shadowRoot.querySelector('.tabs').clientWidth),
        1200
      );
    });

    it('has correct scroll position', async () => {
      assert.equal(await page.$eval('#single', el => el.scrollLeft), 0);
      assert.equal(
        await page.$eval('#single', async el => {
          el.active = 1;
          await delay(100);
          return el.scrollLeft;
        }),
        400
      );
      assert.equal(
        await page.$eval('#single', async el => {
          el.active = 2;
          await delay(100);
          return el.scrollLeft;
        }),
        800
      );
    });

    it('next,prev works', async () => {
      assert.equal(
        await page.$eval('#single', async el => {
          el.active = 0;
          el.next();
          await delay(100);
          return el.scrollLeft;
        }),
        400
      );
      assert.equal(
        await page.$eval('#single', async el => {
          el.prev();
          await delay(100);
          return el.scrollLeft;
        }),
        0
      );
    });

    it('goes to last tab if not looped', async () => {
      assert.equal(
        await page.$eval('#single', async el => {
          el.active = 10;
          el.next();
          await delay(100);
          return el.scrollLeft;
        }),
        800
      );
    });
  });

  describe('looped', function() {
    it('loops', async () => {
      assert.equal(
        await page.$eval('#single', async el => {
          el.active = 3;
          await delay(100);
          return el.scrollLeft;
        }),
        0
      );

      assert.equal(
        await page.$eval('#single', async el => {
          el.active = 5;
          await delay(100);
          return el.scrollLeft;
        }),
        800
      );

      assert.equal(
        await page.$eval('#single', async el => {
          el.active = 8;
          await delay(100);
          return el.scrollLeft;
        }),
        800
      );
    });
  });

  describe('multi tab', async function() {
    it('has correct widths', async () => {
      const widths = await page.$eval('#multi', el => {
        const cs = Array.from(el.children);
        return cs.map(c => c.clientWidth);
      });
      widths.forEach(w => {
        assert.equal(w, 200);
      });

      assert.equal(
        await page.$eval('#multi', el => el.shadowRoot.querySelector('.tabs').clientWidth),
        1200
      );
    });

    it('has correct scroll position', async () => {
      assert.equal(await page.$eval('#multi', el => el.scrollLeft), 0);
      assert.equal(
        await page.$eval('#multi', async el => {
          el.active = 2;
          await delay(100);
          return el.scrollLeft;
        }),
        400
      );
      assert.equal(
        await page.$eval('#multi', async el => {
          el.active = 3;
          await delay(100);
          return el.scrollLeft;
        }),
        600
      );
      assert.equal(
        await page.$eval('#multi', async el => {
          el.active = 4;
          await delay(100);
          return el.scrollLeft;
        }),
        600
      );
    });

    it('next,prev works', async () => {
      assert.equal(
        await page.$eval('#multi', async el => {
          el.active = 0;
          el.next();
          await delay(100);
          return el.scrollLeft;
        }),
        200
      );
      assert.equal(
        await page.$eval('#multi', async el => {
          el.prev();
          await delay(100);
          return el.scrollLeft;
        }),
        0
      );
    });
  });

  describe('other options', () => {
    it('calls active/inactive listeners', async () => {
      assert.deepEqual(
        await page.$eval('#single', async el => {
          let i = 0,
            j = 0;
          el.$('div', false).onActive = () => i++;
          el.$('div', false).onInactive = () => j++;
          el.active = 0;
          el.active = 1;
          el.active = 2;
          await delay(10);
          return [i, j];
        }),
        [1, 1]
      );
    });
  });
});
