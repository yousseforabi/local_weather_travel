declare module 'fast-xml-parser' {
    export class XMLParser {
        constructor(options?: {
            ignoreAttributes?: boolean;
            attributeNamePrefix?: string;
            [key: string]: any;
        });
        parse(xml: string): any;
    }
} 