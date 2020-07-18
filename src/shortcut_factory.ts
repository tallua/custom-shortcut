import * as fs from 'fs';

import { Shortcut } from './shortcut_provider';
import { URLShortcut } from './shortcuts/url_shortcut';
import { LNKShortcut } from './shortcuts/lnk_shortcut';
import { ShortcutDirectory } from './folders/shortcut_directory';
import { JsonRootDirectory } from './folders/json_directory';
import { SqlRootDirectory } from './folders/sqlite_directory';

export class ShortcutFactory {

    public static nullfilter<TValue>(value : TValue | null | undefined) : value is TValue {
        return value !== null && value !== undefined;
    }

    static createShortcut(provider : string, fullpath : string) : Shortcut | null {
        const lstat = fs.lstatSync(fullpath);
        const filename = fullpath.split('/').pop();
        const ext = fullpath.split('.').pop()?.toLowerCase();

        if(filename === 'places.sqlite') {
            return this.createSqlShortcut(provider, fullpath);
        } else if(filename === 'Bookmarks' || ext === 'json') {
            return this.createJsonShortcut(provider, fullpath);
        } else if(lstat.isDirectory()) {
            return this.createDirectoryShortcut(provider, fullpath);
        } else if(lstat.isFile()) {
            return this.createFileShortcut(provider, fullpath);
        } else {
            return null;
        }
    }

    static createShortcuts(provider : string, pathlist : string[]) : Shortcut[] {
        return pathlist
            .map(path => this.createShortcut(provider, path))
            .filter(this.nullfilter);
    }
    
    private static createSqlShortcut(provider : string, fullpath : string) : Shortcut | null {
        return new SqlRootDirectory(provider, fullpath);
    }

    private static createJsonShortcut(provider : string, fullpath : string) {
        return JsonRootDirectory.create(provider, fullpath);
    }

    private static createFileShortcut(provider : string, fullpath : string) : Shortcut | null {
        let ext = fullpath.split('.').pop();
        ext = ext?.toLowerCase();

        switch(ext) {
            case 'url':
                return new URLShortcut(provider, fullpath);
            case 'lnk':
                return new LNKShortcut(provider, fullpath);
        }

        return null;
    }

    private static createDirectoryShortcut(provider : string, fullpath : string) : Shortcut | null {
        return new ShortcutDirectory(provider, fullpath);
    }
}