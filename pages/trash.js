import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import pageListStyle from '../src/styleMUI/list'
import {getUsersTrash} from '../src/gql/user'
import {getCategorysTrash} from '../src/gql/category'
import {getDivisionsTrash} from '../src/gql/division'
import { connect } from 'react-redux'
import Router from 'next/router'
import { urlMain } from '../redux/constants/other'
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import CardPlaceholder from '../components/CardPlaceholder'
import CardUser from '../components/CardUser'
import CardCategory from '../components/CardCategory'
import CardDivision from '../components/CardDivision'
import LazyLoad from 'react-lazyload';
const height = 100;


const Trash = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    let [list, setList] = useState(data.usersTrash);
    const initialRender = useRef(true);
    const { pinCode } = props.user;
    let [type, setType] = useState('Пользователи');
    let [paginationWork, setPaginationWork] = useState(true);
    const { search, filter } = props.app;
    let [pagination, setPagination] = useState(100);
    const checkPagination = async()=>{
        if(paginationWork){
            setPagination(pagination+100)
        }
    }
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const getList = async()=> {
        if (filter === 'Категории') list = (await getCategorysTrash({search: search})).categorysTrash
        else if (filter === 'Подразделение') list = (await getDivisionsTrash({search: search})).divisionsTrash
        else if (filter === 'Пользователи') list = (await getUsersTrash({search: search})).usersTrash
        setList(list)
        setType(filter)
        forceCheck()
        setPaginationWork(true);
        setPagination(100);
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant'});
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
                if (searchTimeOut)
                    clearTimeout(searchTimeOut)
                searchTimeOut = setTimeout(async () => {
                    await getList()
                }, 500)
                setSearchTimeOut(searchTimeOut)
            }
        })()
    },[filter, search])
    const filters = [
        {name: 'Категории', value: 'Категории'},
        {name: 'Подразделение', value: 'Подразделение'},
        {name: 'Пользователи', value: 'Пользователи'}
        ]
    return (
        <App checkPagination={checkPagination} searchShow={true} filters={filters} pageName='Корзина'>
            <Head>
                <title>Корзина</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='Корзина' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/trash`} />
                <link rel='canonical' href={`${urlMain}/trash`}/>
            </Head>
            <div className={classes.page}>
                {list?list.map((element, idx)=> {
                    return(
                        <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]}
                                  debounce={0} once={true} placeholder={<CardPlaceholder/>}>
                            {
                                type===filter?
                                    type==='Категории'?
                                        <CardCategory list={list} idx={idx} key={element._id} setList={setList} element={element}/>
                                        :
                                    type==='Подразделение'?
                                        <CardDivision list={list} idx={idx} key={element._id} setList={setList} element={element}/>
                                        :
                                    type==='Пользователи'?
                                        <CardUser list={list} idx={idx} key={element._id} setList={setList} element={element}/>
                                        :
                                        null
                                :
                                    null
                            }
                        </LazyLoad>
                    )}
                ):null}
            </div>
        </App>
    )
})

Trash.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    ctx.store.getState().app.filter = 'Пользователи'
    if(!['admin', 'менеджер'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {
        data: {
            ...(await getUsersTrash({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined)),
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Trash);