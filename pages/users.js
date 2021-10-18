import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getUsers, getFilterUsers } from '../src/gql/user'
import { getRoles } from '../src/gql/role'
import pageListStyle from '../src/styleMUI/list'
import CardUser from '../components/CardUser'
import { urlMain } from '../redux/constants/other'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import CardUserPlaceholder from '../components/CardPlaceholder'
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Router from 'next/router'

const Users = React.memo((props) => {
    const classes = pageListStyle();
    const { data} = props;
    let [list, setList] = useState(data.users);
    let [filters, setFilters] = useState(data.filterUser);
    const { search, filter  } = props.app;
    const { profile, pinCode } = props.user;
    let height = 'admin'===profile.role?352:113
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const initialRender = useRef(true);
    let [paginationWork, setPaginationWork] = useState(true);
    let [roles, setRoles] = useState(['менеджер', 'специалист', 'бухгалтерия', 'кассир', 'завсклад', 'генеральный директор', 'финансовый директор', 'начальник отдела', ...data.roles?data.roles.map(element=>element.name):[]]);
    const getList = async()=> {
        setList((await getUsers({search: search, filter: filter, skip: 0})).users)
        forceCheck()
        setPaginationWork(true);
        (document.getElementsByClassName('App-body'))[0].scroll({top: 0, left: 0, behavior: 'instant' });
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                setFilters((await getFilterUsers()).filterUser)
                setRoles(['менеджер', 'специалист', 'бухгалтерия', 'кассир', 'завсклад', 'генеральный директор', 'финансовый директор', 'начальник отдела', ...(await getRoles({search: ''})).roles.map(element=>element.name)])
            }
        })()
    },[pinCode])
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                await getList()
            }
        })()
    },[filter, pinCode])
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
            let addedList = (await getUsers({search: search, filter: filter, skip: list.length})).users
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                setPaginationWork(false)
        }
    }
    return (
        <App checkPagination={checkPagination} searchShow={true} filters={filters} pageName='Пользователи'>
            <Head>
                <title>Пользователи</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='Пользователи' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/users`} />
                <link rel='canonical' href={`${urlMain}/users`}/>
            </Head>
            <div className={classes.page}>
                {
                    'admin'===profile.role?
                        <CardUser roles={roles} list={list} setList={setList}/>
                        :
                        null
                }
                {list?list.map((element, idx)=> {
                        return(
                            <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}  placeholder={<CardUserPlaceholder height={height}/>}>
                                <CardUser roles={roles} key={element._id} setList={setList} list={list} idx={idx} element={element}/>
                            </LazyLoad>
                        )}
                ):null}
            </div>
        </App>
    )
})

Users.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!ctx.store.getState().user.authenticated)
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    ctx.store.getState().app.filter = ''
    return {
        data: {
            ...await getUsers({search: '', filter: '', skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getFilterUsers(ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getRoles({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Users);