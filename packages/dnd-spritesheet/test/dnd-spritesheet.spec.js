import { expect, fixture, html } from '@open-wc/testing';
import sinon from 'sinon';
import '../dnd-spritesheet.js';

describe('dnd-spritesheet', () => {
    it('works', async () => {
        const el = await fixture(html` <dnd-spritesheet></dnd-spritesheet> `);
    });
    it('should set the properties',  async () => {
        const el = await fixture(html` <dnd-spritesheet spritenr="2" src="foobar" width="100" height="200"></dnd-spritesheet> `);
        expect(el.spritenr).to.equal(2);
        expect(el.src).to.equal("foobar");
        expect(el.width).to.equal(100);
        expect(el.height).to.equal(200);
    });
    it('should call updatesprites on firstUpdated', async () => {
        const el = await fixture(html` <dnd-spritesheet></dnd-spritesheet> `);
        const spy = sinon.spy(el,"updatesprites");
        await el.firstUpdated();
        expect(spy).to.have.been.calledOnce;
    });
});
