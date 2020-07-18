
import * as vscode from 'vscode';
import * as fs from 'fs';

import { Shortcut, ShortcutFolder } from '../shortcut_provider';
import { JsonShortcut } from '../shortcuts/json_shortcut';
import { JsonDirectoryScehma, JsonFileSchema } from '../common/json_schema'

class JsonChildDirectory extends ShortcutFolder {
    public readonly label : string | undefined;

    constructor(provider : string, private readonly json : JsonDirectoryScehma) {
        super(provider);

        this.label = json.name;
        console.debug('JsonChildDirectory : creating : ' + json.name);
    }

    getChilds() : Shortcut[] {
        const result = this.json.children
            .map(json => json.type === 'folder' ? 
                new JsonChildDirectory(this.provider, json) : new JsonShortcut(this.provider, json));

        return result;
    }
}

export class JsonRootDirectory extends ShortcutFolder {
    private readonly jsonpath : string;
    public readonly label : string;

    private data : JsonFileSchema;
    private childs : Shortcut[];

    constructor(provider : string, jsonpath : string, json : JsonFileSchema) {
        super(provider);
        
        const filename = jsonpath.split('/').pop();
        this.label = filename? filename : jsonpath;
        this.jsonpath = jsonpath;
        this.data = json;
        this.childs = [];

        this.update();
    }

    
    getChilds() : Shortcut[] {
        this.update();
        
        return this.childs;
    }

    update() {
        this.childs = [
            new JsonChildDirectory(this.provider, this.data.roots.bookmark_bar),
            new JsonChildDirectory(this.provider, this.data.roots.other),
            new JsonChildDirectory(this.provider, this.data.roots.synced),
        ]
    }

    public static create(provider : string, fullpath : string) : Shortcut | null {
        const json : JsonFileSchema = JSON.parse(fs.readFileSync(fullpath).toString());
        
        try {
            if(json.hasOwnProperty('roots')) {
                if(json.roots.hasOwnProperty('bookmark_bar')) {
                        return new JsonRootDirectory(provider, fullpath, json);
                }
            }
            
            return null;
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}