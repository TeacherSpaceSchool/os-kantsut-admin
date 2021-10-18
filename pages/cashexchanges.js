import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import { getCashExchanges } from '../src/gql/cashExchange'
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

const CashExchanges = React.memo((props) => {
    const classes = pageListStyle();
    const { data } = props;
    const initialRender = useRef(true);
    let [list, setList] = useState(data.cashExchanges);
    const { search, date } = props.app;
    const { pinCode, profile } = props.user;
    const height = 50
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const getList = async()=> {
        setList((await getCashExchanges({search: search, date: date, skip: 0})).cashExchanges)
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
    },[pinCode, date])
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
            let addedList = (await getCashExchanges({search: search, date: date, skip: list.length})).cashExchanges
            if(addedList.length>0){
                setList([...list, ...addedList])
            }
            else
                setPaginationWork(false)
        }
    }
    return (
        <App setList={setList} list={list} checkPagination={checkPagination} dates={true} searchShow={true} pageName='Конвертация денежных средств'>
            <Head>
                <title>Конвертация денежных средств</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='Конвертация денежных средств' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/cashexchanges`} />
                <link rel='canonical' href={`${urlMain}/cashexchanges`}/>
            </Head>
            <center>
                <div>
                <div className={classes.tableRow} style={{width: 745}}>
                    <div className={classes.cell} style={{width: 50}}><div className={classes.nameTable}>Номер</div></div>
                    <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>Дата</div></div>
                    <div className={classes.cell} style={{width: 120}}><div className={classes.nameTable}>Снабженец</div></div>
                    <div className={classes.cell} style={{width: 100}}><div className={classes.nameTable}>Продажа</div></div>
                    <div className={classes.cell} style={{width: 100}}><div className={classes.nameTable}>Покупка</div></div>
                    <div className={classes.cell} style={{width: 150}}><div className={classes.nameTable}>Курс</div></div>
                    <div className={classes.cell} style={{width: 25}}><div className={classes.nameTable}>1C</div></div>
                </div>
                {list?list.map((element)=> {
                    return(
                        <LazyLoad scrollContainer={'.App-body'} key={element._id} height={height} offset={[height, 0]} debounce={0} once={true}>
                            <Link href='/cashexchange/[id]' as={`/cashexchange/${element._id}`}>
                                <div className={classes.tableRow} style={{width: 745, cursor: 'pointer', background: 'white'}}>
                                    <div className={classes.cell} style={{width: 50}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>
                                            {element.number}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{width: 60}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>
                                            {pdDDMMYY(element.createdAt)}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{width: 120}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>
                                            {element.supplier.name}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{width: 100}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>
                                            {`${element.exchangeFrom} ${element.currencyTypeFrom}`}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{width: 100}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>
                                            {`${element.exchangeTo} ${element.currencyTypeTo}`}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{width: 150}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>
                                            {`1 ${element.currencyTypeRate!==element.currencyTypeFrom?element.currencyTypeFrom:element.currencyTypeTo} = ${element.exchangeRate} ${element.currencyTypeRate}`}
                                        </div>
                                    </div>
                                    <div className={classes.cell} style={{width: 25, color: element.sync?'green':'red'}}>
                                        <div className={classes.value} style={{marginLeft: 0, marginBottom: 0}}>{element.sync?'да':'нет'}</div>
                                    </div>
                                </div>
                            </Link>
                        </LazyLoad>
                    )}
                ):null}
            </div>
            </center>
            {
                ['снабженец'].includes(profile.role) ?
                    <Link href='/cashexchange/[id]' as={`/cashexchange/new`}>
                        <Fab color='primary' aria-label='add' className={classes.fab}>
                            <AddIcon/>
                        </Fab>
                    </Link>
                    :
                    null
            }
        </App>
    )
})

CashExchanges.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['admin', 'менеджер', 'кассир', 'бухгалтерия', 'снабженец'].includes(ctx.store.getState().user.profile.role))
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
            ...await getCashExchanges({search: '', date: '', skip: 0}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    };
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

export default connect(mapStateToProps)(CashExchanges);