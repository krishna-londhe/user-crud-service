// Simple in-memory cache used to pass values (ids, created models, tokens, ...)
// between test steps within a run - mirrors reancare-service's TestCache pattern.

const cache: Record<string, any> = {};

export const setTestData = (value: any, key: string): void => {
    if (value !== undefined && value !== null) {
        cache[key] = value;
    } else {
        console.log(`Warning: attempted to cache an empty value for key '${key}'.`);
    }
};

export const getTestData = (key: string): any => {
    const value = cache[key];
    if (value === undefined) {
        console.log(`Warning: no cached test data found for key '${key}'.`);
        return null;
    }
    return value;
};
