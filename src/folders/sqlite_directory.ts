
import * as vscode from 'vscode';
import * as sqlite3 from 'sqlite3';

import { SqliteSchema } from '../common/sqlite_schema';
import { Shortcut, ShortcutFolder } from '../shortcut_provider';

export class SqlDirectory extends ShortcutFolder {
    public readonly label : string | undefined;
    private children : Shortcut[];

    private constructor(provider : string, label : string) {
        super(provider);
        console.debug('SqlDirectory : creating : ' + label);
        this.label = label;
        this.children = [];
    }

    getChilds() : Shortcut[] {
        return this.children;
    }

    setSqliteData(data : SqliteSchema[]) {

    }

    public static createSqlRootDirectory(provider : string, fullpath : string) : SqlDirectory | null {
        const filename = fullpath.split('/').pop();
        let result : SqlDirectory = new SqlDirectory(provider, filename?filename:fullpath);


        console.debug('SqlDirectory : connecting : ' + fullpath);

        let db = new sqlite3.Database(fullpath, sqlite3.OPEN_READONLY, (err) => {
            if(err) {
                console.error('SqlDirectory : failed openeing : ' + fullpath);
                console.error(err.message);
            } else {
                console.debug('SqlDirectory : sqllite connected : ' +  fullpath);
            }
        });

        const query = 
        "SELECT t1.id, t1.type, t1.parent, t1.position, t1.title, t2.url" +
        " FROM 'moz_bookmarks' AS t1" +
        " LEFT JOIN 'moz_places' AS t2" +
        " ON t1.fk =t2.id";

        console.debug('SqlDirectory : querying : ' + fullpath);
        db.all(query, (err, response) => {
            if(err) {
                console.error('SqlDirectory : query failed');
                console.error(err.message);
            } else {
                let tmp : SqliteSchema[] = response;
                console.debug('SqlDirectory : response count : ' + tmp.length);
            
                result.setSqliteData(tmp);
                vscode.commands.executeCommand('custom-shortcut.refresh', result.provider, result)
            }
        });

        db.close();

        return result;
    }
}