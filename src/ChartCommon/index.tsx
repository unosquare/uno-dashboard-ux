const colors = ['blue', 'slate', 'gray', 'zinc', 'yellow', 'stone', 'red', 'orange', 'amber'];

export const getMap = (keys: string[]) => {
    const map = new Map<string, string>();
    keys.forEach((key, index) => {
        map.set(key, colors[index]);
    });
    return map;
};
