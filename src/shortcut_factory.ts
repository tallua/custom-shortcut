import * as fs from 'fs';

import { Shortcut } from './shortcut_provider';
import { URLShortcut } from './shortcuts/url_shortcut';
import { LNKShortcut } from './shortcuts/lnk_shortcut';
import { ShortcutDirectory } from './folders/shortcut_directory';
import { JsonDirectory } from './folders/json_directory';
import { SqlDirectory } from './folders/sqlite_directory';

export class ShortcutFactory {

    private static nullfilter<TValue>(value : TValue | null | undefined) : value is TValue {
        return value !== null && value !== undefined;
    }

    static createShortcut(fullpath : string) : Shortcut | null {
        const lstat = fs.lstatSync(fullpath);
        const filename = fullpath.split('/').pop();
        const ext = fullpath.split('.').pop()?.toLowerCase();

        if(filename === 'places.sqlite') {
            return SqlDirectory.createSqlRootDirectory(fullpath);
        } else if(filename === 'Bookmarks' || ext === 'json') {
            return JsonDirectory.createJsonRootDirectory(fullpath);
        } else if(lstat.isDirectory()) {
            return this.createDirectoryShortcut(fullpath);
        } else if(lstat.isFile()) {
            return this.createFileShortcut(fullpath);
        } else {
            return null;
        }
    }

    static createShortcuts(pathlist : string[]) : Shortcut[] {
        return pathlist
            .map(path => this.createShortcut(path))
            .filter(this.nullfilter);
    }
    private static createFileShortcut(fullpath : string) : Shortcut | null {
        let ext = fullpath.split('.').pop();
        ext = ext?.toLowerCase();

        switch(ext) {
            case 'url':
                return new URLShortcut(fullpath);
            case 'lnk':
                return new LNKShortcut(fullpath);
        }

        return null;
    }

    private static createDirectoryShortcut(fullpath : string) : Shortcut | null {
        return new ShortcutDirectory(fullpath);
    }
}