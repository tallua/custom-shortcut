
import * as vscode from 'vscode';


export interface Shortcut extends vscode.TreeItem {
    isFolderType() : boolean;

    // use if is_folder_type() == true
    getChilds() : Shortcut[];
    // use if is_folder_type() == false
    open() : boolean;
}

export class NullShortcut implements Shortcut {
    isFolderType() : boolean {
        return false;
    }

    getChilds() : Shortcut[] {
        return [];
    }
    
    open() : boolean {
        return false;
    }
}

export class ShortcutProvider implements vscode.TreeDataProvider<Shortcut> {
    constructor(private root : Shortcut) { }

    getTreeItem(element : Shortcut) : vscode.TreeItem {
        return element;
    }

    getChildren(element : Shortcut) : Thenable<Shortcut[]> {
        if(!element) {
            return Promise.resolve([this.root]);
        }

        if(element.isFolderType()) {
            Promise.resolve(element.getChilds());
        }

        return Promise.resolve([]);
    }
}




