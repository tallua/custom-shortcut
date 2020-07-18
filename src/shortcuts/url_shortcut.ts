
import * as vscode from 'vscode';
import * as fs from 'fs';

import { ShortcutItem } from '../shortcut_provider';

export class URLShortcut extends ShortcutItem {
    public readonly label : string | undefined;
    public readonly path : string;
    public readonly command : vscode.Command;

    constructor(provider : string, public readonly fullpath : string) {
        super(provider);
        console.debug('URLShortcut : creating : ' + fullpath);
        this.label = fullpath.split('/').pop();
        this.path = fullpath;

        const url = this.getUrl();
        this.command = {
            command: 'custom-shortcut.open-link',
            title: '',
            arguments: [url]
        };
    }

    getUrl() : string {
        const lines = fs.readFileSync(this.path).toString().split(/\r?\n/);
        const types = lines.filter((line : string) => line === '[InternetShortcut]');
        if(types.length === 0) {
            console.error('URLShortcut : not an InternetShortcut : ' + this.fullpath);
            return '';
        }

        const urls = lines.filter((line : string) => line.startsWith('URL='));
        if(urls.length === 0) {
            console.error('URLShortcut : missing URL : ' + this.fullpath);
            return '';
        }

        return urls[0].substring(4);
    }
}
