import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import waybillStyle from '../../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import { addWaybill, setWaybill, getWaybill, getUnloadingWaybill, deleteWaybill } from '../../src/gql/waybill'
import { getSellers } from '../../src/gql/seller'
import { getApplicationsForWaybill } from '../../src/gql/application'
import TextField from '@material-ui/core/TextField';
import { urlMain } from '../../redux/constants/other'
import Confirmation from '../../components/dialog/Confirmation'
import { useRouter } from 'next/router'
import * as snackbarActions from '../../redux/actions/snackbar'
import Router from 'next/router'
import { getClientGqlSsr } from '../../src/getClientGQL'
import { pdDDMMYYHHMM, checkFloat, inputFloat, currencys } from '../../src/lib'
import initialApp from '../../src/initialApp'
import Autocomplete from '@material-ui/lab/Autocomplete';
import Link from 'next/link';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import * as appActions from '../../redux/actions/app'
import { resizeImg } from '../../src/resizeImg'

const Waybill = React.memo((props) => {
    const { profile, pinCode } = props.user;
    const classes = waybillStyle();
    const { data } = props;
    const router = useRouter()
    const { showLoad, setShowAppBar, setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const initialRender = useRef(true);
    let [waybill, _setWaybill] = useState(data.waybill?data.waybill:undefined);
    let [applicationsForWaybill, setApplicationForWaybill] = useState(data.applicationsForWaybill?data.applicationsForWaybill:[]);
    let [sellers, setSellers] = useState(data.sellers?data.sellers.map(seller=>seller.name):[]);
    let [application, setApplication] = useState(waybill?waybill.application:undefined);
    let [seller, setSeller] = useState(waybill?waybill.seller:undefined);
    let [patent, setPatent] = useState(waybill?waybill.patent:[]);
    let [comment, setComment] = useState(waybill?waybill.comment:'');
    let [items, setItems] = useState(waybill?waybill.items:[]);
    let handleChangePatent = (async (event) => {
        if(event.target.files[0].size/1024/1024<50){
            setPatent([...patent, await resizeImg(event.target.files[0])])
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    useEffect(()=>{
        let amount1 = {}, amount = []
        for(let i = 0; i<items.length; i++){
            if(items[i].status!=='отмена') {
                if (!amount1[items[i].currency])
                    amount1[items[i].currency] = 0
                amount1[items[i].currency]+=items[i].count*items[i].price
            }
        }
        const keys = Object.keys(amount1)
        for(let i = 0; i<keys.length; i++){
            amount.push({name: keys[i], value: checkFloat(amount1[keys[i]])})
        }
        setAmount([...amount])
    },[items])
    let patentRef = useRef(null);
    let [amount, setAmount] = useState(waybill?waybill.amount:[]);
    let [acceptSpecialist, setAcceptSpecialist] = useState(waybill?waybill.acceptSpecialist:undefined);
    const statusColor = {
        'обработка': 'orange',
        'принят': 'green'
    }
    let [zoom, setZoom] = useState(1);
    let [showTable, setShowTable] = useState(true);
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                if(router.query.id!=='new') {
                    waybill = (await getWaybill({_id: router.query.id})).waybill
                    if(waybill) {
                        setApplication(waybill.application)
                        setSeller(waybill.seller)
                        setPatent(waybill.patent)
                        setComment(waybill.comment)
                        setItems(waybill.items)
                        setAmount(waybill.amount)
                        setAcceptSpecialist(waybill.acceptSpecialist)
                        _setWaybill(waybill)
                    }
                }
                setSellers((await getSellers({search: ''})).sellers.map(seller=>seller.name))
                setApplicationForWaybill((await getApplicationsForWaybill()).applicationsForWaybill)
            } else if(initialRender.current) {
                initialRender.current = false;
            }
        })()
    },[pinCode])
    return (
        <App pageName={router.query.id==='new'?'Добавить':waybill?waybill.number:'Ничего не найдено'}>
            <Head>
                <title>{router.query.id==='new'?'Добавить':waybill?waybill.number:'Ничего не найдено'}</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение'/>
                <meta property='og:title' content={router.query.id==='new'?'Добавить':waybill?waybill.number:'Ничего не найдено'} />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property="og:url" content={`${urlMain}/waybill/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/waybill/${router.query.id}`}/>
            </Head>
            <Card>
                {
                    waybill?
                        <CardContent className={classes.page}>
                            {
                                waybill.number?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Номер:</div>&nbsp;
                                        <div className={classes.value}>{waybill.number}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                waybill.status?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Статус:</div>&nbsp;
                                        <div className={classes.value} style={{color: statusColor[waybill.status]}}>{waybill.status}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                waybill.createdAt?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Время подачи:&nbsp;</div>
                                        <div className={classes.value}>{pdDDMMYYHHMM(waybill.createdAt)}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                !['admin', 'менеджер', 'снабженец'].includes(profile.role)||(waybill.status&&waybill.status!=='обработка')?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Продавец:&nbsp;</div>
                                        <div className={classes.value}>{seller}</div>
                                    </div>
                                    :
                                    <div className={classes.row}>
                                        <Autocomplete
                                            freeSolo={true}
                                            size='small'
                                            className={classes.input}
                                            options={sellers}
                                            value={seller}
                                            getOptionLabel={option => option}
                                            onChange={(event, newValue) => {
                                                setSeller(newValue)
                                            }}
                                            onInputChange={(event, newInputValue) => {
                                                setSeller(newInputValue);
                                            }}
                                            noOptionsText='Ничего не найдено'
                                            renderInput={params => (
                                                <TextField {...params} label='Продавец' variant='outlined' fullWidth />
                                            )}
                                        />
                                    </div>
                            }
                            {
                                router.query.id==='new'?
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Патент:</div>
                                        <div className={classes.noteImageList}>
                                            <img className={classes.noteImage} src='/static/add.png' onClick={()=>{patentRef.current.click()}} />
                                            {patent.map((element, idx)=> <div className={classes.noteImageDiv}>
                                                <img className={classes.noteImage} src={element} onClick={()=>{
                                                    setShowAppBar(false)
                                                    setShowLightbox(true)
                                                    setImagesLightbox(patent)
                                                    setIndexLightbox(idx)
                                                }}/>
                                                <div className={classes.noteImageButton} style={{background: 'red'}} onClick={()=>{
                                                    patent.splice(idx, 1)
                                                    setPatent([...patent])
                                                }}>X</div>
                                            </div>)}
                                        </div>
                                    </div>
                                    <Autocomplete
                                        size='small'
                                        className={classes.input}
                                        options={applicationsForWaybill}
                                        getOptionLabel={option => option.number}
                                        value={application}
                                        onChange={(event, newValue) => {
                                            setApplication(newValue)
                                            setItems([...newValue.items])
                                        }}
                                        noOptionsText='Ничего не найдено'
                                        renderInput={params => (
                                            <TextField {...params} label='Заявка' variant='outlined' fullWidth />
                                        )}
                                    />
                                    </>
                                    :
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Патент:&nbsp;</div>
                                        {
                                            patent?
                                                <div className={classes.nameField} style={{color: '#009ADC', cursor: 'pointer'}} onClick={()=>{
                                                    setShowAppBar(false)
                                                    setShowLightbox(true)
                                                    setImagesLightbox([patent])
                                                    setIndexLightbox(0)
                                                }}>
                                                    Посмотреть
                                                </div>
                                                :
                                                null
                                        }
                                        {
                                            ['admin', 'менеджер', 'снабженец'].includes(profile.role) && waybill.status === 'обработка' ?
                                                <div className={classes.nameField}
                                                     style={{color: patent ? '#009ADC' : 'red', cursor: 'pointer'}}
                                                     onClick={() => {
                                                         patentRef.current.click()
                                                     }}>
                                                    Загрузить
                                                </div>
                                                :
                                                null
                                        }
                                    </div>
                                    {
                                        patent.length || ['admin', 'менеджер', 'снабженец'].includes(profile.role) && waybill.status === 'обработка' ?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>Патент:</div>
                                                <div className={classes.noteImageList}>
                                                    {
                                                        ['admin', 'менеджер', 'снабженец'].includes(profile.role) && waybill.status === 'обработка' ?
                                                            <img className={classes.noteImage} src='/static/add.png'
                                                                 onClick={() => {
                                                                     patentRef.current.click()
                                                                 }}/>
                                                            :
                                                            null
                                                    }
                                                    {patent.map((element, idx) => <div className={classes.noteImageDiv}>
                                                        <img className={classes.noteImage} src={element}
                                                             onClick={() => {
                                                                 setShowAppBar(false)
                                                                 setShowLightbox(true)
                                                                 setImagesLightbox(patent)
                                                                 setIndexLightbox(idx)
                                                             }}/>
                                                        {
                                                            ['admin', 'менеджер', 'снабженец'].includes(profile.role) && waybill.status === 'обработка' ?
                                                                <div className={classes.noteImageButton}
                                                                     style={{background: 'red'}} onClick={() => {
                                                                    patent.splice(idx, 1)
                                                                    setPatent([...patent])
                                                                }}>X</div>
                                                                :
                                                                null
                                                        }
                                                    </div>)}
                                                </div>
                                            </div>
                                            :
                                            null
                                    }
                                    <Link href='/application/[id]' as={`/application/${waybill.application._id}`}>
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>Заявка:&nbsp;</div>
                                            <a>
                                                <div className={classes.value}>{waybill.application.number}</div>
                                            </a>
                                        </div>
                                    </Link>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Снабженец:&nbsp;</div>
                                        <div className={classes.value}>{waybill.supplier.name}</div>
                                    </div>
                                    </>
                            }
                            {
                                application?
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Сумма:&nbsp;</div>
                                        <div className={classes.column}>
                                            {
                                                amount.map((amount, idx) =>
                                                    <div key={idx} className={classes.value}>{`${amount.value} ${amount.name}`}</div>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className={classes.tableName}>
                                        <div className={classes.nameField}>Товары&nbsp;({items.length}):&nbsp;</div>
                                        {
                                            isMobileApp?
                                                <>
                                                <div onClick={()=>{if(zoom>0.1){setZoom(zoom-=0.1)}}} className={classes.zoomBtn}>-</div>
                                                <div onClick={()=>{if(zoom<1){setZoom(zoom+=0.1)}}} className={classes.zoomBtn}>+</div>
                                                </>
                                                :
                                                null
                                        }
                                        &nbsp;&nbsp;&nbsp;
                                        <Button size='small' color='primary' onClick={()=>{
                                            setShowTable(!showTable)
                                        }}>
                                            {showTable?'Спрятать':'Показать'}
                                        </Button>
                                    </div>
                                    {
                                        showTable?
                                            <div className={classes.table} style={{zoom: zoom}}>
                                                <div className={classes.tableRow} style={{width: isMobileApp?['admin', 'менеджер', 'снабженец'].includes(profile.role)&&(!waybill.status||'обработка'===waybill.status)?894:810:'100%'}}>
                                                    <div className={classes.cell} style={{width: 20}}><div className={classes.nameTable}>№</div></div>
                                                    <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - ${['admin', 'менеджер', 'снабженец'].includes(profile.role)&&(!waybill.status||'обработка'===waybill.status)?'948':'864'}px) / 2)`}}><div className={classes.nameTable}>Товар</div></div>
                                                    <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>Кол-во</div></div>
                                                    <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>Цена</div></div>
                                                    <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>Сумма</div></div>
                                                    <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>Валюта</div></div>
                                                    <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>Ед. изм.</div></div>
                                                    <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - ${['admin', 'менеджер', 'снабженец'].includes(profile.role)&&(!waybill.status||'обработка'===waybill.status)?'948':'864'}px) / 2)`}}><div className={classes.nameTable}>Примечание</div></div>
                                                    {
                                                        ['admin', 'менеджер', 'снабженец'].includes(profile.role)&&(!waybill.status||'обработка'===waybill.status)?
                                                            <div className={classes.cell} style={{width: 64}}/>
                                                            :
                                                            null
                                                    }
                                                </div>
                                                {items.map((item, idx) =>
                                                    <div className={classes.tableRow} key={idx} style={{width: isMobileApp?780:'100%'}}>
                                                        <div className={classes.cell} style={{width: 20}}>
                                                            <div className={classes.nameTable}>
                                                                {idx+1}
                                                            </div>
                                                        </div>
                                                        <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - ${['admin', 'менеджер', 'снабженец'].includes(profile.role)&&(!waybill.status||'обработка'===waybill.status)?'948':'864'}px) / 2)`}}>
                                                            {
                                                                item.edit&&(!waybill.status||'обработка'===waybill.status) ?
                                                                    <Autocomplete
                                                                        value={item.name}
                                                                        freeSolo={true}
                                                                        size='small'
                                                                        className={classes.inputTable}
                                                                        options={application.items.filter(item=>!items.map(item1=>item1.name).includes(item.name))}
                                                                        getOptionLabel={option => option.name}
                                                                        onChange={(event, newValue) => {
                                                                            if(newValue) {
                                                                                items[idx] = newValue
                                                                            }
                                                                            else {
                                                                                items[idx].name = ''
                                                                                items[idx].currency = ''
                                                                                items[idx].count = 0
                                                                                items[idx].unit = ''
                                                                                items[idx].GUID = ''
                                                                                items[idx].price = 0
                                                                            }
                                                                            setItems([...items])
                                                                        }}
                                                                        noOptionsText='Ничего не найдено'
                                                                        renderInput={params => (
                                                                            <TextField {...params} label='Товар' variant='outlined' fullWidth/>
                                                                        )}
                                                                    />
                                                                    :
                                                                    <Input
                                                                        className={classes.inputTable}
                                                                        value={item.name}
                                                                        inputProps={{
                                                                            'aria-label': 'description',
                                                                            readOnly: true,
                                                                        }}
                                                                    />
                                                            }
                                                        </div>
                                                        <div className={classes.cell} style={{width: 60}}>
                                                            <Input
                                                                className={classes.inputTable}
                                                                type={isMobileApp?'number':'text'}
                                                                inputProps={{
                                                                    readOnly: !['admin', 'менеджер', 'снабженец'].includes(profile.role)||(waybill.status&&'обработка'!==waybill.status)
                                                                }}
                                                                value={item.count}
                                                                onChange={(event)=>{
                                                                    items[idx].count = inputFloat(event.target.value)
                                                                    setItems([...items])
                                                                }}
                                                            />
                                                        </div>
                                                        <div className={classes.cell} style={{width: 60}}>
                                                            <Input
                                                                className={classes.inputTable}
                                                                inputProps={{
                                                                    readOnly: !['admin', 'менеджер', 'снабженец'].includes(profile.role)||(waybill.status&&'обработка'!==waybill.status)
                                                                }}
                                                                value={item.price}
                                                                type={isMobileApp?'number':'text'}
                                                                onChange={(event)=>{
                                                                    items[idx].price = inputFloat(event.target.value)
                                                                    setItems([...items])
                                                                }}
                                                            />
                                                        </div>
                                                        <div className={classes.cell} style={{width: 70}}>
                                                            <Input
                                                                className={classes.inputTable}
                                                                inputProps={{
                                                                    readOnly: true
                                                                }}
                                                                value={checkFloat(item.count*item.price)}
                                                            />
                                                        </div>
                                                        <div className={classes.cell} style={{width: 70}}>
                                                            <Select
                                                                className={classes.inputTable}
                                                                value={item.currency}
                                                                onChange={(event)=>{
                                                                    items[idx].currency = event.target.value
                                                                    setItems([...items])
                                                                }}
                                                                inputProps={{
                                                                    'aria-label': 'description',
                                                                    readOnly: !['admin', 'менеджер', 'снабженец'].includes(profile.role)||(waybill.status&&'обработка'!==waybill.status)
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
                                                        </div>
                                                        <div className={classes.cell} style={{width: 70}}>
                                                            <Input
                                                                className={classes.inputTable}
                                                                inputProps={{
                                                                    readOnly: true
                                                                }}
                                                                value={item.unit}
                                                            />
                                                        </div>
                                                        <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - ${['admin', 'менеджер', 'снабженец'].includes(profile.role)&&(!waybill.status||'обработка'===waybill.status)?'948':'864'}px) / 2)`}}>
                                                            <Input
                                                                className={classes.inputTable}
                                                                inputProps={{
                                                                    readOnly: !['admin', 'менеджер', 'снабженец'].includes(profile.role)||(waybill.status&&'обработка'!==waybill.status)
                                                                }}
                                                                multiline={true}
                                                                value={item.comment}
                                                                onChange={(event)=>{
                                                                    items[idx].comment = event.target.value
                                                                    setItems([...items])
                                                                }}
                                                            />
                                                        </div>
                                                        {
                                                            ['admin', 'менеджер', 'снабженец'].includes(profile.role)&&(!waybill.status||'обработка'===waybill.status)?
                                                                <div className={classes.cell} style={{width: 64, fontSize: '0.875rem'}}>
                                                                    <Button color='secondary' size='small' onClick={()=>{
                                                                        items.splice(idx, 1)
                                                                        setItems([...items])
                                                                    }}>
                                                                        Удалить
                                                                    </Button>
                                                                </div>
                                                                :
                                                                null
                                                        }
                                                    </div>
                                                )}

                                            </div>
                                            :
                                            <div className={classes.table}/>
                                    }
                                    {
                                        'снабженец'===profile.role&&(!waybill.status||'обработка'===waybill.status)?
                                            <>
                                            <Button color='primary' size='small' onClick={()=>{
                                                items = [...items, {
                                                    name: '',
                                                    unit: 'шт',
                                                    currency: 'сом',
                                                    price: 0,
                                                    count: 0,
                                                    comment: '',
                                                    status: 'принят',
                                                    edit: true,
                                                    GUID: ''
                                                }]
                                                setItems(items)
                                            }}>
                                                Добавить товар
                                            </Button>
                                            </>
                                            :
                                            null
                                    }
                                    </>
                                    :
                                    null
                            }
                            {
                                router.query.id === 'new' ?
                                    null
                                    :
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Подтверждения:&nbsp;</div>
                                    </div>
                                    <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                        <div className={classes.nameField}>
                                            {`Специалист${waybill.acceptSpecialist?` ${pdDDMMYYHHMM(waybill.acceptSpecialist)}`:''}`}:&nbsp;
                                        </div>
                                        <Checkbox
                                            size='small'
                                            checked={acceptSpecialist}
                                            onChange={() => {
                                                if((['admin', 'менеджер'].includes(profile.role)||profile.addApplication)&&!waybill.acceptSpecialist) {
                                                    setAcceptSpecialist(!acceptSpecialist)
                                                }
                                            }}
                                            color='primary'
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                        <Input
                                            className={classes.inputTable}
                                            inputProps={{
                                                readOnly: !profile.addApplication || waybill.acceptSpecialist
                                            }}
                                            multiline={true}
                                            value={comment}
                                            onChange={(event) => {
                                                setComment(event.target.value)
                                            }}
                                        />
                                    </div>
                                    </>
                            }
                            <div className={isMobileApp ? classes.bottomDivM : classes.bottomDivD}>
                                {
                                    router.query.id === 'new' || waybill.status === 'обработка' ?
                                        <Button color='primary' onClick={() => {
                                            let check = !((items.filter(item => !item.name.length || !item.unit.length || !item.price || !item.count)).length > 0)
                                            if (items.length > 0 && check && application) {
                                                const action = async () => {
                                                    if (router.query.id === 'new') {
                                                        items = items.map(item => {
                                                            return {
                                                                name: item.name,
                                                                unit: item.unit,
                                                                price: checkFloat(item.price),
                                                                count: checkFloat(item.count),
                                                                comment: item.comment,
                                                                currency: item.currency,
                                                                status: item.status,
                                                                GUID: item.GUID
                                                            }
                                                        })
                                                        await addWaybill({
                                                            patent: patent,
                                                            items: items,
                                                            application: application._id,
                                                            seller: seller
                                                        })
                                                    }
                                                    else {
                                                        items = items.map(item => {
                                                            return {
                                                                name: item.name,
                                                                unit: item.unit,
                                                                price: checkFloat(item.price),
                                                                count: checkFloat(item.count),
                                                                comment: item.comment,
                                                                currency: item.currency,
                                                                status: item.status,
                                                                GUID: item.GUID
                                                            }
                                                        })
                                                        let element = {
                                                            _id: router.query.id,
                                                            items: items
                                                        }
                                                        if (seller && seller !== waybill.seller) element.seller = seller
                                                        if (patent) element.patent = patent
                                                        if (comment !== waybill.comment) element.comment = comment
                                                        if (acceptSpecialist && acceptSpecialist !== waybill.acceptSpecialist) element.acceptSpecialist = acceptSpecialist
                                                        await setWaybill(element)
                                                    }
                                                    Router.push(`/waybills`)
                                                }
                                                setMiniDialog('Вы уверены?', <Confirmation action={action}/>)
                                                showMiniDialog(true)
                                            } else
                                                showSnackBar('Заполните все поля')
                                        }}>
                                            Сохранить
                                        </Button>
                                        :
                                        null
                                }
                                {
                                    waybill.status==='обработка'&&['admin', 'менеджер', 'снабженец'].includes(profile.role)?
                                        <Button size='small' color='primary' onClick={()=>{
                                            const action = async() => {
                                                await deleteWaybill([router.query.id])
                                                Router.push(`/waybills`)
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
                                    router.query.id!=='new'&&'обработка'!==waybill.status?
                                        <Button size='small' color='primary' onClick={async()=>{
                                            await showLoad(true)
                                            window.open(((await getUnloadingWaybill({
                                                _id: router.query.id,
                                            })).unloadingWaybill).data, '_blank');
                                            await showLoad(false)
                                        }}>
                                            Выгрузить
                                        </Button>
                                        :
                                        null
                                }
                            </div>
                            <input
                                ref={patentRef}
                                accept='image/*'
                                style={{ display: 'none' }}
                                id='contained-button-file'
                                type='file'
                                onChange={handleChangePatent}
                            />
                        </CardContent>
                        :
                        null
                }
            </Card>
        </App>
    )
})

Waybill.getInitialProps = async function(ctx) {
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
    return {
        data: {
            ...(ctx.query.id==='new'?
                    {
                        waybill:
                            {
                                application: undefined,
                                seller: '',
                                patent: [],
                                items: [],
                                amount: [],
                            }
                    }
                :
                    await getWaybill({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
            ),
            ...await getApplicationsForWaybill(ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getSellers({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
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

export default connect(mapStateToProps, mapDispatchToProps)(Waybill);