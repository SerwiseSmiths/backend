"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverQueryClient = void 0;
const query_core_1 = require("@tanstack/query-core");
exports.serverQueryClient = new query_core_1.QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 30 * 60 * 1000, // 30 minutes
            retry: 1,
            refetchOnReconnect: true,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
        },
    },
});
//# sourceMappingURL=serverQueryClient.js.map