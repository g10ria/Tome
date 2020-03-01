import * as Koa from "koa";

export default async (ctx: Koa.Context, next: Koa.Next) => {
    if (ctx.session && ctx.session.user)
        ctx.redirect("/")
    else
        await next();
}