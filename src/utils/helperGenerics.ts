export const getCookie = (name: string) => {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = new RegExp('(^| )' + escapedName + '=([^;]+)').exec(document.cookie);
    return match ? match[2] : undefined;
};
