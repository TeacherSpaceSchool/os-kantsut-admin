import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getMemorandums } from '../src/gql/memorandum'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../redux/constants/other'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { pdDDMMYY, differenceDates } from '../src/lib'
import Router from 'next/router'
const filters = [
    {
        name: 'Все',
        value: ''
    },
    {
        name: 'Обработка',
        value: 'обработка'
    },
    {
        name: 'Принят',
        value: 'принят'
    },
    {
        name: 'Выполнен',
        value: 'выполнен'
    },
    {
        name: 'Проверен',
        value: 'проверен'
    },
    {
        name: 'Отмена',
        value: 'отмена'
    }
]
const sorts = [
    {
        name: 'Дата создания',
        field: 'createdAt'
    },
    {
        name: 'Срок',
        field: 'term'
    }
]

const Memorandums = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    const initialRender = useRef(true);
    let [list, setList] = useState(data.memorandums);
    const { search, filter, sort, date } = props.app;
    const { pinCode, profile } = props.user;
    let height = 50
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const router = useRouter()
    const getList = async()=>{
        setList((await getMemorandums({search: search, filter: filter, sort: sort, skip: 0, ...router.query.supplier&&router.query.dateStart&&router.query.dateEnd?{supplier: router.query.supplier, date: router.query.dateStart, dateEnd: router.query.dateEnd}:{date: date}})).memorandums)
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
    },[filter, sort, pinCode, date])
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
    let [paginationWork, setPaginationWork] = useState(true);
    const checkPagination = async()=>{
        if(paginationWork){
            let addedList = (await getMemorandums({search: search, sort: sort, filter: filter, date: date, skip: list.length})).memorandums
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                setPaginationWork(false)
        }
    }
    const statusColor = {
        'обработка': 'orange',
        'принят': 'blue',
        'выполнен': 'green',
        'отмена': 'red'
    }
    return (
        <App setList={setList} list={list} checkPagination={checkPagination} dates={!router.query.supplier&&!router.query.dateStart&&!router.query.dateEnd} filters={filters} sorts={sorts} searchShow={true} pageName='Служебные записки'>
            <Head>
                <title>Служебные записки</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='Служебные записки' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/memorandums`} />
                <link rel='canonical' href={`${urlMain}/memorandums`}/>
            </Head>
            <center>
            <div style={{zoom: 0.9}}>
                <div className={classes.tableRow} style={{width: 1190}}>
                    <div className={classes.cell} style={{width: 50}}><div className={classes.nameTable}>Номер</div></div>
                    <div className={classes.cell} style={{width: 80}}><div className={classes.nameTable}>Статус</div></div>
                    <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>Подача</div></div>
                    <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>Срок</div></div>
                    <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>Закрыт</div></div>
                    <div className={classes.cell} style={{width: 120}}><div className={classes.nameTable}>Отправитель</div></div>
                    <div className={classes.cell} style={{width: 120}}><div className={classes.nameTable}>Получатель</div></div>
                    <div className={classes.cell} style={{width: 500}}><div className={classes.nameTable}>Роли</div></div>
                </div>
                {list?list.map((element)=> {
                    const difference = differenceDates(new Date(element.term), new Date())
                    const usersName = {}
                    for(let i=0; i<element.notifiables.length; i++){
                        usersName[element.notifiables[i]._id] = element.notifiables[i].name
                    }
                    usersName[element.whom._id] = element.whom.name
                    return(
                        <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}>
                            <Link href='/memorandum/[id]' as={`/memorandum/${element._id}`}>
                                <div className={classes.tableRow} style={{width: 1190, cursor: 'pointer', background: 'white'}}>
                                    <div className={classes.cell} style={{width: 50}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>
                                            {element.number}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{fontWeight: 'bold', color: statusColor[element.status], width: 80}}>
                                        {element.status}
                                    </div>
                                    <div className={classes.cell} style={{width: 60}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>
                                            {pdDDMMYY(element.createdAt)}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{width: 60}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0, color: element.status==='выполнен'?'black':difference<0?'red':difference<1?'orange':'green'}}>
                                            {element.term?pdDDMMYY(element.term):null}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{width: 60}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>
                                            {element.dateClose?pdDDMMYY(element.createdAt):null}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{width: 120}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 5}}>{element.who.name}</div>
                                    </div>
                                    <div className={classes.cell} style={{width: 120}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 5}}>{element.whom.name}</div>
                                    </div>
                                    <div className={classes.cell} style={{width: 500}}>
                                        <div className={classes.row}>
                                            {
                                                element.routes.map((route, idx) =>
                                                    <div key={`${element._id}${idx}`} className={classes.value} style={{color: route.cancel?'red':route.confirmation?'green':'white'}}>
                                                        {usersName[route.user._id]}<br/>
                                                        {route.cancel?pdDDMMYY(route.cancel):route.confirmation?pdDDMMYY(route.confirmation):null}
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </LazyLoad>
                    )}
                ):null}
            </div>
            </center>
            <Link href='/memorandum/[id]' as={`/memorandum/new`}>
                <Fab color='primary' aria-label='add' className={classes.fab}>
                    <AddIcon />
                </Fab>
            </Link>
        </App>
    )
})

Memorandums.getInitialProps = async function(ctx) {
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
    ctx.store.getState().app.sort = '-createdAt'
    return {
        data: {
            ...await getMemorandums({ search: '', filter: '', sort: '-createdAt', skip: 0, date: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(Memorandums);