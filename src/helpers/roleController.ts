export function getMessageRole(role: string) {
    const roleMessage: { [key: string]: string } = {
        ban: 'Đã bị khóa',
        admin: 'Người quản trị',
        person: 'Người dùng',
    };
    return roleMessage[role];
}
