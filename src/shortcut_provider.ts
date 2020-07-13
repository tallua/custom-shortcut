
import * as vscode from 'vscode';
import { RootDirectory } from './folders/root_directory';


export interface Shortcut extends vscode.TreeItem {
    isFolderType() : boolean;

    // use if is_folder_type() == true
    getChilds() : Shortcut[];
}

export class ShortcutProvider implements vscode.TreeDataProvider<Shortcut> {
    constructor(private root : RootDirectory) { }

    getTreeItem(element : Shortcut) : vscode.TreeItem {
        return element;
    }

    getChildren(element : Shortcut) : Thenable<Shortcut[]> {
        if(!element) {
            return Promise.resolve(this.root.getChilds());
        }

        if(element.isFolderType()) {
            return Promise.resolve(element.getChilds());
        }

        return Promise.resolve([]);
    }
}




