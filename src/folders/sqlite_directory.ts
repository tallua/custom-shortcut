
import * as vscode from 'vscode';
import * as sqlite3 from 'sqlite3';

import { SqliteSchema } from '../common/sqlite_schema';
import { Shortcut, ShortcutFolder } from '../shortcut_provider';
import { ShortcutFactory } from '../shortcut_factory';
import { SqliteShortcut } from '../shortcuts/sqlite_shortcut';

const updateInterval : number = 10000;

abstract class SqlDirectory extends ShortcutFolder {
    protected static readonly queryBase =
        "SELECT t1.id, t1.type, t1.parent, t1.position, t1.title, t2.url" +
        " FROM 'moz_bookmarks' AS t1" +
        " LEFT JOIN 'moz_places' AS t2" +
        " ON t1.fk = t2.id";

    public abstract readonly dataId : number;
    public abstract readonly label : string | undefined;
    public readonly dbpath : string;
    protected lastUpdate : number;
    private children : Shortcut[];

    constructor(provider : string, dbpath : string) {
        super(provider);
        this.dbpath = dbpath;
        this.children = [];
        
        this.lastUpdate = 0;
    }

    getChilds() : Shortcut[] {
        if(Date.now() - this.lastUpdate > updateInterval)
            this.update();
        return this.children;
    }

    setChilds(data : SqliteSchema[]) {
        this.children  = data.map(d => {
            switch(d.type) {
                case 2:
                    return new SqlChildDirectory(this.provider, this.dbpath, d);
                case 1:
                    return new SqliteShortcut(this.provider, d);
                default:
                    return null;
            }
        }).filter(ShortcutFactory.nullfilter);
    }
    
    update() {
        this.lastUpdate = Date.now();
        let db = new sqlite3.Database(this.dbpath, sqlite3.OPEN_READONLY);

        const child_query = SqlDirectory.queryBase +
            " WHERE t1.parent=" + this.dataId;
        db.all(child_query, (err, response) => {
            if(err) {
                console.error('SqlDirectory : failed openeing : ' + this.dbpath);
                console.error(err.message);
            } else {
                const data : SqliteSchema[] = response;
                console.debug('SqlDirectory : sqllite connected : ' +  this.dbpath);
                this.setChilds(data);
                this.lastUpdate = Date.now();
                vscode.commands.executeCommand('custom-shortcut.refresh', this.provider, this);
            }
        });

        db.close();
    }
}

class SqlChildDirectory extends SqlDirectory {
    public readonly dataId : number;
    public readonly label : string | undefined;

    constructor(provider : string, dbpath : string, data : SqliteSchema) {
        super(provider, dbpath);
        console.debug('SqlDirectory : creating : ' + data.title);
        this.dataId = data.id;
        this.label = data.title;
    }
}


export class SqlRootDirectory extends SqlDirectory {
    public readonly dataId : number = 1;
    public readonly label : string | undefined;

    constructor(provider : string, dbpath : string) {
        super(provider, dbpath);

        const filename = dbpath.split('/').pop();
        this.label = filename? filename : dbpath;

        console.debug('SqlRootDirectory : creating : ' + this.label);
    }

    update() {
        this.lastUpdate = Date.now();
        let db = new sqlite3.Database(this.dbpath, sqlite3.OPEN_READONLY);

        const toolbar_query ='';
        const child_query = SqlDirectory.queryBase +
            " WHERE t1.parent=" + this.dataId;
        db.all(child_query, (err, response) => {
            if(err) {
                console.error('SqlDirectory : failed openeing : ' + this.dbpath);
                console.error(err.message);
            } else {
                const data : SqliteSchema[] = response;
                console.debug('SqlDirectory : sqllite connected : ' +  this.dbpath);
                this.setChilds(data);
                this.lastUpdate = Date.now();
                vscode.commands.executeCommand('custom-shortcut.refresh', this.provider, this);
            }
        });

        db.close();
    }
}
