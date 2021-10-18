import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import cashExchangeStyle from '../../src/styleMUI/list'
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
import { addCashExchange, getCashExchange, getUnloadingCashExchange, deleteCashExchange } from '../../src/gql/cashExchange'
import { getSuppliers } from '../../src/gql/user'
import TextField from '@material-ui/core/TextField';
import { urlMain } from '../../redux/constants/other'
import Confirmation from '../../components/dialog/Confirmation'
import { useRouter } from 'next/router'
import * as snackbarActions from '../../redux/actions/snackbar'
import Router from 'next/router'
import { getClientGqlSsr } from '../../src/getClientGQL'
import { pdDDMMYYHHMM, checkFloat, currencys, inputFloat } from '../../src/lib'
import initialApp from '../../src/initialApp'
import * as appActions from '../../redux/actions/app'
import { resizeImg } from '../../src/resizeImg'

const CashExchange = React.memo((props) => {
    const { pinCode } = props.user;
    const classes = cashExchangeStyle();
    const { data } = props;
    const router = useRouter()
    const { isMobileApp } = props.app;
    const initialRender = useRef(true);
    const { showSnackBar } = props.snackbarActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    let [cashExchange, setCashExchange] = useState(data.cashExchange?data.cashExchange:undefined);

    let [exchangeFrom, setExchangeFrom] = useState(cashExchange?cashExchange.exchangeFrom:0);
    let [currencyTypeFrom, setCurrencyTypeFrom] = useState(cashExchange?cashExchange.currencyTypeFrom:'сом');
    let handleCurrencyTypeFrom = (async (event) => {
        setCurrencyTypeFrom(event.target.value)
    })
    let [exchangeTo, setExchangeTo] = useState(cashExchange?cashExchange.exchangeTo:0);
    let [currencyTypeTo, setCurrencyTypeTo] = useState(cashExchange?cashExchange.currencyTypeTo:'сом');
    let handleCurrencyTypeTo = (async (event) => {
        setCurrencyTypeTo(event.target.value)
    })
    let [exchangeRate, setExchangeRate] = useState(cashExchange?cashExchange.exchangeRate:0);
    let [currencyTypeRate, setCurrencyTypeRate] = useState(cashExchange?cashExchange.currencyTypeRate:0);
    let [comment, setComment] = useState(cashExchange?cashExchange.comment:'');
    let [note, setNote] = useState(cashExchange?cashExchange.note:[]);
    let handleChangeNote = (async (event) => {
        if(event.target.files[0].size/1024/1024<50){
            setNote([...note, await resizeImg(event.target.files[0])])
        } else {
            showSnackBar('Файл слишком большой')
        }
    })


    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                if(checkFloat(exchangeFrom)>checkFloat(exchangeTo)){
                    setCurrencyTypeRate(currencyTypeFrom)
                    setExchangeRate(checkFloat(exchangeFrom/exchangeTo))
                }
                else {
                    setCurrencyTypeRate(currencyTypeTo)
                    setExchangeRate(checkFloat(exchangeTo/exchangeFrom))
                }
            }
        })()
    },[exchangeFrom, exchangeTo, currencyTypeTo, currencyTypeFrom])
    const { showLoad, setShowAppBar, setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode&&router.query.id!=='new') {
                let cashExchange = (await getCashExchange({_id: router.query.id})).cashExchange
                if(cashExchange) {
                    setExchangeFrom(cashExchange.exchangeFrom)
                    setCurrencyTypeFrom(cashExchange.currencyTypeFrom)
                    setExchangeTo(cashExchange.exchangeTo)
                    setCurrencyTypeTo(cashExchange.currencyTypeTo)
                    setExchangeRate(cashExchange.exchangeRate)
                    setCurrencyTypeRate(cashExchange.currencyTypeRate)
                    setComment(cashExchange.comment)
                    setNote(cashExchange.note)
                    setCashExchange(cashExchange)
                }
            }
            else initialRender.current = false
        })()
    },[pinCode])
    let noteRef = useRef(null);
    return (
        <App pageName={router.query.id==='new'?'Добавить':cashExchange?cashExchange.number:'Ничего не найдено'}>
            <Head>
                <title>{router.query.id==='new'?'Добавить':cashExchange?cashExchange.number:'Ничего не найдено'}</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение'/>
                <meta property='og:title' content={router.query.id==='new'?'Добавить':cashExchange?cashExchange.number:'Ничего не найдено'} />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/cashexchange/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/cashexchange/${router.query.id}`}/>
            </Head>
            {
                cashExchange?
                    <>
                    <Card>
                        <CardContent className={classes.page}>
                            {
                                cashExchange.number?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Номер:</div>&nbsp;
                                        <div className={classes.value}>{cashExchange.number}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                cashExchange.createdAt?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Дата конвертации:&nbsp;</div>
                                        <div className={classes.value}>{pdDDMMYYHHMM(cashExchange.createdAt)}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                router.query.id==='new'?
                                    <>
                                    <div className={classes.row}>
                                        <TextField
                                            type={isMobileApp?'number':'text'}
                                            size='small'
                                            label='Продажа'
                                            value={exchangeFrom}
                                            className={classes.inputHalf}
                                            onChange={(event)=>{
                                                setExchangeFrom(inputFloat(event.target.value))
                                            }}
                                            inputProps={{
                                                'aria-label': 'description',
                                            }}
                                        />
                                        <FormControl size='small' className={classes.inputHalf}>
                                            <InputLabel>Тип валюты</InputLabel>
                                            <Select
                                                value={currencyTypeFrom}
                                                onChange={handleCurrencyTypeFrom}
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
                                    <div className={classes.row}>
                                        <TextField
                                            type={isMobileApp?'number':'text'}
                                            size='small'
                                            label='Покупка'
                                            className={classes.inputHalf}
                                            value={exchangeTo}
                                            onChange={(event)=>{
                                                setExchangeTo(inputFloat(event.target.value))
                                            }}
                                            inputProps={{
                                                'aria-label': 'description',
                                            }}
                                        />
                                        <FormControl size='small' className={classes.inputHalf}>
                                            <InputLabel>Тип валюты</InputLabel>
                                            <Select
                                                value={currencyTypeTo}
                                                onChange={handleCurrencyTypeTo}
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
                                    {
                                        exchangeRate&&currencyTypeRate.length&&exchangeRate.toString()!=='Infinity'?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>Курс:&nbsp;</div>
                                                <div className={classes.value}>{
                                                    `1 ${currencyTypeRate!==currencyTypeFrom?currencyTypeFrom:currencyTypeTo} = ${exchangeRate} ${currencyTypeRate}`
                                                }</div>
                                            </div>
                                            :
                                            null
                                    }
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
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Записка:</div>
                                        <div className={classes.noteImageList}>
                                            <img className={classes.noteImage} src='/static/add.png' onClick={()=>{noteRef.current.click()}} />
                                            {note.map((element, idx)=> <div className={classes.noteImageDiv}>
                                                <img className={classes.noteImage} src={element} onClick={()=>{
                                                    setShowAppBar(false)
                                                    setShowLightbox(true)
                                                    setImagesLightbox(note)
                                                    setIndexLightbox(idx)
                                                }}/>
                                                <div className={classes.noteImageButton} style={{background: 'red'}} onClick={()=>{
                                                    note.splice(idx, 1)
                                                    setNote([...note])
                                                }}>X</div>
                                            </div>)}
                                        </div>
                                    </div>
                                    </>
                                    :
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Снабженец:&nbsp;</div>
                                        <div className={classes.value}>{cashExchange.supplier.name}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Продажа:&nbsp;</div>
                                        <div className={classes.value}>{exchangeFrom}&nbsp;{currencyTypeFrom}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Покупка:&nbsp;</div>
                                        <div className={classes.value}>{exchangeTo}&nbsp;{currencyTypeTo}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Курс:&nbsp;</div>
                                        <div className={classes.value}>{
                                            `1 ${currencyTypeRate!==currencyTypeFrom?currencyTypeFrom:currencyTypeTo} = ${exchangeRate} ${currencyTypeRate}`
                                        }</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Основание/Примечание:&nbsp;</div>
                                        <div className={classes.value}>{comment}</div>
                                    </div>
                                    {
                                        note.length?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>Записка:</div>
                                                <div className={classes.noteImageList}>
                                                    {note.map((element, idx)=>
                                                        <img className={classes.noteImage} src={element} onClick={()=>{
                                                            setShowAppBar(false)
                                                            setShowLightbox(true)
                                                            setImagesLightbox(note)
                                                            setIndexLightbox(idx)
                                                        }}/>)}
                                                </div>
                                            </div>
                                    :
                                    null
                                }
                                </>
                            }
                        </CardContent>
                    </Card>
                    <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                        {
                            router.query.id === 'new' ?
                                <div className={isMobileApp ? classes.bottomDivM : classes.bottomDivD}>
                                    <Button color='primary' onClick={() => {
                                        if (currencyTypeTo!==currencyTypeFrom&&exchangeTo.length&&exchangeFrom.length&&currencyTypeTo.length&&currencyTypeFrom.length&&note.length) {
                                            const action = async () => {
                                                await addCashExchange({
                                                    exchangeFrom: checkFloat(exchangeFrom),
                                                    currencyTypeFrom,
                                                    exchangeTo: checkFloat(exchangeTo),
                                                    currencyTypeTo,
                                                    comment,
                                                    note
                                                })
                                                Router.push(`/cashexchanges`)
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
                            router.query.id!=='new'&&'обработка'!==cashExchange.status?
                                <>
                                <Button size='small' color='primary' onClick={async()=>{
                                    await showLoad(true)
                                    window.open(((await getUnloadingCashExchange({
                                        _id: router.query.id,
                                    })).unloadingCashExchange).data, '_blank');
                                    await showLoad(false)
                                }}>
                                    Выгрузить
                                </Button>
                                <Button color='secondary' onClick={()=>{
                                       const action = async ()=>{
                                            await deleteCashExchange([cashExchange._id])
                                            Router.push(`/cashexchanges`)
                                        }
                                        setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                        showMiniDialog(true)
                                }}>
                                    Удалить
                                </Button>
                                </>
                                :
                                null
                        }
                    </div>
                    </>
                    :
                    null
            }
            <input
                ref={noteRef}
                accept='image/*'
                style={{ display: 'none' }}
                id='contained-button-file'
                type='file'
                onChange={handleChangeNote}
            />
        </App>
    )
})

CashExchange.getInitialProps = async function(ctx) {
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
                        cashExchange:
                            {
                                exchangeFrom: 0,
                                currencyTypeFrom: '',
                                exchangeTo: 0,
                                currencyTypeTo: '',
                                exchangeRate: '',
                                currencyTypeRate: '',
                                comment: '',
                                note: []
                            }
                    }
                :
                    await getCashExchange({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
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

export default connect(mapStateToProps, mapDispatchToProps)(CashExchange);