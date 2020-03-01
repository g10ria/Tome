"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = async (ctx, next) => {
    if (!ctx.session || !ctx.session.user)
        ctx.redirect("/");
    else {
        ctx.state.user = ctx.session.user;
        await next();
    }
};
//# sourceMappingURL=requireAuth.js.map