import {expect} from 'chai';
import {worfdown} from './index';

describe('wiki to html', function () {

  describe('basic', function () {
    it('paragraph markup', function () {
      const result = worfdown(`Basic paragraph test with <, >, & and "`);
      expect(result).to.equal(`<p>Basic paragraph test with &lt;, &gt;, &amp; and &quot;</p>`);
    });

    it('multiline paragraph markup', function () {
      const result = worfdown(`Basic paragraph test with <, >, & and "\n\nTest 123\n\nTest 321`);
      expect(result).to.equal(`<p>Basic paragraph test with &lt;, &gt;, &amp; and &quot;</p><p>Test 123</p><p>Test 321</p>`);
    });
  });

  describe('titles', function () {
    it('H1', function () {
      const result = worfdown(`# Facts`);
      expect(result).to.equal(`<h1>Facts</h1>`);
    });

    it('H2', function () {
      const result = worfdown(`## Facts`);
      expect(result).to.equal(`<h2>Facts</h2>`);
    });

    it('H3', function () {
      const result = worfdown(`### Facts`);
      expect(result).to.equal(`<h3>Facts</h3>`);
    });

    it('H4', function () {
      const result = worfdown(`#### Facts`);
      expect(result).to.equal(`<h4>Facts</h4>`);
    });

    it('H5', function () {
      const result = worfdown(`##### Facts`);
      expect(result).to.equal(`<h5>Facts</h5>`);
    });
  });

  describe('text formating', function () {
    it('italic', function () {
      const result = worfdown(`''italic''`);
      expect(result).to.equal(`<em>italic</em>`);
    });

    it('bold', function () {
      const result = worfdown(`**bold**`);
      expect(result).to.equal(`<strong>bold</strong>`);
    });

    it('underline', function () {
      const result = worfdown(`__underline__`);
      expect(result).to.equal(`<u>underline</u>`);
    });

    it('strike', function () {
      const result = worfdown(`--strike--`);
      expect(result).to.equal(`<strike>strike</strike>`);
    });

    it('Mdash', function () {
      const result = worfdown(`Some text -- Some more text`);
      expect(result).to.equal(`<p>Some text &mdash; Some more text</p>`);
    });

    it('Mdash and strike #1', function () {
      const result = worfdown(`Some text -- Some more --strike text--`);
      expect(result).to.equal(`<p>Some text &mdash; Some more <strike>strike text</strike></p>`);
    });

    it('Mdash and strike #2', function () {
      const result = worfdown(`Some text -- Some more -- strike text--`);
      expect(result).to.equal(`<p>Some text &mdash; Some more &mdash; strike text--</p>`);
    });

    it('superscript', function () {
      const result = worfdown(`^^superscript^^`);
      expect(result).to.equal(`<sup>superscript</sup>`);
    });

    it('subscript', function () {
      const result = worfdown(`,,subscript,,`);
      expect(result).to.equal(`<sub>subscript</sub>`);
    });
  });

  describe('code', function () {
    it('code', function () {
      const result = worfdown(` var x = 5;\n console.log(x);`);
      expect(result).to.equal(`<pre> var x = 5;\n console.log(x);</pre>`);
    });
  });

  describe('list', function () {

    it('list', function () {
      const result = worfdown(`* first\r\n**second level\r\n**seconds level next item\r\n*second`);
      expect(result).to.equal(`<ul><li>first<ul><li>second level</li><li>seconds level next item</li></ul></li><li>second</li></ul>`);
    });

    it('Simple unordered list', function () {
      const result = worfdown(`* list item\n*list item 2`);
      expect(result).to.equal(`<ul><li>list item</li><li>list item 2</li></ul>`);
    });

    it('Simple ordered  list', function () {
      const result = worfdown(`- list item\n-list item 2`);
      expect(result).to.equal(`<ol><li>list item</li><li>list item 2</li></ol>`);
    });

    it('Unordered item with unordered sublist', function () {
      const result = worfdown(`* Item\n** Subitem`);
      expect(result).to.equal(`<ul><li>Item<ul><li>Subitem</li></ul></li></ul>`);
    });

    it('Ordered item with ordered sublist', function () {
      const result = worfdown(`- Item\n-- Subitem`);
      expect(result).to.equal(`<ol><li>Item<ol><li>Subitem</li></ol></li></ol>`);
    });

    it('Unordered item with ordered sublist', function () {
      const result = worfdown(`* Item\n*- Subitem`);
      expect(result).to.equal(`<ul><li>Item<ol><li>Subitem</li></ol></li></ul>`);
    });

    it('Multiline unordered item', function () {
      const result = worfdown(`* Item\nstill continues`);
      expect(result).to.equal(`<ul><li>Item<br/>still continues</li></ul>`);
    });

    it('Multiline ordered item', function () {
      const result = worfdown(`- Item\nstill continues`);
      expect(result).to.equal(`<ol><li>Item<br/>still continues</li></ol>`);
    });

    it('Unordered list and paragraph', function () {
      const result = worfdown(`* Item\n\nParagraph`);
      expect(result).to.equal(`<ul><li>Item</li></ul>Paragraph`);
    });

    it('Ordered list and paragraph', function () {
      const result = worfdown(`- Item\n\nParagraph`);
      expect(result).to.equal(`<ol><li>Item</li></ol>Paragraph`);
    });

    it('Unordered list with leading whitespace', function () {
      const result = worfdown(` \t* Item`);
      expect(result).to.equal(`<pre><ul><li>Item</li></ul></pre>`);
    });
  });

});
