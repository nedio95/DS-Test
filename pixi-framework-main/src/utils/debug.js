const log = (...messages) => {
    if (!import.meta.env.DEV)
        return;
    console.log("[DEBUG LOG]:", ...messages);
};
const warn = (...messages) => {
    if (!import.meta.env.DEV)
        return;
    console.warn("[DEBUG WARN]:", ...messages);
};
export const Debug = {
    log,
    warn,
};
//# sourceMappingURL=debug.js.map