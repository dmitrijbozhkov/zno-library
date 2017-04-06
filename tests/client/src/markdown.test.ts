import { makeMarkdownDriver, handleParse, handleOptions, IParsed, IParse, IConfig } from "../../../client/markdown-driver/makeMarkdownDriver";
import * as marked from "marked";
import * as assert from "assert";
import { Stream } from "xstream";

describe("makeMarkdownDriver tests", () => {
    beforeEach(() => { // resets parser
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: false,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: false,
            smartLists: true,
            smartypants: false
        });
    });
    it("handleParse should get IParse object and contents of markdown field should be parsed to html", () => {
        let expected: IParsed = {
            html: "<p>I am using <strong>markdown</strong>.</p>\n"
        };
        let input: IParse = {
            markdown: "I am using __markdown__."
        };
        let actual = handleParse(input);
        assert.deepEqual(actual, expected);
    });
    it("handleParse should autolink if gfm option is set on true", () => {
        let expected: IParsed = {
            html: "<p>Visit <a href=\"https://github.com\">https://github.com</a></p>\n"
        };
        let input: IParse = {
            markdown: "Visit https://github.com",
            options: { gfm: true }
        };
        let actual = handleParse(input);
        assert.deepEqual(actual, expected);
    });
    it("handleOptions should set gfm on true so handleParse will output links in a tags", () => {
        let options: IConfig = {
            options: { gfm: true }
        };
        let expected: IParsed = {
            html: "<p>Visit <a href=\"https://github.com\">https://github.com</a></p>\n"
        };
        let input: IParse = {
            markdown: "Visit https://github.com"
        };
        handleOptions(options);
        let actual = handleParse(input);
        assert.deepEqual(actual, expected);
    });
    it("makeMarkdownDriver should take object with parser options and return function that takes stream of commands and returns stream of parsed html on IParse command", () => {
        let driver = makeMarkdownDriver();
        let expected: IParsed = {
            html: "<p>I am using <strong>markdown</strong>.</p>\n"
        };
        let input: IParse = {
            markdown: "I am using __markdown__."
        };
        let emptyStream = Stream.never();
        driver(emptyStream).subscribe({
            next: (parsed: IParsed) => {
                assert.deepEqual(parsed, expected);
            },
            error: () => {},
            complete: () => {}
        });
        emptyStream.shamefullySendNext(input);
    });
    it("makeMarkdownDriver should take object with parser options and return function that takes stream of commands and on IConfig command sets options for parser", () => {
        let options: IConfig = {
            options: { gfm: true }
        };
        let expected: IParsed = {
            html: "<p>Visit <a href=\"https://github.com\">https://github.com</a></p>\n"
        };
        let input: IParse = {
            markdown: "Visit https://github.com"
        };
        let driver = makeMarkdownDriver();
        let emptyStream = Stream.never();
        driver(emptyStream).subscribe({
            next: (parsed: IParsed) => {
                assert.deepEqual(parsed, expected);
            },
            error: () => {},
            complete: () => {}
        });
        emptyStream.shamefullySendNext(options);
        emptyStream.shamefullySendNext(input);
    });
    it("makeMarkdownDriver should take object with parser options and return function that takes stream of commands and throws error if command doesn't have markdown or options field", () => {
        let driver = makeMarkdownDriver();
        let errorStream = Stream.of({});
        assert.throws(() => {
            driver(errorStream);
        });
    });
});