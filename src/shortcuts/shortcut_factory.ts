
import { Shortcut } from '../shortcut_provider';
import { URLShortcut } from './url_shortcut';

export class ShortcutFactory {

    static getFileShortcut(fullpath : string) : Shortcut | null {
        let ext = fullpath.split('.').pop();
        ext = ext?.toLowerCase();

        switch(ext) {
            case 'url':
                return new URLShortcut(fullpath);
        }

        return null;
    }

}