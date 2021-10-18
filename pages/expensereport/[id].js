import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import expenseReportStyle from '../../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import { addExpenseReport, setExpenseReport, getExpenseReport, getUnloadingExpenseReport, deleteExpenseReport } from '../../src/gql/expenseReport'
import { getApplicationsForWaybill } from '../../src/gql/application'
import { getWaybillsForExpenseReport } from '../../src/gql/waybill'
import { getCashExchangeForExpenseReport } from '../../src/gql/cashExchange'
import { getCashConsumablesForExpenseReport } from '../../src/gql/cashConsumable'
import { getMyBalance } from '../../src/gql/balance'
import { urlMain } from '../../redux/constants/other'
import Confirmation from '../../components/dialog/Confirmation'
import { useRouter } from 'next/router'
import * as snackbarActions from '../../redux/actions/snackbar'
import Router from 'next/router'
import { getClientGqlSsr } from '../../src/getClientGQL'
import { pdDDMMYYHHMM, checkFloat, currencys, inputFloat } from '../../src/lib'
import initialApp from '../../src/initialApp'
import Link from 'next/link';
import * as appActions from '../../redux/actions/app'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { getUnits } from '../../src/gql/unit'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getItems } from '../../src/gql/item'
import CircularProgress from '@material-ui/core/CircularProgress';

