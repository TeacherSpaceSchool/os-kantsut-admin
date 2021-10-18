import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import applicationStyle from '../../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import { addApplication, getUnloadingApplication, setApplication, getApplication, deleteApplication } from '../../src/gql/application'
import { getCategorys } from '../../src/gql/category'
import { getDivisions } from '../../src/gql/division'
import { getSubdivisions } from '../../src/gql/subdivision'
import { getUnits } from '../../src/gql/unit'
import { getItems } from '../../src/gql/item'
import { resizeImg } from '../../src/resizeImg'
import SetDate from '../../components/dialog/SetDate'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { urlMain } from '../../redux/constants/other'
import Confirmation from '../../components/dialog/Confirmation'
import SetSuplier from '../../components/dialog/SetSuplier'
import { useRouter } from 'next/router'
import * as snackbarActions from '../../redux/actions/snackbar'
import Router from 'next/router'
import { getClientGqlSsr } from '../../src/getClientGQL'
import {pdDDMMYYHHMM, checkFloat, differenceDates, currencys, inputFloat} from '../../src/lib'
import initialApp from '../../src/initialApp'
import * as appActions from '../../redux/actions/app'

const Application = React.memo((props) => {
    const { profile, pinCode } = props.user;
    const classes = applicationStyle();
    const { data } = props;
    const router = useRouter()
    const { isMobileApp, date } = props.app;
    const initialRender = useRef(true);
    const { showSnackBar } = props.snackbarActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showLoad, setShowAppBar, setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;

    let [_application, _setApplication] = useState(data.application);
    let [categorys, setCategorys] = useState(data.categorys?data.categorys:[]);
    let [units, setUnits] = useState(data.units?data.units:[]);
    let [divisions, setDivisions] = useState(data.divisions?data.divisions:[]);

    let [itemsName, setItemsName] = useState([]);
    let [category, setCategory] = useState(data.application?data.application.category:undefined);
    let handleCategory = async (category) => {
        if(category) {
            setItemsName((await getItems({category: category._id, search: ''})).items)
            setCategory(category)
        }
    };
    let [budget, setBudget] = useState(data.application?data.application.budget:true);
    let [term, setTerm] = useState(data.application?data.application.term:new Date());
    useEffect(()=>{
        if(!initialRender.current) {
            term = date
            let now = new Date()
            if(term.getDate()>=now.getDate()) {
                term.setMinutes(now.getMinutes())
                term.setHours(now.getHours())
                setTerm(term)
            }
        }
    },[date])
    let [note, setNote] = useState(data.application?data.application.note:[]);
    let handleChangeNote = (async (event) => {
        if(event.target.files[0].size/1024/1024<50){
            setNote([...note, await resizeImg(event.target.files[0])])
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    const paymentTypes = ['перечисления', 'наличные', 'бартер']
    let [paymentType, setPaymentType] = useState(data.application?data.application.paymentType:'перечисления');
    let handlePaymentType = (async (event) => {
        setPaymentType(event.target.value)
    })
    let [comment, setComment] = useState(data.application?data.application.comment:'');
    let [division, setDivision] = useState(data.application?data.application.division:undefined);
    let handleDivision = async (division) => {
        setSubdivision(undefined)
        setDivision(division)
        if(division) {
            setSubdivisions((await getSubdivisions({search: '', division: division._id})).subdivisions)
        }
        else {
            setSubdivisions([])
        }
    };
    let [subdivision, setSubdivision] = useState(data.application?data.application.subdivision:undefined);
    let handleSubdivision = async (subdivision) => {
        if(subdivision) {
            setSubdivision(subdivision)
        }
    };
    let [subdivisions, setSubdivisions] = useState([]);
    let [official, setOfficial] = useState(data.application?data.application.official:true);
    let [zoom1, setZoom1] = useState(1);
    let [showTable1, setShowTable1] = useState(true);
    let [zoom2, setZoom2] = useState(1);
    let [showTable2, setShowTable2] = useState(true);
    let [amount, setAmount] = useState(data.application?data.application.amount:[]);
    let [supplier, setSupplier] = useState(data.application?data.application.supplier:undefined);
    let [items, setItems] = useState(data.application?data.application.items:[]);
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
    let noteRef = useRef(null);
    const difference = differenceDates(new Date(term), new Date())
    let [routes, setRoutes] = useState(data.application?data.application.routes:[]);
    const statusColor = {
        'обработка': 'orange',
        'принят': 'blue',
        'выполнен': 'green',
        'отмена': 'red'
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode&&router.query.id==='new') {
                localStorage.application = JSON.stringify({
                    category,
                    items
                })
            }
        })()
    },[category, items])
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                if(router.query.id!=='new') {
                    _application = (await getApplication({_id: router.query.id})).application
                    setCategory(_application?_application.category:undefined)
                    setBudget(_application?_application.budget:true)
                    setNote(_application?_application.note:[])
                    setPaymentType(_application?_application.paymentType:'перечисления')
                    setComment(_application?_application.comment:'')
                    setDivision(_application?_application.division:undefined)
                    setSubdivision(_application?_application.subdivision:undefined)
                    setOfficial(_application?_application.official:true)
                    setAmount(_application?_application.amount:[])
                    setSupplier(_application?_application.supplier:undefined)
                    setItems(_application?_application.items:[])
                    setRoutes(_application?_application.routes:[])
                    setTerm(_application?_application.term:new Date())
                    _setApplication(_application)
                }
                else if(localStorage.application){
                    _application = JSON.parse(localStorage.application)
                    handleCategory(_application.category)
                    setItems(_application.items)
                }
                setCategorys((await getCategorys({search: ''}, )).categorys)
                setUnits((await getUnits({search: ''})).units)
                setDivisions((await getDivisions({search: ''})).divisions)
            }
            else if(initialRender.current) {
                initialRender.current = false;
            }
        })()
    },[pinCode])
    return (
        <App pageName={router.query.id==='new'?'Добавить':_application?_application.number:'Ничего не найдено'}>
            <Head>
                <title>{router.query.id==='new'?'Добавить':_application?_application.number:'Ничего не найдено'}</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение'/>
                <meta property='og:title' content={router.query.id==='new'?'Добавить':_application?_application.number:'Ничего не найдено'} />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/_application/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/_application/${router.query.id}`}/>
            </Head>
            <Card>
                {
                    _application?
                        <CardContent className={classes.page}>
                            {
                                _application.number?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Номер:</div>&nbsp;
                                        <div className={classes.value}>{_application.number}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                _application.status?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Статус:</div>&nbsp;
                                        <div className={classes.value} style={{color: statusColor[_application.status]}}>{_application.status}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                _application.createdAt?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Время подачи:&nbsp;</div>
                                        <div className={classes.value}>{pdDDMMYYHHMM(_application.createdAt)}</div>
                                    </div>
                                    :
                                    null
                            }
                            <div className={classes.row}
                                 onClick={()=>{if(!_application.status||['отмена', 'обработка'].includes(_application.status)){setMiniDialog('Дата', <SetDate/>);showMiniDialog(true);}}}
                                 style={{cursor: 'pointer', color: !_application.status||_application.status==='выполнен'?'black':difference<0?'red':difference<1?'yellow':'green'}}
                            >
                                <div className={classes.nameField}>Срок:&nbsp;</div>
                                <div className={classes.value}>{pdDDMMYYHHMM(term)}</div>
                            </div>
                            {
                                _application.dateClose?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Время закрытия:&nbsp;</div>
                                        <div className={classes.value}>{pdDDMMYYHHMM(_application.dateClose)}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                router.query.id==='new'?
                                    <>
                                    <div className={classes.row}>
                                        <Autocomplete
                                            size='small'
                                            className={classes.input}
                                            options={divisions}
                                            getOptionLabel={option => option.name}
                                            value={division}
                                            onChange={(event, newValue) => {
                                                handleDivision(newValue)
                                            }}
                                            disabled={router.query.id!=='new'}
                                            noOptionsText='Ничего не найдено'
                                            renderInput={params => (
                                                <TextField {...params} label='Подразделение' variant='outlined' fullWidth />
                                            )}
                                        />
                                    </div>
                                    {
                                        subdivisions.length?
                                            <div className={classes.row}>
                                                <Autocomplete
                                                    size='small'
                                                    className={classes.input}
                                                    options={subdivisions}
                                                    getOptionLabel={option => option.name}
                                                    value={subdivision}
                                                    onChange={(event, newValue) => {
                                                        handleSubdivision(newValue)
                                                    }}
                                                    disabled={router.query.id!=='new'}
                                                    noOptionsText='Ничего не найдено'
                                                    renderInput={params => (
                                                        <TextField {...params} label='Подразделение' variant='outlined' fullWidth />
                                                    )}
                                                />
                                            </div>
                                            :
                                            null
                                    }
                                    {
                                        !items.length||!category?
                                            <div className={classes.row}>
                                                <Autocomplete
                                                    size='small'
                                                    className={classes.input}
                                                    options={categorys}
                                                    getOptionLabel={option => option.name}
                                                    value={category}
                                                    onChange={(event, newValue) => {
                                                        handleCategory(newValue)
                                                    }}
                                                    disabled={router.query.id!=='new'}
                                                    noOptionsText='Ничего не найдено'
                                                    renderInput={params => (
                                                        <TextField {...params} label='Категория' variant='outlined' fullWidth />
                                                    )}
                                                />
                                            </div>
                                            :
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>Категория:&nbsp;</div>
                                                <div className={classes.value}>{category.name}</div>
                                            </div>
                                    }
                                    </>
                                    :
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Подразделение:&nbsp;</div>
                                        <div className={classes.value}>{division.name}</div>
                                    </div>
                                    {
                                        subdivision&&subdivision.length?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>Под-подразделение:&nbsp;</div>
                                                <div className={classes.value}>{subdivision}</div>
                                            </div>
                                            :
                                            null
                                    }
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Категория:&nbsp;</div>
                                        <div className={classes.value}>{_application.category.name}</div>
                                    </div>
                                    <div style={{cursor: 'pointer'}} className={classes.row} onClick={() => {
                                        if (_application.status === 'обработка') {
                                            setMiniDialog('Снабженец', <SetSuplier suppliers={division.suppliers} setSupplier={setSupplier}/>)
                                            showMiniDialog(true)
                                        }
                                    }}>
                                        <div className={classes.nameField}>Снабженец:&nbsp;</div>
                                        <div className={classes.value}>{supplier.name}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Специалист:&nbsp;</div>
                                        <div className={classes.value}>{_application.specialist.name}</div>
                                    </div>
                                    </>
                            }
                            {
                                !_application.status||['отмена', 'обработка'].includes(_application.status)&&profile.addApplication?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Обоснование:&nbsp;&nbsp;&nbsp;</div>
                                        <Input
                                            size='small'
                                            className={classes.inputTable}
                                            value={comment}
                                            style={{width: '100%', marginBottom: 10}}
                                            onChange={(event)=>{
                                                setComment(event.target.value)
                                            }}
                                        />
                                    </div>
                                    :
                                    comment.length?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>Обоснование:&nbsp;</div>
                                            <div className={classes.value}>{comment}</div>
                                        </div>
                                        :
                                        null
                            }
                            {
                                (router.query.id==='new'||'обработка'===_application.status)&&(['admin', 'менеджер', 'снабженец'].includes(profile.role)||profile.addApplication)?
                                    <>
                                    <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                        <div className={classes.nameField}>Официально:&nbsp;</div>
                                        <Checkbox
                                            size='small'
                                            checked={official}
                                            onChange={()=>{setOfficial(!official)}}
                                            color='primary'
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </div>
                                    <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                        <div className={classes.nameField}>По бюджету:&nbsp;</div>
                                        <Checkbox
                                            size='small'
                                            checked={budget}
                                            onChange={()=>{setBudget(!budget)}}
                                            color='primary'
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </div>
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
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Тип оплаты:&nbsp;</div>
                                        <Select
                                            style={{fontSize: '0.875rem'}}
                                            value={paymentType}
                                            onChange={handlePaymentType}
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
                                            {paymentTypes.map((paymentType) => (
                                                <MenuItem key={paymentType} value={paymentType}>
                                                    {paymentType}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </div>
                                    </>
                                    :
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>По бюджету:&nbsp;</div>
                                        <div className={classes.value}>{_application.budget?'да':'нет'}</div>
                                    </div>
                                    {
                                        note.length||_application.status==='обработка'?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>Записка:</div>
                                                <div className={classes.noteImageList}>
                                                    {
                                                        _application.status==='обработка'&&profile.addApplication?
                                                            <img className={classes.noteImage} src='/static/add.png' onClick={()=>{noteRef.current.click()}} />
                                                            :
                                                            null
                                                    }
                                                    {note.map((element, idx)=> <div className={classes.noteImageDiv}>
                                                        <img className={classes.noteImage} src={element} onClick={()=>{
                                                            setShowAppBar(false)
                                                            setShowLightbox(true)
                                                            setImagesLightbox(note)
                                                            setIndexLightbox(idx)
                                                        }}/>
                                                            {
                                                                _application.status==='обработка'&&profile.addApplication?
                                                                    <div className={classes.noteImageButton} style={{background: 'red'}} onClick={()=>{
                                                                        note.splice(idx, 1)
                                                                        setNote([...note])
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
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Официально:&nbsp;</div>
                                        <div className={classes.value}>{_application.official?'да':'нет'}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Тип оплаты:&nbsp;</div>
                                        <div className={classes.value}>{_application.paymentType}</div>
                                    </div>
                                    </>
                            }
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
                                <div className={classes.nameField}>
                                    Товары&nbsp;({items.length}):&nbsp;
                                </div>
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
                                        <div className={classes.tableRow} style={{width: isMobileApp?!_application.status||['отмена', 'обработка'].includes(_application.status)?894:810:'100%'}}>
                                            <div className={classes.cell} style={{width: 20}}><div className={classes.nameTable}>№</div></div>
                                            <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - ${!_application.status||['отмена', 'обработка'].includes(_application.status)?'948':'864'}px) / 2)`}}><div className={classes.nameTable}>Товар</div></div>
                                            <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>Кол-во</div></div>
                                            <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>Цена</div></div>
                                            <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>Сумма</div></div>
                                            <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>Валюта</div></div>
                                            <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>Ед. изм.</div></div>
                                            <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - ${!_application.status||['отмена', 'обработка'].includes(_application.status)?'948':'864'}px) / 2)`}}><div className={classes.nameTable}>Примечание</div></div>
                                            {
                                                !_application.status ||  ['отмена', 'обработка'].includes(_application.status) ?
                                                    <div className={classes.cell} style={{width: 64}}/>
                                                    :
                                                    null
                                            }
                                        </div>
                                        {items.map((item, idx) =>
                                            <div className={classes.tableRow} key={idx} style={{width: isMobileApp?!_application.status||['отмена', 'обработка'].includes(_application.status)?894:810:'100%'}}>
                                                <div className={classes.cell} style={{width: 20}}>
                                                    <div className={classes.nameTable}>
                                                        {idx+1}
                                                    </div>
                                                </div>
                                                <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - ${!_application.status ||  ['отмена', 'обработка'].includes(_application.status)?'948':'864'}px) / 2)`}}>
                                                    {
                                                        router.query.id === 'new' ?
                                                            <Autocomplete
                                                                size='small'
                                                                className={classes.inputTable}
                                                                options={itemsName}
                                                                value={item}
                                                                getOptionLabel={option => option.name}
                                                                onChange={(event, newValue) => {
                                                                    if(newValue) {
                                                                        items[idx].name = newValue.name
                                                                        items[idx].GUID = newValue.GUID
                                                                        if (newValue.lastPrice) {
                                                                            items[idx].lastPrice = newValue.lastPrice
                                                                            for(let i = 0; i<newValue.lastPrice.length; i++) {
                                                                                if(newValue.lastPrice[i].name===items[idx].currency){
                                                                                    items[idx].price = newValue.lastPrice[i].value
                                                                                }
                                                                            }
                                                                        }
                                                                        setItems([...items])
                                                                    }
                                                                }}
                                                                noOptionsText='Ничего не найдено'
                                                                renderInput={params => (
                                                                    <TextField {...params} variant='outlined' fullWidth/>
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
                                                        type={isMobileApp?'number':'text'}
                                                        className={classes.inputTable}
                                                        inputProps={{
                                                            readOnly: router.query.id!=='new'&& !['отмена', 'обработка'].includes(_application.status),
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
                                                        type={isMobileApp?'number':'text'}
                                                        className={classes.inputTable}
                                                        inputProps={{
                                                            readOnly: router.query.id!=='new'&&!['отмена', 'обработка'].includes(_application.status),
                                                        }}
                                                        value={item.price}
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
                                                            if (items[idx].lastPrice) {
                                                                for(let i = 0; i<items[idx].lastPrice.length; i++) {
                                                                    if(items[idx].lastPrice[i].name===event.target.value){
                                                                        items[idx].price = items[idx].lastPrice[i].value
                                                                    }
                                                                }
                                                            }
                                                            setItems([...items])
                                                        }}
                                                        inputProps={{
                                                            'aria-label': 'description',
                                                            readOnly: router.query.id!=='new'&&!['отмена', 'обработка'].includes(_application.status),
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
                                                    <Select
                                                        className={classes.inputTable}
                                                        value={item.unit}
                                                        onChange={(event)=>{
                                                            items[idx].unit = event.target.value
                                                            setItems([...items])
                                                        }}
                                                        inputProps={{
                                                            'aria-label': 'description',
                                                            readOnly: router.query.id!=='new',
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
                                                </div>
                                                <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - ${!_application.status ||  ['отмена', 'обработка'].includes(_application.status)?'948':'864'}px) / 2)`}}>
                                                    <Input
                                                        className={classes.inputTable}
                                                        inputProps={{
                                                            readOnly: router.query.id!=='new'&&! ['отмена', 'обработка'].includes(_application.status)
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
                                                    !_application.status||(['отмена', 'обработка'].includes(_application.status)&&(['admin', 'менеджер', 'снабженец'].includes(profile.role)||profile.addApplication))?
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
                            <br/>
                            {
                                router.query.id==='new'?
                                    <>
                                    <Button color='primary' size='small' onClick={()=>{
                                        items = [...items, {
                                            name: '',
                                            unit: 'шт',
                                            currency: 'сом',
                                            price: 0,
                                            count: 0,
                                            comment: '',
                                            GUID: '',
                                            status: 'принят'
                                        }]
                                        setItems(items)
                                    }}>
                                        Добавить товар
                                    </Button>
                                    </>
                                    :
                                    null
                            }
                            {
                                router.query.id === 'new' ?
                                    null
                                    :
                                    <>
                                    <div className={classes.tableName}>
                                        <div className={classes.nameField}>
                                            Подтверждения&nbsp;({routes.length}):&nbsp;
                                        </div>
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
                                                <div className={classes.tableRow} style={{width: isMobileApp ? 540 : '100%'}}>
                                                    <div className={classes.cell} style={{width: 20}}>
                                                        <div className={classes.nameTable}>№</div>
                                                    </div>
                                                    <div className={classes.cell}
                                                         style={{width: isMobileApp ? 210 : 'calc((100vw - 634px)/2)'}}>
                                                        <div className={classes.nameTable}>Роль</div>
                                                    </div>
                                                    <div className={classes.cell} style={{width: 80}}>
                                                        <div className={classes.nameTable}>Принят</div>
                                                    </div>
                                                    <div className={classes.cell} style={{width: 80}}>
                                                        <div className={classes.nameTable}>Отмена</div>
                                                    </div>
                                                    <div className={classes.cell}
                                                         style={{width: isMobileApp ? 150 : 'calc((100vw - 634px)/2)'}}>
                                                        <div className={classes.nameTable}>Коментарий</div>
                                                    </div>
                                                </div>
                                                {routes.map((route, idx) =>
                                                    <div className={classes.tableRow} key={idx}
                                                         style={{width: isMobileApp ? 540 : '100%'}}>
                                                        <div className={classes.cell} style={{width: 20}}>
                                                            <div className={classes.nameTable}>
                                                                {idx + 1}
                                                            </div>
                                                        </div>
                                                        <div className={classes.cell} style={{
                                                            color: route.confirmation ? 'green' : route.cancel ? 'red' : 'black',
                                                            width: isMobileApp ? 210 : 'calc((100vw - 634px)/2)'
                                                        }}
                                                        >
                                                            <b>
                                                                {route.role}
                                                            </b>
                                                            <b>
                                                                {route.confirmation ? pdDDMMYYHHMM(route.confirmation) : route.cancel ? pdDDMMYYHHMM(route.cancel) : ''}
                                                            </b>
                                                        </div>
                                                        <div className={classes.cell} style={{width: 80}}>
                                                            <Checkbox
                                                                checked={route.confirmation}
                                                                onChange={(event) => {
                                                                    if (['отмена', 'обработка'].includes(_application.status) && ['admin', 'менеджер', route.role].includes(profile.role) && (idx === 0 || routes[idx - 1].confirmation) && (idx === routes.length - 1 || (!routes[idx + 1].confirmation && !routes[idx + 1].cancel)) && !routes[idx].cancel) {
                                                                        routes[idx].confirmation = event.target.checked ? new Date() : undefined
                                                                        setRoutes([...routes])
                                                                    }
                                                                }}
                                                                color='primary'
                                                                inputProps={{'aria-label': 'primary checkbox'}}
                                                            />
                                                        </div>
                                                        <div className={classes.cell} style={{width: 80}}>
                                                            <Checkbox
                                                                checked={route.cancel}
                                                                onChange={(event) => {
                                                                    if (['отмена', 'обработка'].includes(_application.status) && ['admin', 'менеджер', route.role].includes(profile.role) && (idx === 0 || routes[idx - 1].confirmation) && (idx === routes.length - 1 || (!routes[idx + 1].confirmation && !routes[idx + 1].cancel)) && !routes[idx].confirmation) {
                                                                        routes[idx].cancel = event.target.checked ? new Date() : undefined
                                                                        setRoutes([...routes])
                                                                    }
                                                                }}
                                                                color='primary'
                                                                inputProps={{'aria-label': 'primary checkbox'}}
                                                            />
                                                        </div>
                                                        <div className={classes.cell}
                                                             style={{width: isMobileApp ? 150 : 'calc((100vw - 634px)/2)'}}>
                                                            <Input
                                                                className={classes.inputTable}
                                                                inputProps={{
                                                                    readOnly: !['admin', 'менеджер', route.role].includes(profile.role) || routes[idx].confirmation
                                                                }}
                                                                multiline={true}
                                                                value={route.comment}
                                                                onChange={(event) => {
                                                                    routes[idx].comment = event.target.value
                                                                    setRoutes([...routes])
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            :
                                            null
                                    }
                                    </>
                            }
                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                {
                                    router.query.id==='new'||['отмена', 'обработка'].includes(_application.status)?
                                        <Button color='primary' onClick={()=>{
                                            let check = !((items.filter(item=>!item.name.length||!item.unit.length||!item.currency.length||!item.count)).length>0)
                                            if (division&&items.length>0&&check&&category) {
                                                const action = async() => {
                                                    if(router.query.id==='new') {
                                                        items = items.map(item=>{delete item.lastPrice; item.price = checkFloat(item.price); item.count = checkFloat(item.count); return item})
                                                        await addApplication({
                                                            category: category._id,
                                                            division: division._id,
                                                            ...subdivision ? {subdivision: subdivision.name} : {},
                                                            items: items,
                                                            comment: comment,
                                                            note: note,
                                                            term: term,
                                                            budget: budget,
                                                            paymentType: paymentType,
                                                            official: official
                                                        })
                                                    }
                                                    else {
                                                        routes = routes.map(route=>{return {
                                                            role: route.role,
                                                            confirmation: route.confirmation,
                                                            cancel: route.cancel,
                                                            comment: route.comment
                                                        }})
                                                        items = items.map(item=>{return {
                                                            name: item.name,
                                                            unit: item.unit,
                                                            price: checkFloat(item.price),
                                                            count: checkFloat(item.count),
                                                            comment: item.comment,
                                                            currency: item.currency,
                                                            status: item.status,
                                                            GUID: item.GUID
                                                        }})
                                                        let element = {
                                                            _id: router.query.id,
                                                            items: items,
                                                            routes: routes
                                                        }
                                                        if (term !== _application.term) element.term = term
                                                        if (JSON.stringify(note) !== JSON.stringify(_application.note)) element.note = note
                                                        if (comment !== _application.comment) element.comment = comment
                                                        if (budget !== _application.budget) element.budget = budget
                                                        if (paymentType !== _application.paymentType) element.paymentType = paymentType
                                                        if (official !== _application.official) element.official = official
                                                        if(_application.supplier!==supplier._id)element.supplier = supplier._id
                                                        await setApplication(element)
                                                    }
                                                    Router.push(`/applications`)
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
                                    _application.status==='обработка'&&(['admin', 'менеджер', 'снабженец'].includes(profile.role)||profile.addApplication)?
                                        <Button size='small' color='primary' onClick={()=>{
                                            const action = async() => {
                                                await deleteApplication([router.query.id])
                                                Router.push(`/applications`)
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
                                    router.query.id!=='new'&&!['отмена', 'обработка'].includes(_application.status)?
                                        <Button size='small' color='primary' onClick={async()=>{
                                            await showLoad(true)
                                            window.open(((await getUnloadingApplication({
                                                _id: router.query.id,
                                            })).unloadingApplication).data, '_blank');
                                            await showLoad(false)
                                        }}>
                                            Выгрузить
                                        </Button>
                                        :
                                        null
                                }
                            </div>
                        </CardContent>
                        :
                        null
                }
            </Card>
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

Application.getInitialProps = async function(ctx) {
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
    return {
        data: {
            ...(ctx.query.id==='new'?
                    {
                        application:
                            {
                                division: undefined,
                                category: undefined,
                                budget: true,
                                note: [],
                                paymentType: 'перечисления',
                                official: true,
                                dateClose: undefined,
                                amount: [],
                                specialist: undefined,
                                supplier: undefined,
                                items: [],
                                routes: [],
                                comment: '',
                                term: new Date()
                            }
                    }
                :
                    await getApplication({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
            ),
            ...await getCategorys({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getUnits({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined),
            ...await getDivisions({search: ''}, ctx.req?await getClientGqlSsr(ctx.req):undefined)

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

export default connect(mapStateToProps, mapDispatchToProps)(Application);