import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import applicationStyle from '../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import { getItemsFromApplications } from '../src/gql/application'
import { urlMain } from '../redux/constants/other'
import * as snackbarActions from '../redux/actions/snackbar'
import Router from 'next/router'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import * as appActions from '../redux/actions/app'
import Link from 'next/link';

const ItemsFromApplications = React.memo((props) => {
    const classes = applicationStyle();
    const { data } = props;
    const { isMobileApp } = props.app;
    let [zoom1, setZoom1] = useState(1);
    let [itemsFromApplications, setItemsFromApplications] = useState(data.itemsFromApplications);
    const { pinCode } = props.user;
    const initialRender = useRef(true);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                setItemsFromApplications((await getItemsFromApplications()).itemsFromApplications)
            }
        })()
    },[pinCode])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            }
        })()
    },[])
    return (
        <App pageName='Лист закупки'>
            <Head>
                <title>Лист закупки</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение'/>
                <meta property='og:title' content='Лист закупки' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/itemsfromapplications`} />
                <link rel='canonical' href={`${urlMain}/itemsfromapplications`}/>
            </Head>
            <Card>
                <CardContent className={classes.page}>
                    <div className={classes.tableName}>
                        <div className={classes.nameField}>
                            Товары&nbsp;({itemsFromApplications.length}):&nbsp;
                        </div>
                        {
                            isMobileApp?
                                <>
                                <div onClick={()=>{if(zoom1>0.1){setZoom1(zoom1-=0.1)}}} className={classes.zoomBtn}>-</div>
                                <div onClick={()=>{if(zoom1<1){setZoom1(zoom1+=0.1)}}} className={classes.zoomBtn}>+</div>
                                </>
                                :
                                null
                        }
                    </div>
                    <div className={classes.table} style={{zoom: zoom1}}>
                        <div className={classes.tableRow} style={{width: '100%'}}>
                            <div className={classes.cell} style={{width: 20}}>
                                <div className={classes.nameTable}>№</div>
                            </div>
                            <div className={classes.cell} style={{width: 80}}>
                                <div className={classes.nameTable}>Накладная</div>
                            </div>
                            <div className={classes.cell} style={{width: `calc((100vw - 212px${isMobileApp?'':' - 300'}) / 2)`}}>
                                <div className={classes.nameTable}>Товар</div>
                            </div>
                            <div className={classes.cell} style={{width: `calc((100vw - 212px${isMobileApp?'':' - 300'}) / 2)`}}>
                                <div className={classes.nameTable}>Количество</div>
                            </div>
                        </div>
                        {itemsFromApplications.map((row, idx) =>
                            <div className={classes.tableRow} key={idx}
                                 style={{width: '100%'}}>
                                <div className={classes.cell} style={{width: 20}}>
                                    <div className={classes.nameTable}>
                                        {idx + 1}
                                    </div>
                                </div>
                                <div className={classes.cell} style={{width: 80}}>
                                    <Link key={itemsFromApplications[0]} href='/application/[id]' as={`/application/${row[0]}`}>
                                        <a>
                                            <b>
                                                {row[1]}
                                            </b>
                                        </a>
                                    </Link>
                                </div>
                                <div className={classes.cell} style={{width: `calc((100vw - 212px${isMobileApp?'':' - 300'}) / 2)`}}>
                                    {row[2]}
                                </div>
                                <div className={classes.cell} style={{width: `calc((100vw - 212px${isMobileApp?'':' - 300'}) / 2)`}}>
                                    {row[3]}
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </App>
    )
})

ItemsFromApplications.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if('снабженец'!==ctx.store.getState().user.profile.role)
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
            ...await getItemsFromApplications(ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemsFromApplications);