
export interface JsonDirectoryScehma {
    children : JsonDirectoryScehma[];
    name : string;
    url : string;
    type : string;
};

export interface JsonFileSchema {
    roots : {
        bookmark_bar : JsonDirectoryScehma;
        other : JsonDirectoryScehma;
        synced : JsonDirectoryScehma;
    },
    sync_metadata : string
};