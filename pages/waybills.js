import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getWaybills } from '../src/gql/waybill'
import pageListStyle from '../src/styleMUI/list'
import CardWaybill from '../components/CardWaybill'
import { urlMain } from '../redux/constants/other'
import Router from 'next/router'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardWaybillPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Link from 'next/link';
import { pdDDMMYY } from '../src/lib'

const Waybills = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    const initialRender = useRef(true);
    let [list, setList] = useState(data.waybills);
    const { search, filter, sort, date } = props.app;
    const { profile } = props.user;
    let height = 100
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                if(searchTimeOut)
                    clearTimeout(searchTimeOut)
                searchTimeOut = setTimeout(async()=>{
                    setList((await getWaybills({search: search, filter: filter, sort: sort, date: date, skip: 0})).waybills)
                    forceCheck()
                    setPaginationWork(true);
                    (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
                }, 500)
                setSearchTimeOut(searchTimeOut)
            }
        })()
    },[filter, sort, search, date])
    useEffect(()=>{
        forceCheck()
    },[list])
    let [paginationWork, setPaginationWork] = useState(true);
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = (await getWaybills({search: search, sort: sort, filter: filter, date: date, skip: list.length})).waybills
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                setPaginationWork(false)
        }
    }
    const statusColor = {
        '??????????????????': 'orange',
        '????????????': 'green'
    }
    return (
        <App setList={setList} list={list} checkPagination={checkPagination} dates={true} filters={data.filterWaybill} sorts={data.sortWaybill} searchShow={true} pageName='??????????????????'>
            <Head>
                <title>??????????????????</title>
                <meta name='description' content='?????????????? ?????????????????????????? ?????? ?????????????? ???????????? ???????????? ???? ????????????????????????' />
                <meta property='og:title' content='??????????????????' />
                <meta property='og:description' content='?????????????? ?????????????????????????? ?????? ?????????????? ???????????? ???????????? ???? ????????????????????????' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/waybills`} />
                <link rel='canonical' href={`${urlMain}/waybills`}/>
            </Head>
            <center>
            <div>
                <div className={classes.tableRow} style={{width: 790}}>
                    <div className={classes.cell} style={{width: 50}}><div className={classes.nameTable}>??????????</div></div>
                    <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>????????????</div></div>
                    <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>????????????</div></div>
                    <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>????????????</div></div>
                    <div className={classes.cell} style={{width: 50}}><div className={classes.nameTable}>????????????</div></div>
                    <div className={classes.cell} style={{width: 120}}><div className={classes.nameTable}>??????????????????</div></div>
                    <div className={classes.cell} style={{width: 120}}><div className={classes.nameTable}>????????????????????</div></div>
                    <div className={classes.cell} style={{width: 100}}><div className={classes.nameTable}>??????????</div></div>
                </div>
                {list?list.map((element)=> {
                    return(
                        <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}>
                            <Link href='/waybill/[id]' as={`/waybill/${element._id}`}>
                                <div className={classes.tableRow} style={{width: 790, cursor: 'pointer', background: 'white'}}>
                                    <div className={classes.cell} style={{width: 50}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>
                                            {element.number}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{fontWeight: 'bold', color: statusColor[element.status], width: 70}}>
                                        {element.status}
                                    </div>
                                    <div className={classes.cell} style={{width: 60}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>
                                            {pdDDMMYY(element.createdAt)}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{width: 60}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>
                                            {element.acceptSpecialist?pdDDMMYY(element.acceptSpecialist):null}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{width: 50}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 5}}>{element.application.number}</div>
                                    </div>
                                    <div className={classes.cell} style={{width: 120}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 5}}>{element.supplier.name}</div>
                                    </div>
                                    <div className={classes.cell} style={{width: 120}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 5}}>{element.specialist.name}</div>
                                    </div>
                                    <div className={classes.cell} style={{width: 100}}>
                                        {
                                            element.amount.map((amount, idx) =>
                                                <div key={idx} className={classes.value} style={{marginLeft: 0, marginBottom: 5}}>{`${amount.value} ${amount.name}`}</div>
                                            )
                                        }
                                    </div>
                                </div>
                            </Link>
                        </LazyLoad>
                    )}
                ):null}
            </div>
            </center>
            {
                profile.role==='??????????????????'?
                    <Link href='/waybill/[id]' as={`/waybill/new`}>
                        <Fab color='primary' aria-label='add' className={classes.fab}>
                            <AddIcon />
                        </Fab>
                    </Link>
                    :
                    null

            }
        </App>
    )
})

Waybills.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['admin', '????????????????', '????????????????????', '??????????????????'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    ctx.store.getState().app.sort = '-createdAt'
    return {
        data: {
            ...await getWaybills({search: '', filter: '', sort: '-createdAt', date: '', skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Waybills);