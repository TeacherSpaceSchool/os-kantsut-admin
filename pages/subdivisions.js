import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getSubdivisions, getFilterSubdivisions } from '../src/gql/subdivision'
import pageListStyle from '../src/styleMUI/list'
import CardSubdivision from '../components/CardSubdivision'
import { urlMain } from '../redux/constants/other'
import Router from 'next/router'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardSubdivisionPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import { getDivisions } from '../src/gql/division'

const Subdivisions = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    const { pinCode } = props.user;
    let [list, setList] = useState(data.subdivisions);
    let [divisions, setDivisions] = useState(data.divisions);
    let [filterSubdivision, setFilterSubdivision] = useState(data.filterSubdivision);
    const { search, filter } = props.app;
    let height = 202
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const initialRender = useRef(true);
    let [paginationWork, setPaginationWork] = useState(true);
    const getList = async()=>{
        setList((await getSubdivisions({search: search, skip: 0, ...filter?{division: filter}:{}})).subdivisions)
        forceCheck()
        setPaginationWork(true);
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                setDivisions((await getDivisions({search: ''})).divisions)
                setFilterSubdivision((await getFilterSubdivisions()).filterSubdivision)
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
            let addedList = (await getSubdivisions({search: search, skip: list.length, ...filter?{category: filter}:{}})).subdivisions
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                setPaginationWork(false)
        }
    }
    return (
        <App checkPagination={checkPagination} filters={filterSubdivision} searchShow={true} pageName='Под-подразделения'>
            <Head>
                <title>Под-подразделения</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='Под-подразделения' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/subdivisions`} />
                <link rel='canonical' href={`${urlMain}/subdivisions`}/>
            </Head>
            <div className={classes.page}>
                <CardSubdivision divisions={divisions} list={list} setList={setList}/>
                {list?list.map((element, idx)=> {
                        return(
                            <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardSubdivisionPlaceholder height={height}/>}>
                                <CardSubdivision divisions={divisions} key={element._id} setList={setList} list={list} idx={idx} element={element}/>
                            </LazyLoad>
                        )}
                ):null}
            </div>
        </App>
    )
})

Subdivisions.getInitialProps = async function(ctx) {
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
            ...await getSubdivisions({search: '', skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getFilterSubdivisions(ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getDivisions({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Subdivisions);