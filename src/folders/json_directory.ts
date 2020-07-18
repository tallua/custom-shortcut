
import * as vscode from 'vscode';
import * as fs from 'fs';

import { Shortcut } from '../shortcut_provider';
import { JsonShortcut } from '../shortcuts/json_shortcut';
import { JsonDirectoryScehma, JsonFileSchema } from '../common/json_schema'

export class JsonDirectory implements Shortcut {
    public readonly collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    public readonly label : string | undefined;

    private constructor(private readonly json : JsonDirectoryScehma, label? : string) {
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
            .map(json => json.type === 'folder' ? new JsonDirectory(json) : new JsonShortcut(json));

        return result;
    }

    public static createJsonRootDirectory(fullpath : string) : JsonDirectory | null {
        const json : JsonFileSchema = JSON.parse(fs.readFileSync(fullpath).toString());
        const filename = fullpath.split('/').pop();
        const label = filename? filename : fullpath;

        try {
            if(json.hasOwnProperty('roots')) {
                if(json.roots.hasOwnProperty('bookmark_bar')) {
                        return this.createRoot(json, label);
                }
            }
            
            return null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private static createRoot(json : JsonFileSchema, label : string) : JsonDirectory {
        return new JsonDirectory(json.roots.bookmark_bar, label);
    }
}