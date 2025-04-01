export class UserResp {
    id?: number;
    email: string;
    mobile: string;
    role_id: number;
    firstname: string;
    lastname: string;
}

export class UserRoleReq {
    email: string;
    role_id: number;
}