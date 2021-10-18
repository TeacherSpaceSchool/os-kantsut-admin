import Head from 'next/head';
import React, { useRef, useEffect, useState } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getSetting, clearStorage } from '../src/gql/setting'
import pageListStyle from '../src/styleMUI/list'
import CardSetting from '../components/CardSetting'
import { urlMain } from '../redux/constants/other'
import Router from 'next/router'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Fab from '@material-ui/core/Fab';
import ClearIcon from '@material-ui/icons/Clear';
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as appActions from '../redux/actions/app'
import { bindActionCreators } from 'redux'
import Confirmation from '../components/dialog/Confirmation'

const Setting = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    const initialRender = useRef(true);
    const { pinCode } = props.user;
    const { showLoad } = props.appActions;
    let [setting, setSetting] = useState(data.setting);
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                setSetting((await getSetting()).setting)
            }
        })()
    },[pinCode])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) initialRender.current = false;
        })()
    },[])
    return (
        <App pageName='Настройки'>
            <Head>
                <title>Настройки</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='Настройки' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/setting`} />
                <link rel='canonical' href={`${urlMain}/setting`}/>
            </Head>
            <div className={classes.page}>
                {
                    setting?
                        <CardSetting element={setting}/>
                        :
                        null
                }
                <Fab color='primary' aria-label='add' className={classes.fab} onClick={()=>{
                    const action = async() => {
                        await showLoad(true)
                        await clearStorage()
                        await showLoad(false)
                    }
                    setMiniDialog('Очистить базу?', <Confirmation action={action}/>)
                    showMiniDialog(true)
                }}>
                    <ClearIcon />
                </Fab>
            </div>
        </App>
    )
})

Setting.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['admin', 'менеджер'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    return {
        data: {
            ...await getSetting(ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Setting);