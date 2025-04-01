export class AuditLogs {
    id: number;
    actor: string;
    action: string;
    content_type: string;
    object_pk: string;
    object_id: number;
    object_repr: string;
    serialized_data: string;
    changes_text: string;
    changes: any;
    cid: any
    remote_addr: string;
    timestamp: string;
    additional_data: any;
}