export class Dashboard {
    file: number;
    total_size: string;
    bin: number;
    shared_count: number;
    files: FileCount[];
    recent_logs: RecentLogs[];
}

export class FileCount {
    type: string;
    count: number;
}

export class RecentLogs {
    message: string;
    action: string;
    file_name: string;
    file_link: string;
    type: string;
    size: string;
    user: string;
    created_time: string;
}