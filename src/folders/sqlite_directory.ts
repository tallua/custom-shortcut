
import * as vscode from 'vscode';
import * as sqlite3 from 'sqlite3';

import { Shortcut } from '../shortcut_provider';

interface QueryResult {
    id : number;
    type : number;
    parent : number;
    position : number;
    title : string;
    url : string;
}

export class SqlDirectory implements Shortcut {
    public readonly collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    public readonly label : string | undefined;

    private constructor(label : string) {
        console.debug('SqlDirectory : creating : ' + label);
        this.label = label;
    }

    isFolderType() : boolean {
        return true
    }

    getChilds() : Shortcut[] {
        return [];
    }

    public static createSqlRootDirectory(fullpath : string) : SqlDirectory | null {
        const filename = fullpath.split('/').pop();
        let result : SqlDirectory = new SqlDirectory(filename?filename:fullpath);

        let db = new sqlite3.Database(fullpath, sqlite3.OPEN_READONLY, (err) => {
            if(err) {
                console.error('failed openeing : ' + fullpath);
                console.error(err.message);
            } else {
                console.debug('sqllite connected : ' +  fullpath);
                this.get_names(db);
            }
        });

        return result;
    }

    static get_names(db : sqlite3.Database) {
        const query = 
            "SELECT t1.id, t1.type, t1.parent, t1.position, t1.title, t2.url" +
            " FROM 'moz_bookmarks' AS t1" +
            " LEFT JOIN 'moz_places' AS t2" +
            " ON t1.fk =t2.id";

        console.debug('SqlDirectory : querying...');
        db.all(query, (err, result) => {
            if(err) {
                console.error('failed get');
                console.error(err.message);
            } else {
                console.debug('sqllite get : ' + result);
                let tmp : QueryResult[] = result;
                console.log('sqllite get : ' + tmp.length);
                for(let i = 0; i < tmp.length; ++i) { 
                    console.log('sqllite get : ' + tmp[i].title);
                }
                db.close();
            }
        });
    }
}