const ExpenseReport = React.memo((props) => {
    const { profile, pinCode } = props.user;
    const classes = expenseReportStyle();
    const { data } = props;
    const router = useRouter()
    const { isMobileApp } = props.app;
    const { showLoad, setShowAppBar, setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const initialRender = useRef(true);
    let [balance, setBalance] = useState(data.balance);
    let [_expenseReport, _setExpenseReport] = useState(data.expenseReport);
    let [applications, setApplications] = useState(_expenseReport?_expenseReport.applications:[]);
    let [cashConsumables, setCashConsumables] = useState(_expenseReport?_expenseReport.cashConsumables:[]);
    let [cashExchanges, setCashExchanges] = useState(_expenseReport?_expenseReport.cashExchanges:[]);
    let [waybills, setWaybills] = useState(_expenseReport?_expenseReport.waybills:[]);
    let [units, setUnits] = useState(data.units?data.units:[]);
    let [items, setItems] = useState(waybills.reduce((accumulator, currentValue)=>[...accumulator, ...currentValue.items.map(item=>{return {_id: currentValue._id, number: currentValue.number, createdAt: currentValue.createdAt, ...item}})], []))
    const [inputValue, setInputValue] = React.useState('');
    let [searchTimeOut, setSearchTimeOut] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        (async()=>{
            if (inputValue.length<3) {
                setItemsName([]);
                if(open)
                    setOpen(false)
                if(loading)
                    setLoading(false)
            }
            else {
                if(!loading)
                    setLoading(true)
                if(searchTimeOut)
                    clearTimeout(searchTimeOut)
                searchTimeOut = setTimeout(async()=>{
                    setItemsName((await getItems({search: inputValue})).items)
                    if(!open)
                        setOpen(true)
                    setLoading(false)
                }, 500)
                setSearchTimeOut(searchTimeOut)
            }
        })()
    }, [inputValue]);
    const handleChange = event => {
        setInputValue(event.target.value);
    };
    let [itemsName, setItemsName] = useState([]);
    
    let [balanceStart, setBalanceStart] = useState(_expenseReport&&_expenseReport.balanceStart?_expenseReport.balanceStart:[]);
    let [expense, setExpense] = useState(_expenseReport&&_expenseReport.expense?_expenseReport.expense:[]);
    let [receivedAmount, setReceivedAmount] = useState(_expenseReport?_expenseReport.receivedAmount:[]);
    let [addedItems, setAddedItems] = useState(_expenseReport&&_expenseReport.addedItems?_expenseReport.addedItems:[]);
    let [overExpense, setOverExpense] = useState(_expenseReport&&_expenseReport.overExpense?_expenseReport.overExpense:[]);
    let [balanceEnd, setBalanceEnd] = useState(_expenseReport&&_expenseReport.balanceEnd?_expenseReport.balanceEnd:[]);
    let [outCashbox, setOutCashbox] = useState(_expenseReport?_expenseReport.outCashbox?_expenseReport.outCashbox:_expenseReport.balanceStart.map(balance=>{return {name: balance.name, value: 0}}):[]);
    let [acceptHead, setAcceptHead] = useState(_expenseReport?_expenseReport.acceptHead:undefined);
    let [zoom1, setZoom1] = useState(1);
    let [showTable1, setShowTable1] = useState(true);
    let [zoom2, setZoom2] = useState(1);
    let [showTable2, setShowTable2] = useState(true);
    let [zoom3, setZoom3] = useState(1);
    let [showTable3, setShowTable3] = useState(true);
    useEffect(()=>{
        if(process.browser) {
            if (!initialRender.current&&_expenseReport&&!_expenseReport.status) {
                let balanceEnd1 = {}, balanceEnd2 = {}, balanceEnd = []
                for (let i = 0; i < balance.length; i++) {
                    balanceEnd1[balance[i].name] = balance[i].value
                }
                for (let i = 0; i < _expenseReport.waybills.length; i++) {
                    for (let i1 = 0; i1 < _expenseReport.waybills[i].amount.length; i1++) {
                        if (balanceEnd1[_expenseReport.waybills[i].amount[i1].name] == undefined) {
                            balanceEnd1[_expenseReport.waybills[i].amount[i1].name] = 0
                        }
                    }
                }
                for (let i = 0; i < addedItems.length; i++) {
                    if (balanceEnd1[addedItems[i].currency] == undefined) {
                        balanceEnd1[addedItems[i].currency] = 0
                    }
                }

                let keys
                let overExpense = []
                let expense1 = {}, expense = []
                for (let i = 0; i < _expenseReport.waybills.length; i++) {
                    for (let i1 = 0; i1 < _expenseReport.waybills[i].amount.length; i1++) {
                        if (expense1[_expenseReport.waybills[i].amount[i1].name] == undefined)
                            expense1[_expenseReport.waybills[i].amount[i1].name] = 0
                        expense1[_expenseReport.waybills[i].amount[i1].name] += _expenseReport.waybills[i].amount[i1].value
                    }
                }
                for (let i = 0; i < addedItems.length; i++) {
                    if (expense1[addedItems[i].currency] == undefined)
                        expense1[addedItems[i].currency] = 0
                    expense1[addedItems[i].currency] += addedItems[i].price * addedItems[i].count
                }
                keys = Object.keys(expense1)
                for (let i = 0; i < keys.length; i++) {
                    balanceEnd1[keys[i]] -= expense1[keys[i]]
                    expense.push({name: keys[i], value: expense1[keys[i]]})
                    balanceEnd2[keys[i]] = balanceEnd1[keys[i]]
                }
                let outCashbox1 = {}
                for (let i = 0; i < outCashbox.length; i++) {
                    outCashbox1[outCashbox[i].name] = outCashbox[i].value
                }
                keys = Object.keys(outCashbox1)
                for (let i = 0; i < keys.length; i++) {
                    balanceEnd1[keys[i]] -= outCashbox1[keys[i]]
                    balanceEnd2[keys[i]] = balanceEnd1[keys[i]]
                }
                keys = Object.keys(balanceEnd2)
                for (let i = 0; i < keys.length; i++) {
                    if (balanceEnd2[keys[i]] < 0)
                        overExpense.push({name: keys[i], value: balanceEnd2[keys[i]]})
                    balanceEnd.push({name: keys[i], value: balanceEnd2[keys[i]]})
                }

                setOverExpense([...overExpense.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)])
                setBalanceEnd([...balanceEnd.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)])
                setBalanceStart([...balanceStart.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)])
                setExpense([...expense.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)])
                setReceivedAmount([...receivedAmount.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)])
            }
        }
    },[outCashbox])
    useEffect(()=>{
        if(process.browser) {
            if (!initialRender.current&&_expenseReport&&!_expenseReport.status) {
                let balanceEnd1 = {}, balanceEnd2 = {}, balanceEnd = []
                let balanceStart1 = {}, balanceStart = []
                for (let i = 0; i < balance.length; i++) {
                    balanceStart1[balance[i].name] = balance[i].value
                    balanceEnd1[balance[i].name] = balance[i].value
                }
                for (let i = 0; i < _expenseReport.waybills.length; i++) {
                    for (let i1 = 0; i1 < _expenseReport.waybills[i].amount.length; i1++) {
                        if (balanceStart1[_expenseReport.waybills[i].amount[i1].name] == undefined) {
                            balanceStart1[_expenseReport.waybills[i].amount[i1].name] = 0
                            balanceEnd1[_expenseReport.waybills[i].amount[i1].name] = 0
                        }
                    }
                }
                for (let i = 0; i < addedItems.length; i++) {
                    if (balanceStart1[addedItems[i].currency] == undefined) {
                        balanceStart1[addedItems[i].currency] = 0
                        balanceEnd1[addedItems[i].currency] = 0
                    }
                }

                let keys, receivedAmount1 = {}, receivedAmount = []
                for (let i = 0; i < cashExchanges.length; i++) {
                    if (receivedAmount1[cashExchanges[i].currencyTypeFrom] == undefined)
                        receivedAmount1[cashExchanges[i].currencyTypeFrom] = 0
                    receivedAmount1[cashExchanges[i].currencyTypeFrom] -= cashExchanges[i].exchangeFrom

                    if (receivedAmount1[cashExchanges[i].currencyTypeTo] == undefined)
                        receivedAmount1[cashExchanges[i].currencyTypeTo] = 0
                    receivedAmount1[cashExchanges[i].currencyTypeTo] += cashExchanges[i].exchangeTo
                }
                for (let i = 0; i < cashConsumables.length; i++) {
                    if (receivedAmount1[cashConsumables[i].currencyType] == undefined)
                        receivedAmount1[cashConsumables[i].currencyType] = 0
                    receivedAmount1[cashConsumables[i].currencyType] += cashConsumables[i].amount
                }
                keys = Object.keys(receivedAmount1)
                for (let i = 0; i < keys.length; i++) {
                    if(receivedAmount1[keys[i]]>=0)
                        receivedAmount.push({name: keys[i], value: receivedAmount1[keys[i]]})
                    else
                        receivedAmount.push({name: keys[i], value: 0})
                    balanceStart1[keys[i]] -= receivedAmount1[keys[i]]
                    balanceStart.push({name: keys[i], value: checkFloat(balanceStart1[keys[i]])})
                }
                for (let i = 0; i < waybills.length; i++) {
                    for (let i1 = 0; i1 < waybills[i].amount.length; i1++) {
                        if (
                            (cashExchanges.length||cashConsumables.length)&&receivedAmount1[waybills[i].amount[i1].name] == undefined
                            ||
                            !(balanceStart.filter(element=>element.name===waybills[i].amount[i1].name)).length
                        ) {
                            balanceStart.push({
                                name: waybills[i].amount[i1].name,
                                value: checkFloat(balanceStart1[waybills[i].amount[i1].name])
                            })
                        }
                    }
                }
                for (let i = 0; i < addedItems.length; i++) {
                    if (
                        (cashExchanges.length||cashConsumables.length)&&receivedAmount1[addedItems[i].currency] == undefined
                        ||
                        !(balanceStart.filter(element=>element.name===addedItems[i].currency)).length
                    ) {
                        balanceStart.push({
                            name: addedItems[i].currency,
                            value: checkFloat(balanceStart1[addedItems[i].currency])
                        })
                    }
                }

                let overExpense = []
                let expense1 = {}, expense = []
                for (let i = 0; i < _expenseReport.waybills.length; i++) {
                    for (let i1 = 0; i1 < _expenseReport.waybills[i].amount.length; i1++) {
                        if (expense1[_expenseReport.waybills[i].amount[i1].name] == undefined)
                            expense1[_expenseReport.waybills[i].amount[i1].name] = 0
                        expense1[_expenseReport.waybills[i].amount[i1].name] += _expenseReport.waybills[i].amount[i1].value
                    }
                }
                for (let i = 0; i < addedItems.length; i++) {
                    if (expense1[addedItems[i].currency] == undefined)
                        expense1[addedItems[i].currency] = 0
                    expense1[addedItems[i].currency] += addedItems[i].price * addedItems[i].count
                }
                keys = Object.keys(expense1)
                for (let i = 0; i < keys.length; i++) {
                    balanceEnd1[keys[i]] -= expense1[keys[i]]
                    expense.push({name: keys[i], value: expense1[keys[i]]})
                    balanceEnd2[keys[i]] = balanceEnd1[keys[i]]
                }
                let outCashbox1 = {}
                for (let i = 0; i < outCashbox.length; i++) {
                    if (balanceEnd2[outCashbox[i].name] != undefined)
                        outCashbox1[outCashbox[i].name] = outCashbox[i].value
                }
                outCashbox = []
                keys = Object.keys(outCashbox1)
                for (let i = 0; i < keys.length; i++) {
                    outCashbox.push({name: keys[i], value: outCashbox1[keys[i]]})
                    balanceEnd1[keys[i]] -= outCashbox1[keys[i]]
                    balanceEnd2[keys[i]] = balanceEnd1[keys[i]]
                }
                keys = Object.keys(balanceEnd2)
                for (let i = 0; i < keys.length; i++) {
                    if (!(outCashbox.filter(element => element.name === keys[i])).length)
                        outCashbox.push({name: keys[i], value: 0})
                    if (balanceEnd2[keys[i]] < 0)
                        overExpense.push({name: keys[i], value: balanceEnd2[keys[i]]})
                    balanceEnd.push({name: keys[i], value: balanceEnd2[keys[i]]})
                }

                setOverExpense([...overExpense.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)])
                setBalanceEnd([...balanceEnd.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)])
                setBalanceStart([...balanceStart.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)])
                setExpense([...expense.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)])
                setReceivedAmount([...receivedAmount.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)])
                setOutCashbox([...outCashbox.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)])
            }
        }
    },[addedItems])
    const statusColor = {
        'обработка': 'orange',
        'принят': 'green'
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                balance = (await getMyBalance()).myBalance
                if (router.query.id === 'new') {
                    let applications = (await getApplicationsForWaybill()).applicationsForWaybill
                    let waybills = (await getWaybillsForExpenseReport()).waybillsForExpenseReport
                    let cashConsumables = (await getCashConsumablesForExpenseReport()).cashConsumablesForExpenseReport
                    let cashExchanges = (await getCashExchangeForExpenseReport()).cashExchangesForExpenseReport
                    let balanceEnd1 = {}, balanceEnd = []
                    let balanceStart1 = {}, balanceStart = []
                    balance = balance ? balance.amount : []
                    for (let i = 0; i < balance.length; i++) {
                        balanceStart1[balance[i].name] = balance[i].value
                        balanceEnd1[balance[i].name] = balance[i].value
                    }
                    for (let i = 0; i < waybills.length; i++) {
                        for (let i1 = 0; i1 < waybills[i].amount.length; i1++) {
                            if (balanceStart1[waybills[i].amount[i1].name] == undefined) {
                                balanceStart1[waybills[i].amount[i1].name] = 0
                                balanceEnd1[waybills[i].amount[i1].name] = 0
                            }
                        }
                    }

                    let keys, receivedAmount1 = {}, receivedAmount = []
                    for (let i = 0; i < cashExchanges.length; i++) {
                        if (receivedAmount1[cashExchanges[i].currencyTypeFrom] == undefined)
                            receivedAmount1[cashExchanges[i].currencyTypeFrom] = 0
                        receivedAmount1[cashExchanges[i].currencyTypeFrom] -= cashExchanges[i].exchangeFrom

                        if (receivedAmount1[cashExchanges[i].currencyTypeTo] == undefined)
                            receivedAmount1[cashExchanges[i].currencyTypeTo] = 0
                        receivedAmount1[cashExchanges[i].currencyTypeTo] += cashExchanges[i].exchangeTo
                    }
                    for (let i = 0; i < cashConsumables.length; i++) {
                        if (receivedAmount1[cashConsumables[i].currencyType] == undefined)
                            receivedAmount1[cashConsumables[i].currencyType] = 0
                        receivedAmount1[cashConsumables[i].currencyType] += cashConsumables[i].amount
                    }
                    keys = Object.keys(receivedAmount1)
                    for (let i = 0; i < keys.length; i++) {
                        if(receivedAmount1[keys[i]]>=0)
                            receivedAmount.push({name: keys[i], value: receivedAmount1[keys[i]]})
                        else
                            receivedAmount.push({name: keys[i], value: 0})
                        balanceStart1[keys[i]] -= receivedAmount1[keys[i]]
                        balanceStart.push({name: keys[i], value: checkFloat(balanceStart1[keys[i]])})
                    }
                    for (let i = 0; i < waybills.length; i++) {
                        for (let i1 = 0; i1 < waybills[i].amount.length; i1++) {
                            if (
                                (cashExchanges.length||cashConsumables.length)&&receivedAmount1[waybills[i].amount[i1].name] == undefined
                                ||
                                !(balanceStart.filter(element=>element.name===waybills[i].amount[i1].name)).length
                            ) {
                                balanceStart.push({
                                    name: waybills[i].amount[i1].name,
                                    value: checkFloat(balanceStart1[waybills[i].amount[i1].name])
                                })
                            }
                        }
                    }


                    let overExpense = []
                    let expense1 = {}, expense = []
                    for (let i = 0; i < waybills.length; i++) {
                        for (let i1 = 0; i1 < waybills[i].amount.length; i1++) {
                            if (expense1[waybills[i].amount[i1].name] == undefined)
                                expense1[waybills[i].amount[i1].name] = 0
                            expense1[waybills[i].amount[i1].name] += waybills[i].amount[i1].value
                        }
                    }


                    keys = Object.keys(expense1)
                    for (let i = 0; i < keys.length; i++) {
                        balanceEnd1[keys[i]] -= expense1[keys[i]]
                        if (balanceEnd1[keys[i]] < 0)
                            overExpense.push({name: keys[i], value: balanceEnd1[keys[i]]})
                        balanceEnd.push({name: keys[i], value: balanceEnd1[keys[i]]})
                        expense.push({name: keys[i], value: expense1[keys[i]]})
                    }

                    _expenseReport = {
                        applications: applications,
                        waybills: waybills,
                        cashConsumables: cashConsumables,
                        cashExchanges: cashExchanges,
                        addedItems: [],
                        balanceStart: balanceStart.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0),
                        receivedAmount: receivedAmount.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0),
                        expense: expense.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0),
                        overExpense: overExpense.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0),
                        balanceEnd: balanceEnd.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
                    }
                }
                else {
                    _expenseReport = (await getExpenseReport({_id: router.query.id})).expenseReport
                }
                if(_expenseReport){
                    setApplications(_expenseReport.applications);
                    setCashConsumables(_expenseReport.cashConsumables);
                    setCashExchanges(_expenseReport.cashExchanges);
                    setWaybills(_expenseReport.waybills);
                    setItems(_expenseReport.waybills.reduce((accumulator, currentValue)=>[...accumulator, ...currentValue.items.map(item=>{return {_id: currentValue._id, number: currentValue.number, createdAt: currentValue.createdAt, ...item}})], []))
                    setBalanceStart(_expenseReport.balanceStart);
                    setExpense(_expenseReport.expense);
                    setReceivedAmount(_expenseReport.receivedAmount);
                    setAddedItems(_expenseReport.addedItems);
                    setOverExpense(_expenseReport.overExpense);
                    setBalanceEnd(_expenseReport.balanceEnd);
                    setOutCashbox(_expenseReport.outCashbox?_expenseReport.outCashbox:_expenseReport.balanceStart.map(balance=>{return {name: balance.name, value: 0}}));
                    setAcceptHead(_expenseReport.acceptHead);
                    _setExpenseReport(_expenseReport)
                }
                setBalance(balance)
                setUnits((await getUnits({search: ''})).units)
            }
            else if(initialRender.current)
                initialRender.current = false;
        })()
    },[pinCode])
    return (
        <App pageName={router.query.id==='new'?'Добавить':_expenseReport?_expenseReport.number:'Ничего не найдено'}>
            <Head>
                <title>{router.query.id==='new'?'Добавить':_expenseReport?_expenseReport.number:'Ничего не найдено'}</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение'/>
                <meta property='og:title' content={router.query.id==='new'?'Добавить':_expenseReport?_expenseReport.number:'Ничего не найдено'} />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/expensereport/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/expensereport/${router.query.id}`}/>
            </Head>
            {
                _expenseReport?
                    <Card>
                        <CardContent className={classes.page}>
                            {
                                _expenseReport.number?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Номер:</div>&nbsp;
                                        <div className={classes.value}>{_expenseReport.number}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                _expenseReport.status?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Статус:</div>&nbsp;
                                        <div className={classes.value} style={{color: statusColor[_expenseReport.status]}}>{_expenseReport.status}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                _expenseReport.createdAt?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Время подачи:&nbsp;</div>
                                        <div className={classes.value}>{pdDDMMYYHHMM(_expenseReport.createdAt)}</div>
                                    </div>
                                    :
                                    null
                            }
                            <div className={classes.row}>
                                <div className={classes.nameField}>Заявка:&nbsp;</div>
                                <div className={classes.column} style={{width: 'auto'}}>
                                    {
                                        applications.map((application) =>
                                            <Link key={application._id} href='/application/[id]' as={`/application/${application._id}`}>
                                                <a>
                                                    <div className={classes.value}>{application.number}</div>
                                                </a>
                                            </Link>
                                        )
                                    }
                                </div>
                            </div>
                            {
                                router.query.id === 'new' ?
                                    null
                                    :
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Снабженец:&nbsp;</div>
                                        <div className={classes.value}>{_expenseReport.supplier.name}</div>
                                    </div>
                            }
                            <div className={classes.row}>
                                <div className={classes.nameField}>Начало периода:&nbsp;</div>
                                <div className={classes.column} style={{width: 'auto'}}>
                                    {
                                        balanceStart.map((element) =>
                                            <div className={classes.value}>{`${element.value} ${element.name}`}</div>
                                        )
                                    }
                                </div>
                            </div>
                            {
                                cashConsumables.length?
                                    <>
                                    <div className={classes.tableName} style={{marginTop: 0}}>
                                        <div className={classes.nameField}>Получено({cashConsumables.length}):&nbsp;</div>
                                        {
                                            isMobileApp?
                                                <>
                                                <div onClick={()=>{if(zoom1>0.1){setZoom1(zoom1-=0.1)}}} className={classes.zoomBtn}>-</div>
                                                <div onClick={()=>{if(zoom1<1){setZoom1(zoom1+=0.1)}}} className={classes.zoomBtn}>+</div>
                                                </>
                                                :
                                                null
                                        }
                                        &nbsp;&nbsp;&nbsp;
                                        <Button size='small' color='primary' onClick={()=>{
                                            setShowTable1(!showTable1)
                                        }}>
                                            {showTable1?'Спрятать':'Показать'}
                                        </Button>
                                    </div>
                                    {
                                        showTable1?
                                            <div className={classes.table} style={{zoom: zoom1}}>
                                                <div className={classes.tableRow} style={{width: 600}}>
                                                    <div className={classes.cell} style={{width: 100}}><div className={classes.nameTable}>Дата</div></div>
                                                    <div className={classes.cell} style={{width: 80}}><div className={classes.nameTable}>Документ</div></div>
                                                    <div className={classes.cell} style={{width: 120}}><div className={classes.nameTable}>Сумма</div></div>
                                                    <div className={classes.cell} style={{width: 200}}><div className={classes.nameTable}>Примечание</div></div>
                                                </div>
                                                {cashConsumables.map((cashConsumable, idx) =>
                                                    <div className={classes.tableRow} key={idx} style={{width: 600}}>
                                                        <div className={classes.cell} style={{width: 100}}>
                                                            <div className={classes.nameTable}>
                                                                {pdDDMMYYHHMM(cashConsumable.createdAt)}
                                                            </div>
                                                        </div>
                                                        <div className={classes.cell} style={{width: 80}}>
                                                            <Link href='/cashconsumable/[id]' as={`/cashconsumable/${cashConsumable._id}`}>
                                                                <a>
                                                                    <div className={classes.value}>{cashConsumable.number}</div>
                                                                </a>
                                                            </Link>
                                                        </div>
                                                        <div className={classes.cell} style={{width: 120}}>
                                                            <div className={classes.value}>{`${cashConsumable.amount} ${cashConsumable.currencyType}`}</div>
                                                        </div>
                                                        <div className={classes.cell} style={{width: 200}}>
                                                            <div className={classes.value}>{cashConsumable.comment}</div>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                            :
                                            <br/>
                                    }
                                    </>
                                    :
                                    null
                            }
                            {
                                cashExchanges.length?
                                    <>
                                    <div className={classes.tableName} style={{marginTop: 0}}>
                                        <div className={classes.nameField}>Конвертировано({cashConsumables.length}):&nbsp;</div>
                                        {
                                            isMobileApp?
                                                <>
                                                <div onClick={()=>{if(zoom2>0.1){setZoom2(zoom2-=0.1)}}} className={classes.zoomBtn}>-</div>
                                                <div onClick={()=>{if(zoom2<1){setZoom2(zoom2+=0.1)}}} className={classes.zoomBtn}>+</div>
                                                </>
                                                :
                                                null
                                        }
                                        &nbsp;&nbsp;&nbsp;
                                        <Button size='small' color='primary' onClick={()=>{
                                            setShowTable2(!showTable2)
                                        }}>
                                            {showTable2?'Спрятать':'Показать'}
                                        </Button>
                                    </div>
                                    {
                                        showTable2?
                                            <div className={classes.table} style={{zoom: zoom2}}>
                                                <div className={classes.tableRow} style={{width: 520}}>
                                                    <div className={classes.cell} style={{width: 100}}><div className={classes.nameTable}>Дата</div></div>
                                                    <div className={classes.cell} style={{width: 80}}><div className={classes.nameTable}>Документ</div></div>
                                                    <div className={classes.cell} style={{width: 120}}><div className={classes.nameTable}>Продажа</div></div>
                                                    <div className={classes.cell} style={{width: 120}}><div className={classes.nameTable}>Покупка</div></div>
                                                </div>
                                                {cashExchanges.map((cashExchange, idx) =>
                                                    <div className={classes.tableRow} key={idx} style={{width: 520}}>
                                                        <div className={classes.cell} style={{width: 100}}>
                                                            <div className={classes.nameTable}>
                                                                {pdDDMMYYHHMM(cashExchange.createdAt)}
                                                            </div>
                                                        </div>
                                                        <div className={classes.cell} style={{width: 80}}>
                                                            <Link href='/cashexchange/[id]' as={`/cashexchange/${cashExchange._id}`}>
                                                                <a>
                                                                    <div className={classes.value}>{cashExchange.number}</div>
                                                                </a>
                                                            </Link>
                                                        </div>
                                                        <div className={classes.cell} style={{width: 120, cursor: 'pointer'}} onClick={()=>{
                                                            setShowAppBar(false)
                                                            setShowLightbox(true)
                                                            setImagesLightbox(cashExchange.note)
                                                            setIndexLightbox(0)
                                                        }}>
                                                            <div className={classes.value}>{`${cashExchange.exchangeFrom} ${cashExchange.currencyTypeFrom}`}</div>
                                                        </div>
                                                        <div className={classes.cell} style={{width: 120, cursor: 'pointer'}} onClick={()=>{
                                                            setShowAppBar(false)
                                                            setShowLightbox(true)
                                                            setImagesLightbox(cashExchange.note)
                                                            setIndexLightbox(0)
                                                        }}>
                                                            <div className={classes.value}>{`${cashExchange.exchangeTo} ${cashExchange.currencyTypeTo}`}</div>
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                            :
                                            <br/>
                                    }
                                    </>
                                    :
                                    null
                            }{
                            cashConsumables.length||cashExchanges.length?
                                <div className={classes.row}>
                                    <div className={classes.nameField}>Итого получено:&nbsp;</div>
                                    <div className={classes.column} style={{width: 'auto'}}>
                                        {
                                            receivedAmount.map((element) =>
                                                <div className={classes.value}>{`${element.value} ${element.name}`}</div>
                                            )
                                        }
                                    </div>
                                </div>
                                :
                                null
                        }
                            <div className={classes.tableName} style={{marginTop: 0}}>
                                <div className={classes.nameField}>Расход({items.length}):&nbsp;</div>
                                {
                                    isMobileApp?
                                        <>
                                        <div onClick={()=>{if(zoom3>0.1){setZoom3(zoom3-=0.1)}}} className={classes.zoomBtn}>-</div>
                                        <div onClick={()=>{if(zoom3<1){setZoom3(zoom3+=0.1)}}} className={classes.zoomBtn}>+</div>
                                        </>
                                        :
                                        null
                                }
                                &nbsp;&nbsp;&nbsp;
                                <Button size='small' color='primary' onClick={()=>{
                                    setShowTable3(!showTable3)
                                }}>
                                    {showTable3?'Спрятать':'Показать'}
                                </Button>
                            </div>
                            {
                                showTable3?
                                    <>
                                    <div className={classes.table} style={{zoom: zoom3}}>
                                        <div className={classes.tableRow} style={{width: isMobileApp?990:'100%'}}>
                                            <div className={classes.cell} style={{width: 100}}><div className={classes.nameTable}>Дата</div></div>
                                            <div className={classes.cell} style={{width: 80}}><div className={classes.nameTable}>Накладная</div></div>
                                            <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - 1044px) / 2)`}}><div className={classes.nameTable}>Товар</div></div>
                                            <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>Кол-во</div></div>
                                            <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>Цена</div></div>
                                            <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>Сумма</div></div>
                                            <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>Валюта</div></div>
                                            <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>Ед. изм.</div></div>
                                            <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - 1044px) / 2)`}}><div className={classes.nameTable}>Обоснование</div></div>
                                        </div>
                                        {items.map((item, idx) =>
                                            <div className={classes.tableRow} key={idx} style={{width: isMobileApp?990:'100%'}}>
                                                <div className={classes.cell} style={{width: 100}}>
                                                    <div className={classes.nameTable}>
                                                        {pdDDMMYYHHMM(item.createdAt)}
                                                    </div>
                                                </div>
                                                <div className={classes.cell} style={{width: 80}}>
                                                    <Link href='/waybill/[id]' as={`/waybill/${item._id}`}>
                                                        <a>
                                                            <div className={classes.value}>{item.number}</div>
                                                        </a>
                                                    </Link>
                                                </div>
                                                <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - 1044px) / 2)`}}>
                                                    <div className={classes.value}>{item.name}</div>
                                                </div>
                                                <div className={classes.cell} style={{width: 60}}>
                                                    <div className={classes.value}>{item.count}</div>
                                                </div>
                                                <div className={classes.cell} style={{width: 60}}>
                                                    <div className={classes.value}>{item.price}</div>
                                                </div>
                                                <div className={classes.cell} style={{width: 70}}>
                                                    <div className={classes.value}>{item.count*item.price}</div>
                                                </div>
                                                <div className={classes.cell} style={{width: 70}}>
                                                    <div className={classes.value}>{item.currency}</div>
                                                </div>
                                                <div className={classes.cell} style={{width: 70}}>
                                                    <div className={classes.value}>{item.unit}</div>
                                                </div>
                                                <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - 1044px) / 2)`}}>
                                                    <div className={classes.value}>{item.comment}</div>
                                                </div>
                                            </div>
                                        )}
                                        {addedItems.map((item, idx) =>
                                            <div className={classes.tableRow} key={idx} style={{width: isMobileApp?990:'100%'}}>
                                                <div className={classes.cell} style={{width: 100}}>
                                                    {
                                                        ['admin', 'менеджер', 'снабженец'].includes(profile.role)&&!_expenseReport.status?
                                                            <Button color='secondary' size='small' onClick={()=>{
                                                                addedItems.splice(idx, 1)
                                                                setAddedItems([...addedItems])
                                                            }}>
                                                                Удалить
                                                            </Button>
                                                            :
                                                            <div className={classes.nameTable}>
                                                                {pdDDMMYYHHMM(_expenseReport.createdAt)}
                                                            </div>
                                                    }
                                                </div>
                                                <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - 1044px) / 2 + 100px)`}}>
                                                    {
                                                        router.query.id==='new'?
                                                            <Autocomplete
                                                                onClose={()=>setOpen(false)}
                                                                open={open}
                                                                disableOpenOnFocus
                                                                className={classes.input}
                                                                options={itemsName}
                                                                getOptionLabel={option => option.name}
                                                                onChange={(event, newValue) => {
                                                                    addedItems[idx].name = newValue.name
                                                                    addedItems[idx].GUID = newValue.GUID
                                                                    if (newValue.lastPrice) {
                                                                        addedItems[idx].lastPrice = newValue.lastPrice
                                                                        for(let i = 0; i<newValue.lastPrice.length; i++) {
                                                                            if(newValue.lastPrice[i].name===addedItems[idx].currency){
                                                                                addedItems[idx].price = newValue.lastPrice[i].value
                                                                            }
                                                                        }
                                                                    }
                                                                    setAddedItems([...addedItems])
                                                                }}
                                                                noOptionsText='Ничего не найдено'
                                                                renderInput={params => (
                                                                    <TextField {...params} label='Выберите товар' variant='outlined' fullWidth
                                                                               onChange={handleChange}
                                                                               InputProps={{
                                                                                   ...params.InputProps,
                                                                                   endAdornment: (
                                                                                       <React.Fragment>
                                                                                           {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                                                                           {params.InputProps.endAdornment}
                                                                                       </React.Fragment>
                                                                                   ),
                                                                               }}
                                                                    />
                                                                )}
                                                            />
                                                            :
                                                            <div className={classes.value}>{item.name}</div>

                                                    }
                                                </div>
                                                <div className={classes.cell} style={{width: 60}}>
                                                    {
                                                        router.query.id==='new'?
                                                            <Input
                                                                className={classes.inputTable}
                                                                type={isMobileApp?'number':'text'}
                                                                value={item.count}
                                                                onChange={(event)=>{
                                                                    addedItems[idx].count = inputFloat(event.target.value)
                                                                    setAddedItems([...addedItems])
                                                                }}
                                                            />
                                                            :
                                                            <div className={classes.value}>{item.count}</div>

                                                    }
                                                </div>
                                                <div className={classes.cell} style={{width: 60}}>
                                                    {
                                                        router.query.id==='new'?
                                                            <Input
                                                                className={classes.inputTable}
                                                                value={item.price}
                                                                type={isMobileApp?'number':'text'}
                                                                onChange={(event)=>{
                                                                    addedItems[idx].price = inputFloat(event.target.value)
                                                                    setAddedItems([...addedItems])
                                                                }}
                                                            />
                                                            :
                                                            <div className={classes.value}>{item.price}</div>

                                                    }
                                                </div>
                                                <div className={classes.cell} style={{width: 70}}>
                                                    {
                                                        router.query.id==='new'?
                                                            <Input
                                                                className={classes.inputTable}
                                                                inputProps={{
                                                                    readOnly: true
                                                                }}
                                                                value={checkFloat(item.count*item.price)}
                                                            />
                                                            :
                                                            <div className={classes.value}>{item.count*item.price}</div>

                                                    }
                                                </div>
                                                <div className={classes.cell} style={{width: 70}}>
                                                    {
                                                        router.query.id==='new'?
                                                            <Select
                                                                className={classes.inputTable}
                                                                value={item.currency}
                                                                onChange={(event)=>{
                                                                    addedItems[idx].currency = event.target.value
                                                                    if (addedItems[idx].lastPrice) {
                                                                        for(let i = 0; i<addedItems[idx].lastPrice.length; i++) {
                                                                            if(addedItems[idx].lastPrice[i].name===event.target.value){
                                                                                addedItems[idx].price = addedItems[idx].lastPrice[i].value
                                                                            }
                                                                        }
                                                                    }
                                                                    setAddedItems([...addedItems])
                                                                }}
                                                                input={<Input/>}
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        style: {
                                                                            maxHeight: 500,
                                                                            width: 250,
                                                                        },
                                                                    },
                                                                }}
                                                            >
                                                                {currencys.map((currency) => (
                                                                    <MenuItem key={currency} value={currency}>
                                                                        {currency}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                            :
                                                            <div className={classes.value}>{item.currency}</div>

                                                    }
                                                </div>
                                                <div className={classes.cell} style={{width: 70}}>
                                                    {
                                                        router.query.id==='new'?
                                                            <Select
                                                                className={classes.inputTable}
                                                                value={item.unit}
                                                                onChange={(event)=>{
                                                                    addedItems[idx].unit = event.target.value
                                                                    setAddedItems([...addedItems])
                                                                }}
                                                                input={<Input/>}
                                                                MenuProps={{
                                                                    PaperProps: {
                                                                        style: {
                                                                            maxHeight: 500,
                                                                            width: 250,
                                                                        },
                                                                    },
                                                                }}
                                                            >
                                                                {units.map((unit) => (
                                                                    <MenuItem key={unit._id} value={unit.name}>
                                                                        {unit.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                            :
                                                            <div className={classes.value}>{item.unit}</div>

                                                    }
                                                </div>
                                                <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - 1044px) / 2)`}}>
                                                    {
                                                        router.query.id==='new'?
                                                            <Input
                                                                className={classes.inputTable}
                                                                multiline={true}
                                                                value={item.comment}
                                                                onChange={(event)=>{
                                                                    addedItems[idx].comment = event.target.value
                                                                    setAddedItems([...addedItems])
                                                                }}
                                                            />
                                                            :
                                                            <div className={classes.value}>{item.comment}</div>

                                                    }
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                    {
                                        !_expenseReport.status?
                                            <Button color='primary' size='small' onClick={()=>{
                                                addedItems = [...addedItems, {
                                                    name: '',
                                                    unit: 'шт',
                                                    currency: 'сом',
                                                    price: 0,
                                                    count: 0,
                                                    comment: '',
                                                    status: 'принят',
                                                    GUID: ''
                                                }]
                                                setAddedItems(addedItems)
                                            }}>
                                                Добавить расход
                                            </Button>
                                            :
                                            null
                                    }
                                    </>
                                    :
                                    <br/>
                            }
                            <div className={classes.row}>
                                <div className={classes.nameField}>Итого расход:&nbsp;</div>
                                <div className={classes.column} style={{width: 'auto'}}>
                                    {
                                        expense.map((element) =>
                                            <div className={classes.value}>{`${element.value} ${element.name}`}</div>
                                        )
                                    }
                                </div>
                            </div>
                            {
                                overExpense.length?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Перерасход:&nbsp;</div>
                                        <div className={classes.column} style={{width: 'auto'}}>
                                            {
                                                overExpense.map((element) =>
                                                    <div className={classes.value}>{`${element.value} ${element.name}`}</div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    :
                                    null
                            }

                            {
                                router.query.id==='new'?
                                    <>
                                    <div className={classes.tableName} style={{marginTop: 0}}>
                                        <div className={classes.nameField}>Сдано в кассу({outCashbox.length}):&nbsp;</div>
                                    </div>
                                    {
                                        outCashbox.map((element, idx) =>
                                            <div key={idx} className={classes.row}>
                                                <div className={classes.nameField}>{element.name}:&nbsp;</div>
                                                <div className={classes.value}>
                                                    <Input
                                                        type={isMobileApp?'number':'text'}
                                                        className={classes.inputTable}
                                                        size='small'
                                                        value={element.value}
                                                        style={{width: '150px', marginBottom: 10}}
                                                        onChange={(event) => {
                                                            outCashbox[idx].value = inputFloat(event.target.value)
                                                            setOutCashbox([...outCashbox])
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    }
                                    </>
                                    :
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Сдано в кассу:&nbsp;</div>
                                        <div className={classes.column} style={{width: 'auto'}}>
                                            {
                                                outCashbox.map((element) =>
                                                    <div className={classes.value}>{`${element.value} ${element.name}`}</div>
                                                )
                                            }
                                        </div>
                                    </div>
                            }

                            <div className={classes.row}>
                                <div className={classes.nameField}>Конец периода:&nbsp;</div>
                                <div className={classes.column} style={{width: 'auto'}}>
                                    {
                                        balanceEnd.map((element) =>
                                            <div className={classes.value}>{`${element.value} ${element.name}`}</div>
                                        )
                                    }
                                </div>
                            </div>
                            {
                                router.query.id === 'new' ?
                                    null
                                    :
                                    <>
                                    <br/>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Подтверждения:&nbsp;</div>
                                    </div>
                                    <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                        <div className={classes.nameField}>{`Начальник отдела${_expenseReport.acceptHead?` ${pdDDMMYYHHMM(_expenseReport.acceptHead)}`:''}`}:&nbsp;</div>
                                        <Checkbox
                                            size='small'
                                            checked={acceptHead}
                                            onChange={() => {
                                                if(
                                                    _expenseReport.status === 'обработка'&&
                                                    'снабженец'!==profile.role&&
                                                    !_expenseReport.acceptHead
                                                ) {
                                                    setAcceptHead(!acceptHead)
                                                }
                                            }}
                                            color='primary'
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </div>
                                    </>
                            }
                            <div className={isMobileApp ? classes.bottomDivM : classes.bottomDivD}>
                                {
                                    router.query.id === 'new' || _expenseReport.status === 'обработка' ?
                                        <Button color='primary' onClick={() => {
                                            const action = async () => {
                                                if (router.query.id === 'new') {
                                                    addedItems = addedItems.map(item=>{delete item.lastPrice; item.price = checkFloat(item.price); item.count = checkFloat(item.count); return item});
                                                    outCashbox = outCashbox.map(element=>{element.value = checkFloat(element.value); return element});
                                                    await addExpenseReport({
                                                        outCashbox: outCashbox,
                                                        addedItems: addedItems
                                                    })
                                                }
                                                else {
                                                    let element = {
                                                        _id: router.query.id
                                                    }
                                                    if (acceptHead && acceptHead !== _expenseReport.acceptHead) element.acceptHead = acceptHead
                                                    await setExpenseReport(element)
                                                }
                                                Router.push(`/expensereports`)
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }}>
                                            Сохранить
                                        </Button>
                                        :
                                        null
                                }
                                {
                                    _expenseReport.status==='обработка'&&['admin', 'менеджер', 'снабженец'].includes(profile.role)?
                                        <Button size='small' color='primary' onClick={()=>{
                                            const action = async() => {
                                                await deleteExpenseReport([router.query.id])
                                                Router.push(`/expensereports`)
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        }}>
                                            Удалить
                                        </Button>
                                        :
                                        null
                                }
                                {
                                    router.query.id!=='new'&&'обработка'!==_expenseReport.status?
                                        <Button size='small' color='primary' onClick={async()=>{
                                            await showLoad(true)
                                            window.open(((await getUnloadingExpenseReport({
                                                _id: router.query.id,
                                            })).unloadingExpenseReport).data, '_blank');
                                            await showLoad(false)
                                        }}>
                                            Выгрузить
                                        </Button>
                                        :
                                        null
                                }
                            </div>
                        </CardContent>
                    </Card>
                    :
                    null
            }
        </App>
    )
})

ExpenseReport.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!/*['admin', 'менеджер', 'снабженец', 'начальник отдела'].includes*/(ctx.store.getState().user.profile.role))
        if(ctx.res) {
            ctx.res.writeHead(302, {
                Location: '/'
            })
            ctx.res.end()
        }
        else {
            Router.push('/')
        }
    let expenseReport
    let balance
    if(ctx.store.getState().user.pinCode) {
        if (ctx.query.id === 'new') {
            balance = (await getMyBalance(ctx.req ? await getClientGqlSsr(ctx.req) : undefined)).myBalance
            let applications = (await getApplicationsForWaybill(ctx.req ? await getClientGqlSsr(ctx.req) : undefined)).applicationsForWaybill
            let waybills = (await getWaybillsForExpenseReport(ctx.req ? await getClientGqlSsr(ctx.req) : undefined)).waybillsForExpenseReport
            let cashConsumables = (await getCashConsumablesForExpenseReport(ctx.req ? await getClientGqlSsr(ctx.req) : undefined)).cashConsumablesForExpenseReport
            let cashExchanges = (await getCashExchangeForExpenseReport(ctx.req ? await getClientGqlSsr(ctx.req) : undefined)).cashExchangesForExpenseReport

            let balanceEnd1 = {}, balanceEnd = []
            let balanceStart1 = {}, balanceStart = []
            balance = balance ? balance.amount : []
            for (let i = 0; i < balance.length; i++) {
                balanceStart1[balance[i].name] = balance[i].value
                balanceEnd1[balance[i].name] = balance[i].value
            }
            for (let i = 0; i < waybills.length; i++) {
                for (let i1 = 0; i1 < waybills[i].amount.length; i1++) {
                    if (balanceStart1[waybills[i].amount[i1].name] == undefined) {
                        balanceStart1[waybills[i].amount[i1].name] = 0
                        balanceEnd1[waybills[i].amount[i1].name] = 0
                    }
                }
            }

            let keys, receivedAmount1 = {}, receivedAmount = []
            for (let i = 0; i < cashExchanges.length; i++) {
                if (receivedAmount1[cashExchanges[i].currencyTypeFrom] == undefined)
                    receivedAmount1[cashExchanges[i].currencyTypeFrom] = 0
                receivedAmount1[cashExchanges[i].currencyTypeFrom] -= cashExchanges[i].exchangeFrom

                if (receivedAmount1[cashExchanges[i].currencyTypeTo] == undefined)
                    receivedAmount1[cashExchanges[i].currencyTypeTo] = 0
                receivedAmount1[cashExchanges[i].currencyTypeTo] += cashExchanges[i].exchangeTo
            }
            for (let i = 0; i < cashConsumables.length; i++) {
                if (receivedAmount1[cashConsumables[i].currencyType] == undefined)
                    receivedAmount1[cashConsumables[i].currencyType] = 0
                receivedAmount1[cashConsumables[i].currencyType] += cashConsumables[i].amount
            }
            keys = Object.keys(receivedAmount1)
            for (let i = 0; i < keys.length; i++) {
                if(receivedAmount1[keys[i]]>=0)
                    receivedAmount.push({name: keys[i], value: receivedAmount1[keys[i]]})
                else
                    receivedAmount.push({name: keys[i], value: 0})
                balanceStart1[keys[i]] -= receivedAmount1[keys[i]]
                balanceStart.push({name: keys[i], value: checkFloat(balanceStart1[keys[i]])})
            }
            for (let i = 0; i < waybills.length; i++) {
                for (let i1 = 0; i1 < waybills[i].amount.length; i1++) {
                    if (
                        (cashExchanges.length||cashConsumables.length)&&receivedAmount1[waybills[i].amount[i1].name] == undefined
                        ||
                        !(balanceStart.filter(element=>element.name===waybills[i].amount[i1].name)).length
                    ) {
                        balanceStart.push({
                            name: waybills[i].amount[i1].name,
                            value: checkFloat(balanceStart1[waybills[i].amount[i1].name])
                        })
                    }
                }
            }


            let overExpense = []
            let expense1 = {}, expense = []
            for (let i = 0; i < waybills.length; i++) {
                for (let i1 = 0; i1 < waybills[i].amount.length; i1++) {
                    if (expense1[waybills[i].amount[i1].name] == undefined)
                        expense1[waybills[i].amount[i1].name] = 0
                    expense1[waybills[i].amount[i1].name] += waybills[i].amount[i1].value
                }
            }

            keys = Object.keys(expense1)
            for (let i = 0; i < keys.length; i++) {
                balanceEnd1[keys[i]] -= expense1[keys[i]]
                if (balanceEnd1[keys[i]] < 0)
                    overExpense.push({name: keys[i], value: balanceEnd1[keys[i]]})
                balanceEnd.push({name: keys[i], value: balanceEnd1[keys[i]]})
                expense.push({name: keys[i], value: expense1[keys[i]]})
            }

            expenseReport = {
                applications: applications,
                waybills: waybills,
                cashConsumables: cashConsumables,
                cashExchanges: cashExchanges,
                addedItems: [],
                balanceStart: balanceStart.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0),
                receivedAmount: receivedAmount.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0),
                expense: expense.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0),
                overExpense: overExpense.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0),
                balanceEnd: balanceEnd.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
            }
        }
        else {
            expenseReport = (await getExpenseReport({_id: ctx.query.id}, ctx.req ? await getClientGqlSsr(ctx.req) : undefined)).expenseReport
        }
    }
    return {
        data: {
            balance: balance,
            expenseReport: expenseReport,
            ...await getUnits({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
        }
    }
}

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpenseReport);