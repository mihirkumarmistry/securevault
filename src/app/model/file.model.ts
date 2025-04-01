export class UserFile {
    id: number;
    file_name: string;
    file_link: string;
    created_time: string;
    size: string;
    type: 'PDF' | 'SVG' | 'PNG' | 'JPEG' | 'PLAIN' | 'ZIP' | string;
    user: number;
    access?: number;
}

export class FileView {
    fileData?: any= null;
    type?: 'PDF' | 'SVG' | 'PNG' | 'JPEG' | 'PLAIN' | 'ZIP' | string = 'JPEG';
}

export class FileShare {
    id: number;
    users: FileShareUser[];
}

export class FileShareUser {
    user_id: number;
    access_id: number;
}

export enum AccessType {
    'View' = 1,
    'Download' = 2,
    'Delete' = 3
}