import { Shortcut, ShortcutFolder } from '../shortcut_provider';
import { ShortcutFactory } from '../shortcut_factory';

export class RootDirectory extends ShortcutFolder {
    public readonly label = '';

    constructor(provider : string, public readonly pathlist : string[]) {
        super(provider);
        console.debug('RootDirectory : creating'); 
    }

    getChilds() : Shortcut[] {
        return ShortcutFactory.createShortcuts(this.provider, this.pathlist);
    }
}
