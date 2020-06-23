
import * as vscode from 'vscode';


export interface Shortcut extends vscode.TreeItem {
    is_folder_type() : boolean;
    getChilds() : Shortcut[];

    open() : boolean;
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

        if(element.is_folder_type()) {
            Promise.resolve(element.getChilds());
        }

        return Promise.resolve([]);
    }
}




