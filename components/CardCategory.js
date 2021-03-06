import React, {useState} from 'react';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import cardCategoryStyle from '../src/styleMUI/card'
import { connect } from 'react-redux'
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import { addCategory, setCategory, deleteCategory, restoreCategory } from '../src/gql/category'
import TextField from '@material-ui/core/TextField';
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../redux/actions/mini_dialog'
import * as snackbarActions from '../redux/actions/snackbar'
import Confirmation from './dialog/Confirmation'
import { checkInt } from '../src/lib'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';

const CardCategory = React.memo((props) => {
    const classes = cardCategoryStyle();
    const { element, setList, idx, list, suppliers } = props;
    const { isMobileApp } = props.app;
    let [name, setName] = useState(element?element.name:'');
    let handleName =  (event) => {
        setName(event.target.value)
    };
    let [newSuppliers, setNewSuppliers] = useState(element?element.suppliers:[]);
    const handleNewSuppliers = (event) => {
        setNewSuppliers(event.target.value);
    };
    let [term, setTerm] = useState(element?element.term:0);
    let handleTerm =  (event) => {
        setTerm(checkInt(event.target.value))
    };
    const { setMiniDialog, showMiniDialog } = props.mini_dialogActions;
    const { showSnackBar } = props.snackbarActions;
    return (
            <Card className={isMobileApp?classes.cardM:classes.cardD}>
                <CardActionArea>
                    <CardContent>
                        <div className={classes.column}>
                            {
                                element&&element.del ?
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
                                element&&element.del ?
                                    <div className={classes.value}>{term}</div>
                                    :
                                    <>
                                    <TextField
                                        type={isMobileApp ? 'number' : 'text'}
                                        label='????????'
                                        value={term}
                                        className={classes.input}
                                        onChange={handleTerm}
                                        inputProps={{
                                            'aria-label': 'description',
                                        }}
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
                                        await restoreCategory([element._id])
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
                                let editElement = {_id: element._id, suppliers: newSuppliers}
                                if(name.length>0&&name!==element.name)editElement.name = name
                                if(term!==undefined&&term!==element.term)editElement.term = term
                                const action = async() => {
                                    await setCategory(editElement)
                                }
                                setMiniDialog('???? ???????????????', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }} size='small' color='primary'>
                                ??????????????????
                            </Button>
                            <Button size='small' color='primary' onClick={()=>{
                                const action = async() => {
                                    await deleteCategory([element._id])
                                    list.splice(idx, 1);
                                    setList([...list])
                                }
                                setMiniDialog('???? ???????????????', <Confirmation action={action}/>)
                                showMiniDialog(true)
                            }}>
                                ??????????????
                            </Button>
                            </>:
                            <Button onClick={async()=> {
                                if (term !== undefined && name.length > 0) {
                                    const action = async() => {
                                        let category = (await addCategory({term: term, name: name, suppliers: newSuppliers})).addCategory
                                        setTerm(0)
                                        setName('')
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

export default connect(mapStateToProps, mapDispatchToProps)(CardCategory)