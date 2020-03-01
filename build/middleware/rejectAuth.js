"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (ctx, next) => {
    if (ctx.session && ctx.session.user)
        ctx.redirect("/");
    else
        await next();
};
//# sourceMappingURL=rejectAuth.js.map