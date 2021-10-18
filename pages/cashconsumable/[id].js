import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import cashConsumableStyle from '../../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import { addCashConsumable, getCashConsumable, getUnloadingCashConsumable } from '../../src/gql/cashConsumable'
import { getSuppliers } from '../../src/gql/user'
import TextField from '@material-ui/core/TextField';
import { urlMain } from '../../redux/constants/other'
import Confirmation from '../../components/dialog/Confirmation'
import { useRouter } from 'next/router'
import * as snackbarActions from '../../redux/actions/snackbar'
import Router from 'next/router'
import { getClientGqlSsr } from '../../src/getClientGQL'
import { pdDDMMYYHHMM, checkInt, currencys } from '../../src/lib'
import initialApp from '../../src/initialApp'
import Autocomplete from '@material-ui/lab/Autocomplete';
import * as appActions from '../../redux/actions/app'

const CashConsumable = React.memo((props) => {
    const { pinCode } = props.user;
    const classes = cashConsumableStyle();
    const { data } = props;
    const router = useRouter()
    const { isMobileApp } = props.app;
    const initialRender = useRef(true);
    const { showSnackBar } = props.snackbarActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    let [cashConsumable, setCashConsumable] = useState(data.cashConsumable?data.cashConsumable:undefined);
    let [amount, setAmount] = useState(cashConsumable?cashConsumable.amount:undefined);
    let [currencyType, setCurrencyType] = useState(cashConsumable?cashConsumable.currencyType:'сом');
    let handleCurrencyType = (async (event) => {
        setCurrencyType(event.target.value)
    })
    const { showLoad } = props.appActions;
    let [comment, setComment] = useState(cashConsumable?cashConsumable.comment:'');
    let [budget, setBudget] = useState(cashConsumable?cashConsumable.budget:'');
    let [supplier, setSupplier] = useState(cashConsumable?cashConsumable.supplier:undefined);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                let cashConsumable = (await getCashConsumable({_id: router.query.id})).cashConsumable
                if(cashConsumable) {
                    setAmount(cashConsumable.amount)
                    setCurrencyType(cashConsumable.currencyType)
                    setComment(cashConsumable.comment)
                    setBudget(cashConsumable.budget)
                    setSupplier(cashConsumable.supplier)
                    setCashConsumable(cashConsumable)
                }
            }
            else initialRender.current = false
        })()
    },[pinCode])
    return (
        <App pageName={router.query.id==='new'?'Добавить':cashConsumable?cashConsumable.number:'Ничего не найдено'}>
            <Head>
                <title>{router.query.id==='new'?'Добавить':cashConsumable?cashConsumable.number:'Ничего не найдено'}</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение'/>
                <meta property='og:title' content={router.query.id==='new'?'Добавить':cashConsumable?cashConsumable.number:'Ничего не найдено'} />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/cashconsumable/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/cashconsumable/${router.query.id}`}/>
            </Head>
            {
                cashConsumable?
                    <>
                    <Card>
                        <CardContent className={classes.page}>
                            {
                                cashConsumable.number?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Номер:</div>&nbsp;
                                        <div className={classes.value}>{cashConsumable.number}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                cashConsumable.createdAt?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Дата выплаты:&nbsp;</div>
                                        <div className={classes.value}>{pdDDMMYYHHMM(cashConsumable.createdAt)}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                router.query.id==='new'?
                                    <>
                                    <Autocomplete
                                        size='small'
                                        className={classes.input}
                                        options={suppliers}
                                        getOptionLabel={option => option.name}
                                        value={supplier}
                                        onChange={(event, newValue) => {
                                            setSupplier(newValue)
                                        }}
                                        noOptionsText='Ничего не найдено'
                                        renderInput={params => (
                                            <TextField {...params} label='Снабженец' variant='outlined' fullWidth />
                                        )}
                                    />
                                    <div className={classes.row}>
                                        <TextField
                                            type={isMobileApp?'number':'text'}
                                            size='small'
                                            label='Сумма'
                                            value={amount}
                                            className={classes.inputHalf}
                                            onChange={(event)=>{
                                                setAmount(checkInt(event.target.value))
                                            }}
                                            inputProps={{
                                                'aria-label': 'description',
                                            }}
                                        />
                                        <FormControl                                size='small'
                                                                                    className={classes.inputHalf}>
                                            <InputLabel>Тип валюты</InputLabel>
                                            <Select
                                                value={currencyType}
                                                onChange={handleCurrencyType}
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
                                        </FormControl>
                                    </div>
                                    <TextField
                                        size='small'
                                        label='Основание/Примечание'
                                        value={comment}
                                        className={classes.input}
                                        onChange={(event)=>{
                                            setComment(event.target.value)
                                        }}
                                        inputProps={{
                                            'aria-label': 'description',
                                        }}
                                    />
                                    <TextField
                                        size='small'
                                        label='Отметка по бюджету'
                                        value={budget}
                                        className={classes.input}
                                        onChange={(event)=>{
                                            setBudget(event.target.value)
                                        }}
                                        inputProps={{
                                            'aria-label': 'description',
                                        }}
                                    />
                                    </>
                                    :
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Снабженец:&nbsp;</div>
                                        <div className={classes.value}>{cashConsumable.supplier.name}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Сумма:&nbsp;</div>
                                        <div className={classes.value}>{amount}&nbsp;{currencyType}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Основание/Примечание:&nbsp;</div>
                                        <div className={classes.value}>{comment}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Отметка по бюджету:&nbsp;</div>
                                        <div className={classes.value}>{budget}</div>
                                    </div>
                                    </>
                            }
                        </CardContent>
                    </Card>
                    <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                        {
                            router.query.id === 'new' ?
                                <div className={isMobileApp ? classes.bottomDivM : classes.bottomDivD}>
                                    <Button color='primary' onClick={() => {
                                        if (amount&&supplier) {
                                            const action = async () => {
                                                await addCashConsumable({
                                                    supplier: supplier._id, budget: budget, amount: amount, comment: comment, currencyType: currencyType
                                                })
                                                Router.push(`/cashconsumables`)
                                            }
                                            setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        } else
                                            showSnackBar('Заполните все поля')
                                    }}>
                                        Сохранить
                                    </Button>
                                </div>
                                :
                                null
                        }
                        {
                            router.query.id!=='new'&&'обработка'!==cashConsumable.status?
                                <Button size='small' color='primary' onClick={async()=>{
                                    await showLoad(true)
                                    window.open(((await getUnloadingCashConsumable({
                                        _id: router.query.id,
                                    })).unloadingCashConsumable).data, '_blank');
                                    await showLoad(false)
                                }}>
                                    Выгрузить
                                </Button>
                                :
                                null
                        }
                    </div>
                    </>
                    :
                    null
            }
        </App>
    )
})

CashConsumable.getInitialProps = async function(ctx) {
    await initialApp(ctx)
    if(!['admin', 'менеджер', 'снабженец', 'бухгалтерия', 'кассир'].includes(ctx.store.getState().user.profile.role))
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
            ...(ctx.query.id==='new'?
                    {
                        cashConsumable:
                            {
                                amount: 0,
                                comment: '',
                                budget: '',
                                currencyType: 'сом',
                                supplier: undefined,
                            }
                    }
                :
                    await getCashConsumable({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
            ),
            ...await getSuppliers(ctx.req?await getClientGqlSsr(ctx.req):undefined)

        }
    };
};

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

export default connect(mapStateToProps, mapDispatchToProps)(CashConsumable);