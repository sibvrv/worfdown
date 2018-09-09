const tagsToReplace: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\u2014': '&mdash;'
};

const replaceTag = (tag: string) => tagsToReplace[tag] || tag;
const htmlSpecialChars = (text: string) => text.replace(/[&<>"\u2014]/g, replaceTag);

const parseListItems = (text: string) => {
  return text.replace(/(?:(?:^|\n)[*-].*)+/g, m => {
    let type = m.match(/(^|\n)-/) ? 'ol' : 'ul';
    // strip first layer of list
    m = m.replace(/(^|\n)[*-][ ]?/g, "$1");
    m = parseListItems(m);
    return `<${type}><li>${m.replace(/^\n/, '').split(/\n/).join('</li><li>')}</li></${type}>`;
  });
};

const parseList = (text: string) => text.replace(/(?:^|\n)[\s]*(?:(\*(?!\*).*?)|(-(?!-).*?))(\n\n|$)/gs, list => parseListItems(
  list.trim().replace(/(?:^|\n)[^*-]+/g, m => '<br/>' + m.trim().replace(/\n/g, '<br/>'))
));

/**
 * WorfDown to HTML
 * @param {string} text
 * @returns {string}
 */
export const worfdown = (text: string) => {
  const stack: string[] = [];
  const toStack = (text: string) => `\0${stack.push(`<code>${text}</code>`) - 1}\0`;

  return parseList(htmlSpecialChars(text
    .replace(/\r\n/g, '\n')
    .replace(/\n{2,}/g, '\n\n')

    .replace(/```([^*]+)```/g, (m, code) => toStack(`<code>${code}</code>`))
    .replace(/ -- /gm, ' \u2014 '))
    .replace(/((?:(?:^|\n)[ \t].*)+)/g, (m, text) => `<pre>${parseList(text)}</pre>`))
    .replace(/^(#+)(.*)/g, (m, h, text) => `<h${h.length}>${text.trim()}</h${h.length}>`)

    .replace(/^>{1,4}\s+(.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/''([^*]+)''/g, '<em>$1</em>')
    .replace(/--([^*]+)--/g, '<strike>$1</strike>')
    .replace(/__([^*]+)__/g, '<u>$1</u>')
    .replace(/,,([^*]+),,/g, '<sub>$1</sub>')
    .replace(/\^\^([^*]+)\^\^/g, '<sup>$1</sup>')

    .replace(/\0\d+\0/, (m, id) => stack[+id])
    ;
};
