import { getProfile } from '../redux/actions/user'
import { getJWT, checkMobile } from '../src/lib'
import uaParserJs from 'ua-parser-js';
import { getClientGqlSsr } from '../src/getClientGQL'

export default async (ctx)=>{
    console.log('initialApp1')
    if (ctx.req) {
        console.log('initialApp11')
        let ua = uaParserJs(ctx.req.headers['user-agent'])
        console.log('initialApp12')
        ctx.store.getState().app.isMobileApp = ['mobile', 'tablet'].includes(ua.device.type)||checkMobile(ua.ua)
        console.log('initialApp13')
        ctx.store.getState().user.authenticated = getJWT(ctx.req.headers.cookie)
        console.log('initialApp14')
        if (ctx.store.getState().user.authenticated) {
            console.log('initialApp1411')
            ctx.store.getState().user.profile = await getProfile(await getClientGqlSsr(ctx.req))
            console.log('initialApp1412')
        }
        else {
            console.log('initialApp1421')
            ctx.store.getState().user.profile = {}
            console.log('initialApp1422')
        }
    }
    console.log('initialApp2')
    ctx.store.getState().app.search = ''
    ctx.store.getState().app.sort = '-createdAt'
    ctx.store.getState().app.filter = ''
    ctx.store.getState().app.date = ''
    ctx.store.getState().app.load = false
    ctx.store.getState().app.drawer = false
    ctx.store.getState().mini_dialog.show = false
    ctx.store.getState().mini_dialog.showFull = false
}