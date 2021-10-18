import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getStorageHistory } from '../../src/gql/storage'
import pageListStyle from '../../src/styleMUI/list'
import CardStorageHistory from '../../components/CardStorageHistory'
import { urlMain } from '../../redux/constants/other'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardStorageCardStorageHistoryPlaceholder from '../../components/CardPlaceholder'
import { getClientGqlSsr } from '../../src/getClientGQL'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { useRouter } from 'next/router'

const StorageHistory = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    const { pinCode } = props.user;
    let [list, setList] = useState(data.storageHistory);
    const { date } = props.app;
    let height = 113
    const initialRender = useRef(true);
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const router = useRouter()
    const getList = async()=> {
        setList((await getStorageHistory({item: router.query.id, skip: 0, date: date})).storageHistory)
        forceCheck()
        setPaginationWork(true);
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                await getList()
            }
        })()
    },[pinCode])
    useEffect(()=>{
        (async()=>{
            if(initialRender.current) {
                initialRender.current = false;
            } else {
                if(searchTimeOut)
                    clearTimeout(searchTimeOut)
                searchTimeOut = setTimeout(async()=>{
                    await getList()
                }, 500)
                setSearchTimeOut(searchTimeOut)
            }
        })()
    },[date])
    useEffect(()=>{
        forceCheck()
    },[list])
    let [paginationWork, setPaginationWork] = useState(true);
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = (await getStorageHistory({item: router.query.id, skip: list.length, date: date})).storageHistory
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                setPaginationWork(false)
        }
    }
    return (
        <App checkPagination={checkPagination} pageName='История склада' dates={true}>
            <Head>
                <title>История склада</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='История склада' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/storagehistory`} />
                <link rel='canonical' href={`${urlMain}/storagehistory`}/>
            </Head>
            <div className={classes.page}>
                {list?list.map((element)=> {
                    return(
                        <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardStorageCardStorageHistoryPlaceholder height={height}/>}>
                            <CardStorageHistory key={element._id} element={element}/>
                        </LazyLoad>
                    )}
                ):null}
            </div>
        </App>
    )
})

StorageHistory.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['admin', 'менеджер', 'снабженец', 'завсклада'].includes(ctx.store.getState().user.profile.role))
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
            ...await getStorageHistory({item: ctx.query.id, skip: 0, date: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(StorageHistory);