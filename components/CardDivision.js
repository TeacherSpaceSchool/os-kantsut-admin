import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { addDivision, deleteDivision, setDivision, restoreDivision } from '../src/gql/division'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Autocomplete from '@material-ui/lab/Autocomplete';

const CardDivision = React.memo((props) => {
    const classes = cardStyle();
    const { element, setList, idx, list, suppliers, specialists, heads, staffs } = props;
    const { isMobileApp } = props.app;
    let [name, setName] = useState(element?element.name:'');
    let handleName =  (event) => {
        setName(event.target.value)
    };
    let [newSuppliers, setNewSuppliers] = useState(element?element.suppliers:[]);
    const handleNewSuppliers = (event) => {
        setNewSuppliers(event.target.value);
    };
    let [newStaffs, setNewStaffs] = useState(element?element.staffs:[]);
    const handleNewStaffs = (event) => {
        setNewStaffs(event.target.value);
    };
    let [head, setHead] = useState(element?element.head:undefined);
    let [newSpecialists, setNewSpecialists] = useState(element?element.specialists:[]);
    const handleNewSpecialists = (event) => {
        setNewSpecialists(event.target.value);
    };
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    return (
            <Card className={isMobileApp?classes.cardM:classes.cardD}>
                <CardActionArea>
                    <CardContent>
                        <div className={classes.column}>
                            {
                                element&&element.del?
                                    <div className={classes.value}>{name}</div>
                                    :
                                    <TextField
                                        label='??????'
                                        value={name}
                                        className={classes.input}
                                        onChange={handleName}
                                        inputProps={{
                                            'aria-label': 'description',
                                        }}
                                    />
                            }
                            {
                                element&&element.del?
                                    null
                                    :
                                    <>
                                    <Autocomplete
                                        defaultValue={head}
                                        className={classes.input}
                                        options={heads}
                                        getOptionLabel={option => option.name}
                                        onChange={(event, newValue) => {
                                            setHead(newValue)
                                        }}
                                        noOptionsText='???????????? ???? ??????????????'
                                        renderInput={params => (
                                            <TextField {...params} label='?????????????????? ????????????' variant='outlined' fullWidth />
                                        )}
                                    />
                                    <FormControl className={classes.input}>
                                        <InputLabel>??????????????????</InputLabel>
                                        <Select
                                            multiple
                                            value={newSuppliers}
                                            onChange={handleNewSuppliers}
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
                                            {suppliers.map((supplier) => (
                                                <MenuItem key={supplier._id} value={supplier._id}
                                                          style={{background: newSuppliers.includes(supplier._id) ? '#f5f5f5' : '#ffffff'}}>
                                                    {supplier.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl className={classes.input}>
                                        <InputLabel>??????????????????????</InputLabel>
                                        <Select
                                            multiple
                                            value={newSpecialists}
                                            onChange={handleNewSpecialists}
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
                                            {specialists.map((specialist) => (
                                                <MenuItem key={specialist._id} value={specialist._id}
                                                          style={{background: newSpecialists.includes(specialist._id) ? '#f5f5f5' : '#ffffff'}}>
                                                    {specialist.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl className={classes.input}>
                                        <InputLabel>??????????????????????</InputLabel>
                                        <Select
                                            multiple
                                            value={newStaffs}
                                            onChange={handleNewStaffs}
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
                                            {staffs.map((staff) => (
                                                <MenuItem key={staff._id} value={staff._id}
                                                          style={{background: newStaffs.includes(staff._id) ? '#f5f5f5' : '#ffffff'}}>
                                                    {staff.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    </>
                            }
                        </div>
                    </CardContent>
                </CardActionArea>
                <CardActions>
                    {
                        element!==undefined?
                            element.del?
                                <Button onClick={async()=> {
                                    const action = async() => {
                                        await restoreDivision([element._id])
                                        list.splice(idx, 1);
                                        setList([...list])
                                    }
                                    setMiniDialog('???? ???????????????', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                }} size='small' color='primary'>
                                    ??????????????????????
                                </Button>
                                :
                            <>
                            <Button onClick={async()=>{
                                let editElement = {_id: element._id, suppliers: newSuppliers, specialists: newSpecialists, staffs: newStaffs}
                                head = head?head._id:head
                                if(name.length>0&&name!==element.name)editElement.name = name
                                if(head!==element.head)editElement.head = head
                                const action = async() => {
                                    await setDivision(editElement)
                                }
                                setMiniDialog('???? ???????????????', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }} size='small' color='primary'>
                                ??????????????????
                            </Button>
                            <Button size='small' color='primary' onClick={()=>{
                                const action = async() => {
                                    await deleteDivision([element._id])
                                    list.splice(idx, 1);
                                    setList([...list])
                                }
                                setMiniDialog('???? ???????????????', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }}>
                                ??????????????
                            </Button>
                            </>
                            :
                            <Button onClick={async()=> {
                                if (name.length>0) {
                                    const action = async() => {
                                        let category = (await addDivision({name: name, head: head?head._id:head, staffs: newStaffs, suppliers: newSuppliers, specialists: newSpecialists})).addDivision
                                        setName('')
                                        setNewSpecialists([])
                                        setNewSuppliers([])
                                        setNewStaffs([])
                                        setHead(undefined)
                                        setList([category, ...list])
                                    }
                                    setMiniDialog('???? ???????????????', <Confirmation action={action}/>)
                                    showMiniDialog(true)
                                } else
                                    showSnackBar('?????????????????? ?????? ????????')

                            }
                            } size='small' color='primary'>
                                ????????????????
                            </Button>}
                </CardActions>
            </Card>
    );
})

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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CardDivision)