import Head from 'next/head';
import React, { useState, useEffect } from 'react';
import App from '../layouts/App';
import { connect } from 'react-redux'
import pageListStyle from '../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Router from 'next/router'
import {checkInt, urlMain} from '../redux/constants/other'
import initialApp from '../src/initialApp'
import Table from '../components/app/Table'
import { getStatisticSupplier } from '../src/gql/statistic'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux'
import * as appActions from '../redux/actions/app'
import { pdDatePicker } from '../src/lib'

const SupplierStatistic = React.memo((props) => {

    const classes = pageListStyle();
    const { isMobileApp } = props.app;
    const { pinCode } = props.user;
    let [date, setDate] = useState(pdDatePicker(new Date()));
    let [dateStart, setDateStart] = useState(pdDatePicker(undefined));
    let [dateEnd, setDateEnd] = useState(pdDatePicker(undefined));
    let [dateType, setDateType] = useState('day');
    let [statisticSupplier, setStatisticSupplier] = useState(undefined);
    let [showStat, setShowStat] = useState(false);
    const { showLoad } = props.appActions;
    useEffect(()=>{
        (async()=>{
            if(pinCode) {
                await showLoad(true)

                if (date) {
                    dateStart = new Date(date)
                    dateStart.setHours(3, 0, 0, 0)
                    if (dateType === 'year') {
                        dateStart.setMonth(0)
                        dateStart.setDate(1)
                        dateEnd = new Date(dateStart)
                        dateEnd.setFullYear(dateEnd.getFullYear() + 1)
                    }
                    else if (dateType === 'day') {
                        dateEnd = new Date(dateStart)
                        dateEnd.setDate(dateEnd.getDate() + 1)
                    }
                    else {
                        dateStart.setDate(1)
                        dateEnd = new Date(dateStart)
                        dateEnd.setMonth(dateEnd.getMonth() + 1)
                    }
                    setDateEnd(dateEnd)
                    setDateStart(dateStart)
                }

                setStatisticSupplier((await getStatisticSupplier({
                    dateStart: date ? date : null,
                    dateType: dateType,
                })).statisticSupplier)
                await showLoad(false)
            }
        })()
    },[date, dateType, pinCode])
    useEffect(()=>{
        if(process.browser&&pinCode){
            let appBody = document.getElementsByClassName('App-body')
            appBody[0].style.paddingBottom = '0px'
        }
    },[process.browser, pinCode])

    const filters = [{name: 'Все', value: false}, {name: 'Online', value: true}]
    return (
        <App pageName='Статистика снабженцев' filters={filters}>
            <Head>
                <title>Статистика снабженцев</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:title' content='Статистика снабженцев' />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/statisticsupplier`} />
                <link rel='canonical' href={`${urlMain}/statisticsupplier`}/>
            </Head>
            <Card className={classes.page}>
                <CardContent className={classes.column} style={isMobileApp?{}:{justifyContent: 'start', alignItems: 'flex-start'}}>
                    <div className={classes.row}>
                        <Button style={{width: 50, margin: 5}} variant='contained' onClick={()=>setDateType('day')} size='small' color={dateType==='day'?'primary':''}>
                            День
                        </Button>
                        <Button style={{width: 50, margin: 5}} variant='contained' onClick={()=>setDateType('month')} size='small' color={dateType==='month'?'primary':''}>
                            Месяц
                        </Button>
                        <Button style={{width: 50, margin: 5}} variant='contained' onClick={()=>setDateType('year')} size='small' color={dateType==='year'?'primary':''}>
                            Год
                        </Button>
                    </div>
                    <div className={classes.row}>
                        <TextField
                            className={classes.input}
                            label='Дата начала'
                            type='date'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={date}
                            inputProps={{
                                'aria-label': 'description',
                            }}
                            onChange={ event => setDate(event.target.value) }
                        />
                    </div>
                    {
                        statisticSupplier?
                            <Table dateStart={dateStart} dateEnd={dateEnd} type='client' row={(statisticSupplier.row).slice(1)} columns={statisticSupplier.columns}/>
                            :null
                    }
                </CardContent>
            </Card>
            <div className='count' onClick={()=>setShowStat(!showStat)}>
                {
                    statisticSupplier?
                        <>
                        {`Заявок: ${checkInt(statisticSupplier.row[0].data[0])+checkInt(statisticSupplier.row[0].data[1])+checkInt(statisticSupplier.row[0].data[2])}`}
                        {
                            showStat?
                                <>
                                <br/>
                                <br/>
                                {`Выполнено: ${statisticSupplier.row[0].data[0]} шт`}
                                <br/>
                                <br/>
                                {`В процессе: ${statisticSupplier.row[0].data[1]} шт`}
                                <br/>
                                <br/>
                                {`Отмена: ${statisticSupplier.row[0].data[2]} шт`}
                                </>
                                :
                                null
                        }
                        </>
                        :null
                }
            </div>
        </App>
    )
})

SupplierStatistic.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    ctx.store.getState().app.filter = false
    if(!['admin', 'менеджер', 'снабженец'].includes(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        } else
            Router.push('/')
    return {};
};

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {

        appActions: bindActionCreators(appActions, dispatch),

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SupplierStatistic);