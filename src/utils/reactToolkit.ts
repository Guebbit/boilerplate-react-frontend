/**
 * Adapter placeholder for @guebbit/react-toolkit.
 *
 * The original Vue boilerplate used @guebbit/vue-toolkit helpers deeply.
 * This React migration keeps an adapter layer so toolkit utilities can be
 * connected incrementally without coupling app code to package internals.
 */
export const reactToolkitAdapter = {
    notifySuccess: (message: string) => message,
    notifyError: (message: string) => message
};
