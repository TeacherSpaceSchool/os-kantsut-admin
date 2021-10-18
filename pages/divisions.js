import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getDivisions } from '../src/gql/division'
import { getSuppliers, getSpecialists, getHeads, getStaffs } from '../src/gql/user'
import pageListStyle from '../src/styleMUI/list'
import CardDivision from '../components/CardDivision'
import { urlMain } from '../redux/constants/other'
import Router from 'next/router'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardDivisionPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'

const Divisions = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.divisions);
    let [suppliers, setSuppliers] = useState(data.suppliers);
    let [heads, setHeads] = useState(data.heads);
    let [specialists, setSpecialists] = useState(data.specialists);
    let [staffs, setStaffs] = useState(data.staffs);
    const { search } = props.app;
    const { pinCode } = props.user;
    const height = 376
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const initialRender = useRef(true);
    let [paginationWork, setPaginationWork] = useState(true);
    const getList = async()=>{
        setList((await getDivisions({search: search, skip: 0})).divisions)
        forceCheck()
        setPaginationWork(true);
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                setSuppliers((await getSuppliers()).suppliers)
                setHeads((await getHeads()).heads)
                setSpecialists((await getSpecialists()).specialists)
                setStaffs((await getStaffs()).staffs)
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
    },[search])
    useEffect(()=>{
        forceCheck()
    },[list])
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = (await getDivisions({search: search, skip: list.length})).divisions
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                setPaginationWork(false)
        }
    }
    return (
        <App checkPagination={checkPagination} searchShow={true} pageName='Подразделения'>
            <Head>
                <title>Подразделения</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='Подразделения' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/divisions`} />
                <link rel='canonical' href={`${urlMain}/divisions`}/>
            </Head>
            <div className={classes.page}>
                <CardDivision heads={heads} suppliers={suppliers} staffs={staffs} specialists={specialists} list={list} setList={setList}/>
                {list?list.map((element, idx)=> {
                            if(element.suppliers)
                                element.suppliers = element.suppliers.map(supplier=>supplier._id?supplier._id:supplier)
                            else
                                element.suppliers = []
                            if(element.specialists)
                                element.specialists = element.specialists.map(specialist=>specialist._id?specialist._id:specialist)
                            else
                                element.specialists = []
                            if(element.staffs)
                                element.staffs = element.staffs.map(staff=>staff._id?staff._id:staff)
                            else
                                element.staffs = []
                            return (
                                <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height}
                                          offset={[height, 0]} debounce={0} once={true}
                                          placeholder={<CardDivisionPlaceholder height={height}/>}>
                                    <CardDivision heads={heads} suppliers={suppliers} staffs={staffs} specialists={specialists} key={element._id} setList={setList} list={list}
                                                  idx={idx} element={element}/>
                                </LazyLoad>
                            )
                    }
                ):null}
            </div>
        </App>
    )
})

Divisions.getInitialProps = async function(ctx) {
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
            ...await getDivisions({search: '', skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getSuppliers(ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getHeads(ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getSpecialists(ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getStaffs(ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Divisions);