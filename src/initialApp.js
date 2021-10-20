import { getProfile } from '../redux/actions/user'
import { getJWT, checkMobile } from '../src/lib'
import uaParserJs from 'ua-parser-js';
import { getClientGqlSsr } from '../src/getClientGQL'

export default async (ctx)=>{
    if (ctx.req) {
        let ua = uaParserJs(ctx.req.headers['user-agent'])
        ctx.store.getState().app.isMobileApp = ['mobile', 'tablet'].includes(ua.device.type)||checkMobile(ua.ua)
        ctx.store.getState().user.authenticated = getJWT(ctx.req.headers.cookie)
        if (ctx.store.getState().user.authenticated) {
            ctx.store.getState().user.profile = await getProfile(await getClientGqlSsr(ctx.req))
        }
        else {
            ctx.store.getState().user.profile = {}
        }
    }
    ctx.store.getState().app.search = ''
    ctx.store.getState().app.sort = '-createdAt'
    ctx.store.getState().app.filter = ''
    ctx.store.getState().app.date = ''
    ctx.store.getState().app.load = false
    ctx.store.getState().app.drawer = false
    ctx.store.getState().mini_dialog.show = false
    ctx.store.getState().mini_dialog.showFull = false
}