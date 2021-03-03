/**
 * WorfDown to HTML
 * @param {string} text
 * @param options
 * @returns {string}
 */
export declare const worfdown: (text: string, options?: Partial<{
    onImage: (link: string) => string;
}>) => string;
