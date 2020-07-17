
export interface JsonDirectoryScehma {
    children : JsonDirectoryScehma[];
    name : string;
    url : string;
    type : string;
};

export interface JsonFileSchema {
    roots : {
        bookmark_bar : JsonDirectoryScehma;
        others : object;
        synced : object;
    },
    sync_metadata : string
};