export const getCookie = (name: string) => {
    const match = new RegExp('(^| )' + name + '=([^;]+)').exec(document.cookie);
    return match ? match[2] : undefined;
};
