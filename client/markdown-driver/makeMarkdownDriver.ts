import { FantasyObservable, FantasyObserver } from "@cycle/run";
import { adapt } from "@cycle/run/lib/adapt";
import { Producer, Listener, Stream } from "xstream";
import * as marked from "marked";

/**
 * Parsed haml from parser
 */
export interface IParsed {
    html: string;
}

/**
 * Object of parsers
 */
export type parserOptions = { [option: string]: boolean | object | Function };

/**
 * Sets options for parser
 */
export interface IConfig {
    options?: parserOptions;
}

/**
 * Object with markdown to pass
 */
export interface IParse {
    markdown: string;
    options?: parserOptions;
}

/**
 * Commands that driver source will get
 */
export type SourceCommands = IConfig | IParse;

/**
 * Creates markdown to html parsing driver
 * @param options Options for markdown parser
 * @returns Stream of parsed html
 */
export function makeMarkdownDriver(options?: parserOptions) {
    if (options) {
        marked.setOptions(options);
    }
    let sink = new HtmlProducer();
    return (source: FantasyObservable, name?: string) => {
        source.subscribe({
            next: function(command: SourceCommands) {
                if ((command as IParse).markdown !== undefined) {
                    sink.trigger(handleParse(command as IParse));
                } else if ((command as IConfig).options) {
                    handleOptions(command as IConfig);
                } else {
                    throw new Error("No such command");
                }
            },
            error: function() {},
            complete: function() {}
        });
        return adapt(Stream.create(sink));
    };
}

/**
 * Converts markdown to html and returns IParsed object
 * @param parse Markdown to parse and options
 */
export function handleParse(parse: IParse): IParsed {
    return {
        html: marked(parse.markdown, parse.options)
    };
}

/**
 * Sets options for parser
 * @param options Options for parser
 */
export function handleOptions(options: IConfig): void {
    marked.setOptions(options.options);
}

/**
 * Pushes parsed HTML
 */
class HtmlProducer implements Producer<IParsed> {
    private listener: Listener<IParsed>;
    /**
     * Starts listening for html
     * @param listener Listener which listens for parsed HTML
     */
    public start(listener: Listener<IParsed>) {
        this.listener = listener;
    }
    /**
     * Passes new value to listener
     */
    public trigger(parsed: IParsed) {
        this.listener.next(parsed);
    }
    public stop() {}
}

export default makeMarkdownDriver;