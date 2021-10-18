import Head from 'next/head';
import React, { useState, useEffect, useRef } from 'react';
import App from '../../layouts/App';
import { connect } from 'react-redux'
import memorandumStyle from '../../src/styleMUI/list'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import { addMemorandum, getUnloadingMemorandum, setMemorandum, getMemorandum, deleteMemorandum } from '../../src/gql/memorandum'
import { getUsers } from '../../src/gql/user'
import { resizeImg } from '../../src/resizeImg'
import SetDate from '../../components/dialog/SetDate'
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { urlMain } from '../../redux/constants/other'
import Confirmation from '../../components/dialog/Confirmation'
import { useRouter } from 'next/router'
import * as snackbarActions from '../../redux/actions/snackbar'
import Router from 'next/router'
import { getClientGqlSsr } from '../../src/getClientGQL'
import {pdDDMMYYHHMM, differenceDates} from '../../src/lib'
import initialApp from '../../src/initialApp'
import * as appActions from '../../redux/actions/app'
import Chip from '@material-ui/core/Chip';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const Memorandum = React.memo((props) => {
    const { profile, pinCode } = props.user;
    const classes = memorandumStyle();
    const { data } = props;
    const router = useRouter()
    const { isMobileApp, date } = props.app;
    const initialRender = useRef(true);
    const { showSnackBar } = props.snackbarActions;
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showLoad, setShowAppBar, setShowLightbox, setImagesLightbox, setIndexLightbox } = props.appActions;

    let [_memorandum, _setMemorandum] = useState(data.memorandum);
    let [users, setUsers] = useState(data.users?data.users:[]);
    let [usersName, setUsersName] = useState({});
    let [term, setTerm] = useState(data.memorandum?data.memorandum.term:new Date());
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
    let [note, setNote] = useState(data.memorandum?data.memorandum.note:undefined);
    let handleChangeNote = (async (event) => {
        if(event.target.files[0].size/1024/1024<50){
            setNote([...note, await resizeImg(event.target.files[0])])
        } else {
            showSnackBar('Файл слишком большой')
        }
    })
    let [comment, setComment] = useState(data.memorandum?data.memorandum.comment:'');
    let [name, setName] = useState(data.memorandum?data.memorandum.name:'');
    let [whom, setWhom] = useState(data.memorandum?data.memorandum.whom:undefined);
    let [notifiables, setNotifiables] = useState(data.memorandum?data.memorandum.notifiables:[]);
    let [routes, setRoutes] = useState(data.memorandum?data.memorandum.routes:[]);
    let [newRoutes, setNewRoutes] = useState([]);


    let [completed, setCompleted] = useState(data.memorandum?data.memorandum.completed:false);
    let [checked, setChecked] = useState(data.memorandum?data.memorandum.checked:false);

    let [zoom, setZoom] = useState(1);
    let [showTable, setShowTable] = useState(true);
    let noteRef = useRef(null);
    const difference = differenceDates(new Date(term), new Date())
    const statusColor = {
        'обработка': 'orange',
        'принят': 'blue',
        'выполнен': 'green',
        'проверен': 'green',
        'отмена': 'red'
    }
    useEffect(()=>{
        (async()=>{
            if(!initialRender.current&&pinCode) {
                if(router.query.id!=='new') {
                    _memorandum = (await getMemorandum({_id: router.query.id})).memorandum
                    setNote(_memorandum?_memorandum.note:[])
                    setComment(_memorandum?_memorandum.comment:'')
                    setName(_memorandum?_memorandum.name:'');
                    setWhom(_memorandum?_memorandum.whom:undefined);
                    setNotifiables(_memorandum?_memorandum.notifiables:[]);
                    usersName = {}
                    for(let i=0; i<_memorandum.notifiables.length; i++){
                        usersName[_memorandum.notifiables[i]._id] = _memorandum.notifiables[i].name
                    }
                    usersName[_memorandum.whom._id] = _memorandum.whom.name
                    setUsersName(usersName)
                    setRoutes(_memorandum?_memorandum.routes:[])
                    setTerm(_memorandum?_memorandum.term:new Date())
                    setCompleted(_memorandum?_memorandum.completed:false)
                    setChecked(_memorandum?_memorandum.checked:false)
                    _setMemorandum(_memorandum)
                }
                else {
                    users = (await getUsers({search: '', filter: '', all: true},)).users
                    setUsers(users)
                    usersName = {}
                    for(let i=0; i<users.length; i++){
                        usersName[users[i]._id] = users[i].name
                    }
                    setUsersName(usersName)
                }
            }
            else if(initialRender.current) {
                initialRender.current = false;
                usersName = {}
                for(let i=0; i<users.length; i++){
                    usersName[users[i]._id] = users[i].name
                }
                setUsersName(usersName)
            }
        })()
    },[pinCode])
    return (
        <App pageName={router.query.id==='new'?'Добавить':_memorandum?_memorandum.number:'Ничего не найдено'}>
            <Head>
                <title>{router.query.id==='new'?'Добавить':_memorandum?_memorandum.number:'Ничего не найдено'}</title>
                <meta name='description' content='Система предназначена для ведения списка заявок на приобретение'/>
                <meta property='og:title' content={router.query.id==='new'?'Добавить':_memorandum?_memorandum.number:'Ничего не найдено'} />
                <meta property='og:description' content='Система предназначена для ведения списка заявок на приобретение' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={`${urlMain}/static/512x512.png`} />
                <meta property='og:url' content={`${urlMain}/memorandum/${router.query.id}`} />
                <link rel='canonical' href={`${urlMain}/memorandum/${router.query.id}`}/>
            </Head>
            <Card>
                {
                    _memorandum?
                        <CardContent className={classes.page}>
                            {
                                _memorandum.number?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Номер:</div>&nbsp;
                                        <div className={classes.value}>{_memorandum.number}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                _memorandum.status?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Статус:</div>&nbsp;
                                        <div className={classes.value} style={{color: statusColor[_memorandum.status]}}>{_memorandum.status}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                _memorandum.createdAt?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Время подачи:&nbsp;</div>
                                        <div className={classes.value}>{pdDDMMYYHHMM(_memorandum.createdAt)}</div>
                                    </div>
                                    :
                                    null
                            }
                            <div className={classes.row}
                                 onClick={()=>{if(!_memorandum.status||['отмена', 'обработка'].includes(_memorandum.status)){setMiniDialog('Дата', <SetDate/>);showMiniDialog(true);}}}
                                 style={{cursor: 'pointer', color: !_memorandum.status||_memorandum.status==='выполнен'?'black':difference<0?'red':difference<1?'yellow':'green'}}
                            >
                                <div className={classes.nameField}>Срок:&nbsp;</div>
                                <div className={classes.value}>{pdDDMMYYHHMM(term)}</div>
                            </div>
                            {
                                _memorandum.dateClose?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Время закрытия:&nbsp;</div>
                                        <div className={classes.value}>{pdDDMMYYHHMM(_memorandum.dateClose)}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                _memorandum.who?
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Отправитель:&nbsp;</div>
                                        <div className={classes.value}>{_memorandum.who.name}</div>
                                    </div>
                                    :
                                    null
                            }
                            {
                                router.query.id!=='new'?
                                    <>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Получатель:&nbsp;</div>
                                        <div className={classes.value}>{whom.name}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Уведомляемые:&nbsp;</div>
                                        <div className={classes.value}>
                                            {notifiables.map((notifable, idx)=> {
                                                return `${notifable.name}${idx!==_memorandum.notifiables.length-1?', ':''}`}
                                            )}
                                        </div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Заголовок:&nbsp;</div>
                                        <div className={classes.value}>{name}</div>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Записка:&nbsp;</div>
                                        <div className={classes.value}>{comment}</div>
                                    </div>
                                    {console.log(profile, _memorandum.who)}
                                    {
                                        note.length||_memorandum.status==='обработка'&&profile._id===_memorandum.who._id?
                                            <div className={classes.row}>
                                                <div className={classes.nameField}>Вложение:</div>
                                                <div className={classes.noteImageList}>
                                                    {
                                                        _memorandum.status==='обработка'&&profile._id===_memorandum.who._id?
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
                                                            _memorandum.status==='обработка'&&profile._id===_memorandum.who._id?
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
                                    <div className={classes.tableName}>
                                        <div className={classes.nameField}>
                                            Подтверждения&nbsp;({routes.length}):&nbsp;
                                        </div>
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
                                                <div className={classes.tableRow} style={{width: isMobileApp ? 540 : '100%'}}>
                                                    <div className={classes.cell} style={{width: 20}}>
                                                        <div className={classes.nameTable}>№</div>
                                                    </div>
                                                    <div className={classes.cell}
                                                         style={{width: isMobileApp ? 210 : 'calc((100vw - 634px)/2)'}}>
                                                        <div className={classes.nameTable}>Подтверждающий</div>
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
                                                                {usersName[route.user._id]}
                                                            </b>
                                                            <b>
                                                                {route.confirmation ? pdDDMMYYHHMM(route.confirmation) : route.cancel ? pdDDMMYYHHMM(route.cancel) : ''}
                                                            </b>
                                                        </div>
                                                        <div className={classes.cell} style={{width: 80}}>
                                                            <Checkbox
                                                                checked={route.confirmation}
                                                                onChange={(event) => {
                                                                    if (['отмена', 'обработка'].includes(_memorandum.status) && (['admin', 'менеджер'].includes(profile.role)||profile._id===route.user._id) && (idx === 0 || routes[idx - 1].confirmation) && (idx === routes.length - 1 || (!routes[idx + 1].confirmation && !routes[idx + 1].cancel)) && !routes[idx].cancel) {
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
                                                                    if (['отмена', 'обработка'].includes(_memorandum.status) && (['admin', 'менеджер'].includes(profile.role)||profile._id===route.user._id) && (idx === 0 || routes[idx - 1].confirmation) && (idx === routes.length - 1 || (!routes[idx + 1].confirmation && !routes[idx + 1].cancel)) && !routes[idx].confirmation) {
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
                                                                    readOnly: !(['admin', 'менеджер'].includes(profile.role)||profile._id===route.user._id) || routes[idx].confirmation
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
                                    :
                                    <>
                                    <div className={classes.row}>
                                        <Autocomplete
                                            size='small'
                                            className={classes.input}
                                            options={users.filter(user=>profile._id!==user._id)}
                                            getOptionLabel={option => option.name}
                                            onChange={(event, newValue) => {
                                                setWhom(newValue)
                                            }}
                                            disabled={router.query.id!=='new'}
                                            noOptionsText='Ничего не найдено'
                                            renderInput={params => (
                                                <TextField {...params} label='Получатель' variant='outlined' fullWidth />
                                            )}
                                        />
                                    </div>
                                    <div className={classes.row}>
                                        <FormControl className={classes.input}>
                                            <InputLabel>Уведомляемые</InputLabel>
                                            <Select
                                                multiple
                                                className={classes.input}
                                                value={notifiables}
                                                onChange={(event)=>{
                                                    setNotifiables(event.target.value)
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
                                                renderValue={(selected) => (
                                                    <div className={classes.chips}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={usersName[value]} className={classes.chip} />
                                                        ))}
                                                    </div>
                                                )}
                                            >
                                                {users.map((user) => {
                                                    if((!whom||user._id!==whom._id)&&user._id!==profile._id)
                                                        return <MenuItem key={user._id} value={user._id}
                                                                  style={{background: notifiables.includes(user._id) ? '#009ADC2b' : '#ffffff'}}>
                                                            {user.name}
                                                        </MenuItem>
                                                })}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Заголовок:&nbsp;&nbsp;&nbsp;</div>
                                        <Input
                                            size='small'
                                            className={classes.inputTable}
                                            value={name}
                                            style={{width: '100%', marginBottom: 10}}
                                            onChange={(event)=>{
                                                setName(event.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Записка:&nbsp;&nbsp;&nbsp;</div>
                                        <Input
                                            size='small'
                                            multiline={true}
                                            className={classes.inputTable}
                                            value={comment}
                                            style={{width: '100%', marginBottom: 10}}
                                            onChange={(event)=>{
                                                setComment(event.target.value)
                                            }}
                                        />
                                    </div>
                                    <div className={classes.row}>
                                        <div className={classes.nameField}>Вложение:</div>
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
                                        <FormControl className={classes.input}>
                                            <InputLabel>Утверждающие</InputLabel>
                                            <Select
                                                multiple
                                                className={classes.input}
                                                value={newRoutes}
                                                onChange={(event)=>{
                                                    setNewRoutes(event.target.value)
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
                                                renderValue={(selected) => (
                                                    <div className={classes.chips}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={usersName[value]} className={classes.chip} />
                                                        ))}
                                                    </div>
                                                )}
                                            >
                                                {users.map((user) => {
                                                    if((!whom||user._id!==whom._id)&&notifiables.includes(user._id))
                                                        return <MenuItem key={user._id} value={user._id}
                                                                         style={{background: newRoutes.includes(user._id) ? '#009ADC2b' : '#ffffff'}}>
                                                            {user.name}
                                                        </MenuItem>
                                                })}
                                            </Select>
                                        </FormControl>
                                    </div>
                                    </>
                            }
                            {
                                ['принят', 'выполнен', 'проверен'].includes(_memorandum.status)?
                                    <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                        <div className={classes.nameField}>
                                            Выполнен:&nbsp;
                                        </div>
                                        <Checkbox
                                            size='small'
                                            checked={completed}
                                            onChange={() => {
                                                if((['admin', 'менеджер'].includes(profile.role)||profile._id===_memorandum.who._id)&&_memorandum.status==='принят') {
                                                    setCompleted(!completed)
                                                }
                                            }}
                                            color='primary'
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </div>
                                    :
                                    null
                            }
                            {
                                ['принят', 'выполнен', 'проверен'].includes(_memorandum.status)?
                                    <div className={classes.row} style={{alignItems: 'flex-end'}}>
                                        <div className={classes.nameField}>
                                            Проверен:&nbsp;
                                        </div>
                                        <Checkbox
                                            size='small'
                                            checked={checked}
                                            onChange={() => {
                                                if(('admin'===profile.role||profile._id===whom._id)&&_memorandum.status==='выполнен') {
                                                    setChecked(!checked)
                                                }
                                            }}
                                            color='primary'
                                            inputProps={{ 'aria-label': 'primary checkbox' }}
                                        />
                                    </div>
                                    :
                                    null
                            }
                            <div className={isMobileApp?classes.bottomDivM:classes.bottomDivD}>
                                {
                                    router.query.id==='new'||['отмена', 'обработка', 'принят', 'выполнен'].includes(_memorandum.status)?
                                        <Button color='primary' onClick={()=>{
                                             if (whom&&name.length&&comment.length) {
                                                const action = async() => {
                                                    if(router.query.id==='new') {
                                                        await addMemorandum({
                                                           name, comment, note, term, whom: whom._id, notifiables: notifiables, routes: newRoutes
                                                        })
                                                    }
                                                    else {
                                                        routes = routes.map(route=>{return {
                                                            user: route.user._id,
                                                            confirmation: route.confirmation,
                                                            cancel: route.cancel,
                                                            comment: route.comment
                                                        }})
                                                        let element = {
                                                            _id: router.query.id,
                                                            routes: routes
                                                        }
                                                        if (term !== _memorandum.term) element.term = term
                                                        if (note !== _memorandum.note) element.note = note
                                                        if (comment !== _memorandum.comment) element.comment = comment
                                                        if (name !== _memorandum.name) element.name = name
                                                        if (completed&&_memorandum.status==='принят') element.completed = completed
                                                        if (checked&&_memorandum.status==='выполнен') element.checked = checked

                                                        await setMemorandum(element)
                                                    }
                                                    Router.push(`/memorandums`)
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
                                    _memorandum.status==='обработка'&&(['admin', 'менеджер'].includes(profile.role)||profile._id===_memorandum.who._id)?
                                        <Button size='small' color='primary' onClick={()=>{
                                            const action = async() => {
                                                await deleteMemorandum([router.query.id])
                                                Router.push(`/memorandums`)
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
                                    router.query.id!=='new'&&!['отмена', 'обработка'].includes(_memorandum.status)?
                                        <Button size='small' color='primary' onClick={async()=>{
                                            await showLoad(true)
                                            window.open(((await getUnloadingMemorandum({
                                                _id: router.query.id,
                                            })).unloadingMemorandum).data, '_blank');
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

Memorandum.getInitialProps = async function(ctx) {
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
                        memorandum:
                            {
                                name: '',
                                comment: '',
                                note: [],
                                term: new Date(),
                                who: undefined,
                                whom: undefined,
                                notifiables: []
                            }
                    }
                :
                    await getMemorandum({_id: ctx.query.id}, ctx.req?await getClientGqlSsr(ctx.req):undefined)
            ),
            ...await getUsers({search: '', filter: '', all: true}, ctx.req?await getClientGqlSsr(ctx.req):undefined),

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

export default connect(mapStateToProps, mapDispatchToProps)(Memorandum);