
import * as vscode from 'vscode';
import { Shortcut } from '../shortcut_provider';

import * as fs from 'fs';

enum LnkFlags {
    TARG = 0,
    LINK,
    //NAME,
    //PATH,
    //WORK,
    //ARGS,
    //ICON,
    UNICODE,
    FLAG_LENGTH
}

export class LNKShortcut implements Shortcut {
    private readonly LNK_HEADER_LEN = 76;
    public readonly collapsibleState = vscode.TreeItemCollapsibleState.None;
    public readonly label : string | undefined;
    public readonly path : string;
    public readonly command : vscode.Command;

    constructor(public readonly fullpath : string) {
        console.debug('LNKShortcut : creating : ' + fullpath);
        this.label = fullpath.split('/').pop();
        this.path = fullpath;

        const url = this.getUrl();
        this.command = {
            command: 'custom-shortcut.open-link',
            title: '',
            arguments: [url]
        };
    }

    isFolderType() : boolean {
        return false;
    }

    getChilds() : Shortcut[] {
        return [];
    }


    getUrl() : string {
        const buffer = fs.readFileSync(this.path);
        if(buffer.length < 4) {
            vscode.window.showErrorMessage('invalid file : ' + this.fullpath);
            console.error('file length under 4 : ' + this.fullpath);
            return '';
        }
        
        // parse header
        let head = 0;
        const header_len = buffer.readInt32LE();
        if(header_len !== this.LNK_HEADER_LEN) {
            vscode.window.showErrorMessage('invalid file : ' + this.fullpath);
            console.error('header length not ' + this.LNK_HEADER_LEN + ' : ' + this.fullpath);
            return '';
        }
        const flags = this.parseFlag(buffer, head);
        head += header_len;

        // parse target info
        if(flags[LnkFlags.TARG]) {
            const targ_len = buffer.readInt16LE(head);
            head += targ_len + 2;
        }

        // parse link info
        if(flags[LnkFlags.LINK]) {
            const link_len = buffer.readInt32LE(head);
            const link_buff = buffer.subarray(head + 4, head + link_len);
            head += link_len;

            const result = this.getUriFromLinkInfo(link_buff);
            console.log('lnk : ' + this.fullpath + ' is link to : ' + result);
            return result;
        } else {
            vscode.window.showErrorMessage('invalid file : ' + this.fullpath);
            console.error('file doesn\'t have link info : ' + this.fullpath);
            return '';
        }
    }

    getUriFromLinkInfo(link_buffer : Buffer) : string {
        const header_len = link_buffer.readInt32LE(0);
        const flag_int = link_buffer.readInt32LE(4);

        const is_local = Boolean(flag_int & 0x00000001);
        const is_network = Boolean(flag_int & 0x00000002);

        const offset_common = link_buffer.readInt32LE(20);

        let result = '';
        if(is_local) {
            const offset_volume = link_buffer.readInt32LE(8);

            const offset_local = link_buffer.readInt32LE(12);
            const local_end = link_buffer.findIndex((v, i, arr) => {
                return i > offset_local && arr[i] === 0;
            });
            let local_str = link_buffer.subarray(offset_local - 4, local_end).toString('utf8');

            if(header_len > 28) {
                const offset_local_uni = link_buffer.readInt32LE(24);
                const local_uni_end = link_buffer.findIndex((v, i, arr) => {
                    return i > offset_local_uni && arr[i - 1] === 0 && arr[i] === 0;
                });
                local_str = link_buffer.subarray(offset_local_uni - 4, local_uni_end).toString('utf16le');
            }

            //let common_str = link_buffer.subarray(offset_common - 4).toString('utf8');
            //if(header_len > 32) {
            //    const offset_common_uni = link_buffer.readInt32LE(28);
            //    common_str = link_buffer.subarray(offset_common_uni - 4).toString('utf16le');
            //}

            result = local_str;
        } else if(is_network) {
            const offset_netinfo = link_buffer.readInt32LE(16);
            vscode.window.showErrorMessage('not supported network .lnk : ' + this.fullpath);
            console.error('file is not local link : ' + this.fullpath);
        }

        return result;
    }

    parseFlag(header : Buffer, head : number) : Array<boolean> {
        let flags = new Array<boolean>(LnkFlags.FLAG_LENGTH);

        const flag_int = header.readInt32LE(head + 20);
        console.debug('lnk flag of : ' + this.path + " : " + flag_int);

        flags[LnkFlags.TARG] = Boolean(flag_int & 0x00000001);
        flags[LnkFlags.LINK] = Boolean(flag_int & 0x00000002);
        //flags[LnkFlags.NAME] = Boolean(flag_int & 0x00000004);
        //flags[LnkFlags.PATH] = Boolean(flag_int & 0x00000008);
        //flags[LnkFlags.WORK] = Boolean(flag_int & 0x00000010);
        //flags[LnkFlags.ARGS] = Boolean(flag_int & 0x00000020);
        //flags[LnkFlags.ICON] = Boolean(flag_int & 0x00000040);
        flags[LnkFlags.UNICODE] = Boolean(flag_int & 0x00000080);

        return flags;
    }
}
