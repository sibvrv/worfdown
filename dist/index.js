"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\u2014': '&mdash;'
};
var replaceTag = function (tag) { return tagsToReplace[tag] || tag; };
var htmlSpecialChars = function (text) { return text.replace(/[&<>"\u2014]/g, replaceTag); };
var parseListItems = function (text) {
    return text.replace(/(?:(?:^|\n)[*-].*)+/g, function (m) {
        var type = m.match(/(^|\n)-/) ? 'ol' : 'ul';
        // strip first layer of list
        m = m.replace(/(^|\n)[*-][ ]?/g, "$1");
        m = parseListItems(m);
        return "<" + type + "><li>" + m.replace(/^\n/, '').split(/\n/).join('</li><li>') + "</li></" + type + ">";
    });
};
var parseList = function (text) { return text.replace(/(?:^|\n)[\s]*(?:(\*(?!\*).*?)|(-(?!-).*?))(\n\n|$)/gs, function (list) { return parseListItems(list.trim().replace(/(?:^|\n)[^*-]+/g, function (m) { return '<br/>' + m.trim().replace(/\n/g, '<br/>'); })); }); };
/**
 * WorfDown to HTML
 * @param {string} text
 * @returns {string}
 */
exports.worfdown = function (text) {
    var stack = [];
    var toStack = function (text) { return "\0" + (stack.push("<code>" + text + "</code>") - 1) + "\0"; };
    return parseList(htmlSpecialChars(text
        .replace(/\r\n/g, '\n')
        .replace(/\n{2,}/g, '\n\n')
        .replace(/```([^*]+)```/g, function (m, code) { return toStack("<code>" + code + "</code>"); })
        .replace(/ -- /gm, ' \u2014 '))
        .replace(/((?:(?:^|\n)[ \t].*)+)/g, function (m, text) { return "<pre>" + parseList(text) + "</pre>"; }))
        .replace(/^(#+)(.*)/g, function (m, h, text) { return "<h" + h.length + ">" + text.trim() + "</h" + h.length + ">"; })
        .replace(/^>{1,4}\s+(.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/''([^*]+)''/g, '<em>$1</em>')
        .replace(/--([^*]+)--/g, '<strike>$1</strike>')
        .replace(/__([^*]+)__/g, '<u>$1</u>')
        .replace(/,,([^*]+),,/g, '<sub>$1</sub>')
        .replace(/\^\^([^*]+)\^\^/g, '<sup>$1</sup>')
        .replace(/\0\d+\0/, function (m, id) { return stack[+id]; });
};
