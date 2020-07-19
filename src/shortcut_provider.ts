
import * as vscode from 'vscode';
import { RootDirectory } from './folders/root_directory';


export interface Shortcut extends vscode.TreeItem {
    provider : string;

    isFolderType() : boolean;

    // use if is_folder_type() == true
    getChilds() : Shortcut[];
}

export abstract class ShortcutFolder implements Shortcut {
    public readonly collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    public abstract readonly label : string | undefined;

    constructor(public readonly provider : string) { 
        
    }

    isFolderType() {
        return true;
    }

    abstract getChilds() : Shortcut[];
}

export abstract class ShortcutItem implements Shortcut {
    public readonly collapsibleState = vscode.TreeItemCollapsibleState.None;
    public abstract readonly label : string | undefined;

    constructor(public readonly provider : string) { 
        
    }

    isFolderType() {
        return false;
    }

    getChilds() : Shortcut[] {
        return [];
    }
}

export class ShortcutProvider implements vscode.TreeDataProvider<Shortcut> {
    constructor(private root : RootDirectory, public readonly name : string) { }

    private _onDidChangeTreeData: vscode.EventEmitter<Shortcut | undefined> = new vscode.EventEmitter<Shortcut | undefined>();
    readonly onDidChangeTreeData: vscode.Event<Shortcut | undefined> = this._onDidChangeTreeData.event;

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

    refresh(shortcut : Shortcut | undefined) : void {
        this._onDidChangeTreeData.fire(shortcut);
    }
}




