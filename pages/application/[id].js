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
import { getItems } from '../../src/gql/item'
import { getUnits } from '../../src/gql/unit'
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
import {  pdDDMMYYHHMM, checkInt, differenceDates, currencys } from '../../src/lib'
import initialApp from '../../src/initialApp'
import { getSuppliers } from '../../src/gql/user'
import * as appActions from '../../redux/actions/app'

const Application = React.memo((props) => {
    const { profile } = props.user;
    const classes = applicationStyle();
    const { data } = props;
    const router = useRouter()
    const { isMobileApp } = props.app;
    const { showSnackBar } = props.snackbarActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showLoad } = props.appActions;
    let [itemsName, setItemsName] = useState([]);
    let [category, setCategory] = useState(data.application?data.application.category:undefined);
    let handleCategory = async (category) => {
        if(category) {
            setItemsName((await getItems({category: category._id, search: ''})).items)
            setCategory(category)
        }
    };
    let [budget, setBudget] = useState(data.application?data.application.budget:true);
    let [preview, setPreview] = useState(data.application?data.application.note:'');
    let [note, setNote] = useState(undefined);
    let handleChangeNote = ((event) => {
        if(event.target.files[0].size/1024/1024<50){
            setNote(event.target.files[0])
            setPreview(event.target.files[0].name)
        } else {
            showSnackBar('???????? ?????????????? ??????????????')
        }
    })
    const paymentTypes = ['????????????????????????', '????????????????']
    let [paymentType, setPaymentType] = useState(data.application?data.application.paymentType:'????????????????????????');
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
            if(items[i].status!=='????????????') {
                if (!amount1[items[i].currency])
                    amount1[items[i].currency] = 0
                amount1[items[i].currency]+=items[i].count*items[i].price
            }
        }
        const keys = Object.keys(amount1)
        for(let i = 0; i<keys.length; i++){
            amount.push({name: keys[i], value: amount1[keys[i]]})
        }
        setAmount([...amount])
    },[items])
    let noteRef = useRef(null);
    const difference = differenceDates(new Date(data.application.term), new Date())
    let [routes, setRoutes] = useState(data.application?data.application.routes:[]);
    const statusColor = {
        '??????????????????': 'orange',
        '????????????': 'blue',
        '????????????????': 'green',
        '????????????': 'red'
    }
    return (
        <App pageName={router.query.id==='new'?'????????????????':data.application?data.application.number:'???????????? ???? ??????????????'}>
            <Head>
                <title>{router.query.id==='new'?'????????????????':data.application?data.application.number:'???????????? ???? ??????????????'}</title>
                <meta name='description' content='?????????????? ?????????????????????????? ?????? ?????????????? ???????????? ???????????? ???? ????????????????????????'/>
                <meta property='og:title' content={router.query.id==='new'?'????????????????':data.application?data.application.number:'???????????? ???? ??????????????'} />
                <meta property='og:description' content='?????????????? ?????????????????????????? ?????? ?????????????? ???????????? ???????????? ???? ????????????????????????' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/application/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/application/${router.query.id}`}/>
            </Head>
            <Card>
                <CardContent className={classes.page}>
                    {
                        data.application.number?
                            <div className={classes.row}>
                                <div className={classes.nameField}>??????????:</div>&nbsp;
                                <div className={classes.value}>{data.application.number}</div>
                            </div>
                            :
                            null
                    }
                    {
                        data.application.status?
                            <div className={classes.row}>
                                <div className={classes.nameField}>????????????:</div>&nbsp;
                                <div className={classes.value} style={{color: statusColor[data.application.status]}}>{data.application.status}</div>
                            </div>
                            :
                            null
                    }
                    {
                        data.application.createdAt?
                            <div className={classes.row}>
                                <div className={classes.nameField}>?????????? ????????????:&nbsp;</div>
                                <div className={classes.value}>{pdDDMMYYHHMM(data.application.createdAt)}</div>
                            </div>
                            :
                            null
                    }
                    {
                        data.application.term?
                            <div className={classes.row} style={{color: data.application.status==='????????????????'?'black':difference<0?'red':difference<1?'yellow':'green'}}>
                                <div className={classes.nameField}>????????:&nbsp;</div>
                                <div className={classes.value}>{pdDDMMYYHHMM(data.application.term)}</div>
                            </div>
                            :
                            null
                    }
                    {
                        data.application.dateClose?
                            <div className={classes.row}>
                                <div className={classes.nameField}>?????????? ????????????????:&nbsp;</div>
                                <div className={classes.value}>{pdDDMMYYHHMM(data.application.dateClose)}</div>
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
                                    options={data.divisions}
                                    getOptionLabel={option => option.name}
                                    value={division}
                                    onChange={(event, newValue) => {
                                        handleDivision(newValue)
                                    }}
                                    disabled={router.query.id!=='new'}
                                    noOptionsText='???????????? ???? ??????????????'
                                    renderInput={params => (
                                        <TextField {...params} label='??????????????????????????' variant='outlined' fullWidth />
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
                                            noOptionsText='???????????? ???? ??????????????'
                                            renderInput={params => (
                                                <TextField {...params} label='??????????????????????????' variant='outlined' fullWidth />
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
                                            options={data.categorys}
                                            getOptionLabel={option => option.name}
                                            value={category}
                                            onChange={(event, newValue) => {
                                                handleCategory(newValue)
                                            }}
                                            disabled={router.query.id!=='new'}
                                            noOptionsText='???????????? ???? ??????????????'
                                            renderInput={params => (
                                                <TextField {...params} label='??????????????????' variant='outlined' fullWidth />
                                            )}
                                        />
                                    </div>
                                    :
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>??????????????????:&nbsp;</div>
                                        <div className={classes.value}>{category.name}</div>
                                    </div>
                            }
                            </>
                            :
                            <>
                            <div className={classes.row}>
                                <div className={classes.nameField}>??????????????????????????:&nbsp;</div>
                                <div className={classes.value}>{division.name}</div>
                            </div>
                            {
                                subdivision&&subdivision.length?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>??????-??????????????????????????:&nbsp;</div>
                                        <div className={classes.value}>{subdivision}</div>
                                    </div>
                                    :
                                    null
                            }
                            <div className={classes.row}>
                                <div className={classes.nameField}>??????????????????:&nbsp;</div>
                                <div className={classes.value}>{data.application.category.name}</div>
                            </div>
                            <div style={{cursor: 'pointer'}} className={classes.row} onClick={() => {
                                if (data.application.status === '??????????????????'&&!['????????????????????', '??????????????????'].includes(profile.role)) {
                                    setMiniDialog('??????????????????', <SetSuplier suppliers={data.suppliers} setSupplier={setSupplier}/>)
                                    showMiniDialog(true)
                                }
                            }}>
                                <div className={classes.nameField}>??????????????????:&nbsp;</div>
                                <div className={classes.value}>{supplier.name}</div>
                            </div>
                            <div className={classes.row}>
                                <div className={classes.nameField}>????????????????????:&nbsp;</div>
                                <div className={classes.value}>{data.application.specialist.name}</div>
                            </div>
                            </>
                    }
                    {
                        !data.application.status||['????????????', '??????????????????'].includes(data.application.status)&&profile.role==='????????????????????'?
                            <div className={classes.row}>
                                <div className={classes.nameField}>??????????????????????:&nbsp;&nbsp;&nbsp;</div>
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
                            <div className={classes.row}>
                                <div className={classes.nameField}>??????????????????????:&nbsp;</div>
                                <div className={classes.value}>{comment}</div>
                            </div>
                    }
                    {
                            (router.query.id==='new'||'??????????????????'===data.application.status)&&['admin', '????????????????????', '????????????????', '??????????????????'].includes(profile.role)?
                                <>
                                <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                    <div className={classes.nameField}>????????????????????:&nbsp;</div>
                                    <Checkbox
                                        size='small'
                                        checked={official}
                                        onChange={()=>{setOfficial(!official)}}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                </div>
                                <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                    <div className={classes.nameField}>???? ??????????????:&nbsp;</div>
                                    <Checkbox
                                        size='small'
                                        checked={budget}
                                        onChange={()=>{setBudget(!budget)}}
                                        color='primary'
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                    />
                                </div>
                                {
                                    !budget?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>??????????????:&nbsp;</div>
                                            <div className={classes.nameField} style={{color: preview?'#009ADC':'red', cursor: 'pointer'}} onClick={()=>{if(preview)window.open(preview, '_blank')}}>
                                                ??????????????
                                            </div>
                                            <div className={classes.nameField} style={{color: note?'#009ADC':'red', cursor: 'pointer'}} onClick={()=>{noteRef.current.click()}}>
                                                ??????????????????
                                            </div>
                                        </div>
                                        :
                                        null
                                }
                                <div className={classes.row}>
                                    <div className={classes.nameField}>?????? ????????????:&nbsp;</div>
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
                                    <div className={classes.nameField}>???? ??????????????:&nbsp;</div>
                                    <div className={classes.value}>{data.application.budget?'????':'??????'}</div>
                                </div>
                                {
                                    !data.application.budget?
                                        <div className={classes.row}>
                                            <div className={classes.nameField}>??????????????:&nbsp;</div>
                                            <div className={classes.nameField} style={{color: preview?'#009ADC':'red', cursor: 'pointer'}} onClick={()=>{if(preview)window.open(preview, '_blank')}}>
                                                ??????????????
                                            </div>
                                            {
                                                data.application.status==='??????????????????'?
                                                    <div className={classes.nameField} style={{color: note?'#009ADC':'red', cursor: 'pointer'}} onClick={()=>{noteRef.current.click()}}>
                                                        ??????????????????
                                                    </div>
                                                    :
                                                    null
                                            }
                                        </div>
                                        :
                                        null
                                }
                                <div className={classes.row}>
                                    <div className={classes.nameField}>????????????????????:&nbsp;</div>
                                    <div className={classes.value}>{data.application.official?'????':'??????'}</div>
                                </div>
                                <div className={classes.row}>
                                    <div className={classes.nameField}>?????? ????????????:&nbsp;</div>
                                    <div className={classes.value}>{data.application.paymentType}</div>
                                </div>
                                </>
                    }
                    <div className={classes.row}>
                        <div className={classes.nameField}>??????????:&nbsp;</div>
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
                            ????????????&nbsp;({items.length}):&nbsp;
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
                            {showTable1?'????????????????':'????????????????'}
                        </Button>
                    </div>
                    {
                        showTable1?
                            <div className={classes.table} style={{zoom: zoom1}}>
                                <div className={classes.tableRow} style={{width: isMobileApp?!data.application.status||['????????????', '??????????????????'].includes(data.application.status)?894:810:'100%'}}>
                                    <div className={classes.cell} style={{width: 20}}><div className={classes.nameTable}>???</div></div>
                                    <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - ${!data.application.status||['????????????', '??????????????????'].includes(data.application.status)?'948':'864'}px) / 2)`}}><div className={classes.nameTable}>??????????</div></div>
                                    <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>??????-????</div></div>
                                    <div className={classes.cell} style={{width: 60}}><div className={classes.nameTable}>????????</div></div>
                                    <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>??????????</div></div>
                                    <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>????????????</div></div>
                                    <div className={classes.cell} style={{width: 70}}><div className={classes.nameTable}>????. ??????.</div></div>
                                    <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - ${!data.application.status||['????????????', '??????????????????'].includes(data.application.status)?'948':'864'}px) / 2)`}}><div className={classes.nameTable}>????????????????????</div></div>
                                    {
                                        !data.application.status ||  ['????????????', '??????????????????'].includes(data.application.status) ?
                                            <div className={classes.cell} style={{width: 64}}/>
                                            :
                                            null
                                    }
                                </div>
                                {items.map((item, idx) =>
                                    <div className={classes.tableRow} key={idx} style={{width: isMobileApp?!data.application.status||['????????????', '??????????????????'].includes(data.application.status)?894:810:'100%'}}>
                                        <div className={classes.cell} style={{width: 20}}>
                                            <div className={classes.nameTable}>
                                                {idx+1}
                                            </div>
                                        </div>
                                        <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - ${!data.application.status ||  ['????????????', '??????????????????'].includes(data.application.status)?'948':'864'}px) / 2)`}}>
                                            {
                                                router.query.id === 'new' ?
                                                    <Autocomplete
                                                        size='small'
                                                        className={classes.inputTable}
                                                        options={itemsName}
                                                        getOptionLabel={option => option.name}
                                                        onChange={(event, newValue) => {
                                                            items[idx].name = newValue.name
                                                            items[idx].GUID = newValue.GUID
                                                            setItems([...items])
                                                        }}
                                                        noOptionsText='???????????? ???? ??????????????'
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
                                                    readOnly: router.query.id!=='new'&& !['????????????', '??????????????????'].includes(data.application.status),
                                                }}
                                                value={item.count}
                                                onChange={(event)=>{
                                                    items[idx].count = checkInt(event.target.value)
                                                    setItems([...items])
                                                }}
                                            />
                                        </div>
                                        <div className={classes.cell} style={{width: 60}}>
                                            <Input
                                                type={isMobileApp?'number':'text'}
                                                className={classes.inputTable}
                                                inputProps={{
                                                    readOnly: router.query.id!=='new'&&!['????????????', '??????????????????'].includes(data.application.status),
                                                }}
                                                value={item.price}
                                                onChange={(event)=>{
                                                    items[idx].price = checkInt(event.target.value)
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
                                                value={item.count*item.price}
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
                                                {data.units.map((unit) => (
                                                    <MenuItem key={unit._id} value={unit.name}>
                                                        {unit.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <div className={classes.cell} style={{width: isMobileApp?150:`calc((100vw - ${!data.application.status ||  ['????????????', '??????????????????'].includes(data.application.status)?'948':'864'}px) / 2)`}}>
                                            <Input
                                                className={classes.inputTable}
                                                inputProps={{
                                                    readOnly: router.query.id!=='new'&&! ['????????????', '??????????????????'].includes(data.application.status)
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
                                            !data.application.status|| ['????????????', '??????????????????'].includes(data.application.status)?
                                                <div className={classes.cell} style={{width: 64, fontSize: '0.875rem'}}>
                                                    <Button color='secondary' size='small' onClick={()=>{
                                                        items.splice(idx, 1)
                                                        setItems([...items])
                                                    }}>
                                                        ??????????????
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
                                    unit: '????',
                                    currency: '??????',
                                    price: 0,
                                    count: 0,
                                    comment: '',
                                    GUID: '',
                                    status: '????????????'
                                }]
                                setItems(items)
                            }}>
                                ???????????????? ??????????
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
                                    ??????????????????????????&nbsp;({items.length}):&nbsp;
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
                                    {showTable2?'????????????????':'????????????????'}
                                </Button>
                            </div>
                            {
                                showTable2?
                                    <div className={classes.table} style={{zoom: zoom2}}>
                                        <div className={classes.tableRow} style={{width: isMobileApp ? 540 : '100%'}}>
                                            <div className={classes.cell} style={{width: 20}}>
                                                <div className={classes.nameTable}>???</div>
                                            </div>
                                            <div className={classes.cell}
                                                 style={{width: isMobileApp ? 210 : 'calc((100vw - 634px)/2)'}}>
                                                <div className={classes.nameTable}>????????</div>
                                            </div>
                                            <div className={classes.cell} style={{width: 80}}>
                                                <div className={classes.nameTable}>????????????</div>
                                            </div>
                                            <div className={classes.cell} style={{width: 80}}>
                                                <div className={classes.nameTable}>????????????</div>
                                            </div>
                                            <div className={classes.cell}
                                                 style={{width: isMobileApp ? 150 : 'calc((100vw - 634px)/2)'}}>
                                                <div className={classes.nameTable}>????????????????????</div>
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
                                                            if (['????????????', '??????????????????'].includes(data.application.status) && ['admin', '????????????????', route.role].includes(profile.role) && (idx === 0 || routes[idx - 1].confirmation) && (idx === routes.length - 1 || (!routes[idx + 1].confirmation && !routes[idx + 1].cancel)) && !routes[idx].cancel) {
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
                                                            if (['????????????', '??????????????????'].includes(data.application.status) && ['admin', '????????????????', route.role].includes(profile.role) && (idx === 0 || routes[idx - 1].confirmation) && (idx === routes.length - 1 || (!routes[idx + 1].confirmation && !routes[idx + 1].cancel)) && !routes[idx].confirmation) {
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
                                                            readOnly: !['admin', '????????????????', route.role].includes(profile.role) || routes[idx].confirmation
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
                            router.query.id==='new'||['????????????', '??????????????????'].includes(data.application.status)?
                                    <Button color='primary' onClick={()=>{
                                        let check = !((items.filter(item=>!item.name.length||!item.unit.length||!item.currency.length||!item.count)).length>0)
                                        if (division&&items.length>0&&check&&category) {
                                            const action = async() => {
                                                if(router.query.id==='new') {
                                                    await addApplication({
                                                        category: category._id,
                                                        division: division._id,
                                                        ...subdivision ? {subdivision: subdivision.name} : {},
                                                        items: items,
                                                        comment: comment,
                                                        note: note,
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
                                                        price: item.price,
                                                        count: item.count,
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
                                                    if (note) element.note = note
                                                    if (comment !== data.application.comment) element.comment = comment
                                                    if (budget !== data.application.budget) element.budget = budget
                                                    if (paymentType !== data.application.paymentType) element.paymentType = paymentType
                                                    if (official !== data.application.official) element.official = official
                                                    if(data.application.supplier!==supplier._id)element.supplier = supplier._id
                                                    await setApplication(element)
                                                }
                                                Router.push(`/applications`)
                                            }
                                            setMiniDialog('???? ???????????????', <Confirmation action={action}/>)
                                            showMiniDialog(true)
                                        } else
                                            showSnackBar('?????????????????? ?????? ????????')
                                    }}>
                                        ??????????????????
                                    </Button>
                                :
                                null
                        }
                        {
                            data.application.status==='??????????????????'&&['admin', '????????????????', '????????????????????', '??????????????????'].includes(profile.role)?
                                <Button size='small' color='primary' onClick={()=>{
                                    const action = async() => {
                                        await deleteApplication([router.query.id])
                                        Router.push(`/applications`)
                                    }
                                    setMiniDialog('???? ???????????????', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }}>
                                    ??????????????
                                </Button>
                                :
                                null
                        }
                        {
                            router.query.id!=='new'&&!['????????????', '??????????????????'].includes(data.application.status)?
                                <Button size='small' color='primary' onClick={async()=>{
                                    await showLoad(true)
                                    window.open(((await getUnloadingApplication({
                                        _id: router.query.id,
                                    })).unloadingApplication).data, '_blank');
                                    await showLoad(false)
                                }}>
                                    ??????????????????
                                </Button>
                                :
                                null
                        }
                    </div>

                </CardContent>
            </Card>
            <input
                ref={noteRef}
                accept='*/*'
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
    return {
        data: {
            ...(ctx.query.id==='new'?
                    {
                        application:
                            {
                                division: undefined,
                                category: undefined,
                                budget: true,
                                note: undefined,
                                paymentType: '????????????????????????',
                                official: true,
                                dateClose: undefined,
                                term: undefined,
                                amount: [],
                                specialist: undefined,
                                supplier: undefined,
                                items: [],
                                routes: [],
                                comment: ''
                            }
                    }
                :
                    await getApplication({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
            ),
            ...await getSuppliers(ctx.req?await getClientGqlSsr(ctx.req):undefined),
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