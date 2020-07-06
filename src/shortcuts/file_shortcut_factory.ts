
import { Shortcut } from '../shortcut_provider';
import { URLShortcut } from './url_shortcut';

export class FileShortcutFactory {

    static getShortcut(fullpath : string) : Shortcut | null {
        let ext = fullpath.split('.').pop();
        ext = ext?.toLowerCase();

        switch(ext) {
            case 'url':
                return new URLShortcut(fullpath);
        }

        return null;
    }

}