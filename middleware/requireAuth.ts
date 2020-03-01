import * as Koa from "koa";

export default async (ctx: Koa.Context, next: Koa.Next) => {
    if (!ctx.session || !ctx.session.username)
        ctx.redirect("/")
    else {
        await next();
    }
}