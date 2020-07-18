
import * as vscode from 'vscode';
import * as fs from 'fs';

import { Shortcut, ShortcutFolder } from '../shortcut_provider';
import { JsonShortcut } from '../shortcuts/json_shortcut';
import { JsonDirectoryScehma, JsonFileSchema } from '../common/json_schema'

export class JsonDirectory extends ShortcutFolder {
    public readonly collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
    public readonly label : string | undefined;

    private constructor(provider : string, private readonly json : JsonDirectoryScehma, label? : string) {
        super(provider);
        console.debug('JsonDirectory : creating : ' + json.name);
        if(label) {
            this.label = label;
        } else {
            this.label = json.name;
        }
    }

    isFolderType() : boolean {
        return true
    }

    getChilds() : Shortcut[] {
        const result = this.json.children
            .map(json => json.type === 'folder' ? 
                new JsonDirectory(this.provider, json) : new JsonShortcut(this.provider, json));

        return result;
    }

    public static createJsonRootDirectory(provider : string, fullpath : string) : JsonDirectory | null {
        const json : JsonFileSchema = JSON.parse(fs.readFileSync(fullpath).toString());
        const filename = fullpath.split('/').pop();
        const label = filename? filename : fullpath;

        try {
            if(json.hasOwnProperty('roots')) {
                if(json.roots.hasOwnProperty('bookmark_bar')) {
                        return this.createRoot(provider, json, label);
                }
            }
            
            return null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private static createRoot(provider: string, json : JsonFileSchema, label : string) : JsonDirectory {
        return new JsonDirectory(provider, json.roots.bookmark_bar, label);
    }
}