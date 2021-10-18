import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getWaybills } from '../src/gql/waybill'
import pageListStyle from '../src/styleMUI/list'
import { urlMain } from '../redux/constants/other'
import Router from 'next/router'
import LazyLoad from 'react-lazyload';
import { forceCheck } from 'react-lazyload';
import { getClientGqlSsr } from '../src/getClientGQL'
import initialApp from '../src/initialApp'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Link from 'next/link';
import { pdDDMMYY } from '../src/lib'
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
    }
]
const sorts = [
    {
        name: 'Дата создания',
        field: 'createdAt'
    },
    {
        name: 'Дата закрытия',
        field: 'dateClose'
    },
]

const Waybills = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    const initialRender = useRef(true);
    let [list, setList] = useState(data.waybills);
    const { search, filter, sort, date } = props.app;
    const { profile, pinCode } = props.user;
    let height = 100
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const getList = async()=> {
        setList((await getWaybills({search: search, filter: filter, sort: sort, date: date, skip: 0})).waybills)
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
            let addedList = (await getWaybills({search: search, sort: sort, filter: filter, date: date, skip: list.length})).waybills
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                setPaginationWork(false)
        }
    }
    const statusColor = {
        'обработка': 'orange',
        'принят': 'green'
    }
    return (
        <App setList={setList} list={list} checkPagination={checkPagination} dates={true} filters={filters} sorts={sorts} searchShow={true} pageName='Накладные'>
            <Head>
                <title>Накладные</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='Накладные' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/waybills`} />
                <link rel='canonical' href={`${urlMain}/waybills`}/>
            </Head>
            <center>
            <div>
                <div className={classes.tableRow} style={{width: 800}}>
                    <div className={classes.cell} style={{width: 50}}><div className={classes.nameTable}>Номер</div></div>
                    <div className={classes.cell} style={{width: 80}}><div className={classes.nameTable}>Статус</div></div>
                    <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>Подача</div></div>
                    <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>Принят</div></div>
                    <div className={classes.cell} style={{width: 50}}><div className={classes.nameTable}>Заявка</div></div>
                    <div className={classes.cell} style={{width: 120}}><div className={classes.nameTable}>Снабженец</div></div>
                    <div className={classes.cell} style={{width: 120}}><div className={classes.nameTable}>Специалист</div></div>
                    <div className={classes.cell} style={{width: 100}}><div className={classes.nameTable}>Сумма</div></div>
                </div>
                {list?list.map((element)=> {
                    return(
                        <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}>
                            <Link href='/waybill/[id]' as={`/waybill/${element._id}`}>
                                <div className={classes.tableRow} style={{width: 800, cursor: 'pointer', background: 'white'}}>
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
                profile.role==='снабженец'?
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