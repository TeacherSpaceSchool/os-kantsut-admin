import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import { getBalance1CHistory } from '../../src/gql/balance1CHistory'
import pageListStyle from '../../src/styleMUI/list'
import CardBalance1CHistory from '../../components/CardBalance1CHistory'
import { urlMain } from '../../redux/constants/other'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardPlaceholder from '../../components/CardPlaceholder'
import { getClientGqlSsr } from '../../src/getClientGQL'
import initialApp from '../../src/initialApp'
import Router from 'next/router'
import { useRouter } from 'next/router'

const Balance1CHistory = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    const { pinCode } = props.user;
    let [list, setList] = useState(data.balance1CHistory);
    const { date } = props.app;
    let height = 113
    const initialRender = useRef(true);
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const router = useRouter()
    const getList = async()=> {
        setList((await getBalance1CHistory({supplier: router.query.id, skip: 0, date: date})).balance1CHistory)
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
            let addedList = (await getBalance1CHistory({supplier: router.query.id, skip: list.length, date: date})).balance1CHistory
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                setPaginationWork(false)
        }
    }
    return (
        <App checkPagination={checkPagination} pageName='История баланса 1C' dates={true}>
            <Head>
                <title>История баланса 1C</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='История баланса 1C' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/balance1Chistory`} />
                <link rel='canonical' href={`${urlMain}/balance1Chistory`}/>
            </Head>
            <div className={classes.page}>
                {list?list.map((element)=> {
                    return(
                        <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardPlaceholder height={height}/>}>
                            <CardBalance1CHistory key={element._id} element={element}/>
                        </LazyLoad>
                    )}
                ):null}
            </div>
        </App>
    )
})

Balance1CHistory.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['admin', 'менеджер', 'снабженец'].includes(ctx.store.getState().user.profile.role))
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
            ...await getBalance1CHistory({supplier: ctx.query.id, skip: 0, date: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Balance1CHistory);