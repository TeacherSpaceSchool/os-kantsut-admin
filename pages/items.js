import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getItems, getFilterItem } from '../src/gql/item'
import { getCategorys } from '../src/gql/category'
import pageListStyle from '../src/styleMUI/list'
import CardItem from '../components/CardItem'
import { urlMain } from '../redux/constants/other'
import Router from 'next/router'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardItemPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'

const Items = React.memo((props) => {
    const classes = pageListStyle();
    const { pinCode } = props.user;
    const { data } = props;
    let [list, setList] = useState(data.items);
    let [filters, setFilters] = useState(data.filterItem);
    let [categorys, setCategorys] = useState(data.categorys);
    const { search, filter } = props.app;
    let height = 202
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const initialRender = useRef(true);
    let [paginationWork, setPaginationWork] = useState(true);
    const getList = async()=> {
        setList((await getItems({search: search, skip: 0, ...filter?{category: filter}:{}})).items)
        forceCheck()
        setPaginationWork(true);
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                setFilters((await getFilterItem()).filterItem)
                setCategorys((await getCategorys({search: ''})).categorys)
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
    },[search, filter])
    useEffect(()=>{
        forceCheck()
    },[list])
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = (await getItems({search: search, skip: list.length, ...filter?{category: filter}:{}})).items
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                setPaginationWork(false)
        }
    }
    return (
        <App checkPagination={checkPagination} filters={filters} searchShow={true} pageName='Товары'>
            <Head>
                <title>Товары</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='Товары' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/items`} />
                <link rel='canonical' href={`${urlMain}/items`}/>
            </Head>
            <div className={classes.page}>
                {/*<CardItem categorys={categorys} list={list} setList={setList}/>*/}
                {list?list.map((element, idx)=> {
                        return(
                            <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardItemPlaceholder height={height}/>}>
                                <CardItem categorys={categorys} key={element._id} setList={setList} list={list} idx={idx} element={element}/>
                            </LazyLoad>
                        )}
                ):null}
            </div>
        </App>
    )
})

Items.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['admin', 'менеджер', 'снабженец'].includes(ctx.store.getState().user.profile.role)&&!ctx.store.getState().user.profile.addApplication)
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
            ...await getItems({search: '', skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getFilterItem(ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getCategorys({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user
    }
}

export default connect(mapStateToProps)(Items);