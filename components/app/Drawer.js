import React, {useState} from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import drawerStyle from '../../src/styleMUI/drawer'
import * as appActions from '../../redux/actions/app'
import * as userActions from '../../redux/actions/user'
import Drawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import UnfoldMoreIcon from '@material-ui/icons/UnfoldMore';
import UnfoldLessIcon from '@material-ui/icons/UnfoldLess';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Badge from '@material-ui/core/Badge';
import Collapse from '@material-ui/core/Collapse';

const MyDrawer = React.memo((props) => {
    const { classes, unread } = props
    const { drawer, isMobileApp } = props.app;
    const { profile, authenticated } = props.user;
    const { showDrawer } = props.appActions;
    let variant = isMobileApp?'temporary' : 'permanent';
    const open = isMobileApp?drawer:true;
    const router = useRouter();
    let [uncover, setUncover] = useState(
        (router.pathname.includes('cashexchange')||router.pathname.includes('memorandum')||router.pathname.includes('expensereport')||router.pathname.includes('waybill')||router.pathname.includes('application')&&router.pathname!=='/autoapplications'||router.pathname.includes('cashconsumable'))&&router.pathname!=='/routes'?'Документы'
        :
            ['/categorys', '/divisions', '/units', '/items', '/routes', '/users', '/roles'].includes(router.pathname)?'Объекты'
            :
                ['/faqs', '/errors', '/trash', '/setting', '/autoapplications', '/unloadinguser', '/unloadingitem'].includes(router.pathname)?'Инструменты'
                    :
                    router.pathname.includes('balance')||router.pathname.includes('statistic')||router.pathname.includes('storage')?'Статистика'
                        :
                        ''
    );
    const uncoverItem = (item)=>{
        setUncover(uncover!==item?item:'')
    };
    return (
        <Drawer
            disableSwipeToOpen = {true}
            disableBackdropTransition = {true}
            onOpen={()=>showDrawer(true)}
            disableDiscovery={true}
            variant= {variant}
            className={classes.drawer}
            open={open}
            onClose={()=>showDrawer(false)}
            classes={{paper: classes.drawerPaper,}}
        >
            {
                isMobileApp?
                    null
                    :
                    <div className={classes.toolbar}/>
            }
            {
                authenticated?
                    <List>
                        <Divider />
                        <ListItem style={{background: (router.pathname.includes('cashexchange')||router.pathname.includes('memorandum')||router.pathname.includes('expensereport')||router.pathname.includes('waybill')||router.pathname.includes('application')&&router.pathname!=='/autoapplications'||router.pathname.includes('cashconsumable'))&&router.pathname!=='/routes'?'#f5f5f5':'#ffffff'}} button onClick={()=>{uncoverItem('Документы')}}>
                            <ListItemText primary='Документы' />
                            <ListItemIcon>{uncover==='Документы'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                            <Badge color='secondary' variant='dot' invisible={!unread.applications&&!unread.cashConsumables&&!unread.waybills&&!unread.expenseReports&&!unread.memorandums}/>
                        </ListItem>
                        <Divider/>
                        <Collapse in={uncover==='Документы'} timeout='auto' unmountOnExit>
                            <List component='div' disablePadding>
                                <Link href={'/applications'}>
                                    <ListItem style={{marginLeft: 16, background:router.pathname.includes('application')&&router.pathname!=='/autoapplications'&&!router.pathname.includes('itemsfromapplications')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <Badge color='secondary' variant='dot' invisible={!unread.applications}/>
                                        <ListItemText primary={'Заявки'} />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                {
                                    ['admin', 'менеджер', 'кассир', 'бухгалтерия', 'снабженец'].includes(profile.role)?
                                        <>
                                        <Link href={'/cashconsumables'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname.includes('cashconsumable')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <Badge color='secondary' variant='dot' invisible={!unread.cashConsumables}/>
                                                <ListItemText primary={'Кассовые расходники'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'менеджер', 'кассир', 'бухгалтерия', 'снабженец'].includes(profile.role)?
                                        <>
                                        <Link href={'/cashexchanges'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname.includes('cashexchange')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <Badge color='secondary' variant='dot' invisible={!unread.cashexchange}/>
                                                <ListItemText primary={'Конвертация денежных средств'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['снабженец'].includes(profile.role)?
                                        <>
                                        <Link href={'/itemsfromapplications'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname.includes('itemsfromapplications')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Лист закупки'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'менеджер', 'снабженец'].includes(profile.role)||profile.addApplication?
                                        <>
                                        <Link href={'/waybills'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname.includes('waybill')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <Badge color='secondary' variant='dot' invisible={!unread.waybills}/>
                                                <ListItemText primary={'Накладные'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    /*['admin', 'менеджер', 'начальник отдела', 'снабженец'].includes(*/profile.role/*)*/?
                                        <>
                                        <Link href={'/expensereports'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname.includes('expensereport')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <Badge color='secondary' variant='dot' invisible={!unread.expenseReports}/>
                                                <ListItemText primary={'Авансовые отчеты'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                <Link href={'/memorandums'}>
                                    <ListItem style={{marginLeft: 16, background:router.pathname.includes('memorandum')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <Badge color='secondary' variant='dot' invisible={!unread.memorandums}/>
                                        <ListItemText primary={'Служебные записки'} />
                                    </ListItem>
                                </Link>
                                <Divider/>
                            </List>
                        </Collapse>
                        {
                            ['admin', 'менеджер', 'снабженец'].includes(profile.role)||profile.addApplication?
                                <>
                                <ListItem style={{background: ['/categorys', '/divisions', '/units', '/items', '/routes', '/users', '/roles'].includes(router.pathname)?'#f5f5f5':'#ffffff'}} button onClick={()=>{uncoverItem('Объекты')}}>
                                    <ListItemText primary='Объекты' />
                                    <ListItemIcon>{uncover==='Объекты'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                                </ListItem>
                                <Divider/>
                                </>
                                :
                                null
                        }
                        <Collapse in={uncover==='Объекты'} timeout='auto' unmountOnExit>
                            <List component='div' disablePadding>
                                {
                                    ['admin', 'менеджер', 'снабженец'].includes(profile.role)||profile.addApplication?
                                        <>
                                        <Link href={'/units'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/units'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Единицы измерения'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'менеджер', 'снабженец'].includes(profile.role)||profile.addApplication?
                                        <>
                                        <Link href={'/categorys'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/categorys'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Категории'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'менеджер'].includes(profile.role)?
                                        <>
                                        <Link href={'/routes'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/routes'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Маршруты'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'менеджер'].includes(profile.role)?
                                        <>
                                        <Link href={'/divisions'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/divisions'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Подразделения'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'менеджер', 'снабженец'].includes(profile.role)||profile.addApplication?
                                        <>
                                        <Link href={'/subdivisions'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/subdivisions'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Под-подразделения'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                <Link href={'/users'}>
                                    <ListItem style={{marginLeft: 16, background:router.pathname==='/users'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary={'Пользователи'} />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                {
                                    ['admin', 'менеджер', 'снабженец'].includes(profile.role)||profile.addApplication?
                                        <>
                                        <Link href={'/sellers'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/sellers'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Поставщики'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'менеджер'].includes(profile.role)?
                                        <>
                                        <Link href={'/roles'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/roles'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Роли'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'менеджер', 'снабженец'].includes(profile.role)||profile.addApplication?
                                        <>
                                        <Link href={'/items'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/items'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Товары'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                            </List>
                        </Collapse>
                        <ListItem style={{background: ['/faqs', '/errors', '/trash', '/setting', '/autoapplications', '/unloadinguser', '/unloadingitem'].includes(router.pathname)?'#f5f5f5':'#ffffff'}} button onClick={()=>{uncoverItem('Инструменты')}}>
                            <ListItemText primary='Инструменты' />
                            <ListItemIcon>{uncover==='Инструменты'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                        </ListItem>
                        <Divider/>
                        <Collapse in={uncover==='Инструменты'} timeout='auto' unmountOnExit>
                            {
                                ['admin', 'менеджер'].includes(profile.role)?
                                    <>
                                    <Link href={'/autoapplications'}>
                                        <ListItem style={{marginLeft: 16, background:router.pathname==='/autoapplications'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                            <ListItemText primary={'Автозакуп'} />
                                        </ListItem>
                                    </Link>
                                    <Divider/>
                                    </>
                                    :
                                    null
                            }
                            <List component='div' disablePadding>
                                <Link href={'/faqs'}>
                                    <ListItem style={{marginLeft: 16, background:router.pathname==='/faqs'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                        <ListItemText primary={'Инструкции'} />
                                    </ListItem>
                                </Link>
                                <Divider/>
                                {
                                    'admin'===profile.role?
                                        <>
                                        <Link href={'/unloadinguser'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/unloadinguser'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Загрузка снабженцев'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    'admin'===profile.role?
                                        <>
                                        <Link href={'/unloadingitem'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/unloadingitem'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Загрузка товаров'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {/*
                                    ['admin', 'менеджер'].includes(profile.role)?
                                        <>
                                        <Link href={'/trash'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/trash'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Корзина'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                */}
                                {
                                    ['admin', 'менеджер'].includes(profile.role)?
                                        <>
                                        <Link href={'/setting'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/setting'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Настройки'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'менеджер'].includes(profile.role)?
                                        <>
                                        <Link href={'/errors'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/errors'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <ListItemText primary={'Сбои'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                            </List>
                        </Collapse>
                        {
                            ['admin', 'менеджер', 'снабженец', 'завсклада'].includes(profile.role)?
                                <>
                                <ListItem style={{background: router.pathname.includes('balance')||router.pathname.includes('statistic')||router.pathname.includes('storage')?'#f5f5f5':'#ffffff'}} button onClick={()=>{uncoverItem('Статистика')}}>
                                    <ListItemText primary='Статистика' />
                                    <ListItemIcon>{uncover==='Статистика'?<UnfoldMoreIcon color='inherit'/>:<UnfoldLessIcon color='inherit'/>}</ListItemIcon>
                                    <Badge color='secondary' variant='dot' invisible={!unread.balances}/>
                                </ListItem>
                                <Divider/>
                                </>
                            :null
                        }
                        <Collapse in={uncover==='Статистика'} timeout='auto' unmountOnExit>
                            <List component='div' disablePadding>
                                {
                                    ['admin', 'менеджер', 'снабженец'].includes(profile.role)?
                                        <>
                                        <Link href={'/balances'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/balances'||router.pathname==='/balancehistory'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <Badge color='secondary' variant='dot' invisible={!unread.balances}/>
                                                <ListItemText primary={'Баланс'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'менеджер', 'снабженец'].includes(profile.role)?
                                        <>
                                        <Link href={'/balances1C'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/balances1C'||router.pathname==='/balance1Chistory'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <Badge color='secondary' variant='dot' invisible={!unread.balances1C}/>
                                                <ListItemText primary={'Баланс 1C'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'менеджер', 'снабженец', 'завсклада'].includes(profile.role)?
                                        <>
                                        <Link href={'/storage'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname.includes('storage')?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <Badge color='secondary' variant='dot' invisible={!unread.storage}/>
                                                <ListItemText primary={'Склад'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                        </>
                                        :
                                        null
                                }
                                {
                                    ['admin', 'менеджер', 'снабженец'].includes(profile.role)?
                                        <>
                                        <Link href={'/statisticsupplier'}>
                                            <ListItem style={{marginLeft: 16, background:router.pathname==='/statisticsupplier'?'#f5f5f5':'#ffffff'}} button onClick={()=>{showDrawer(false)}}>
                                                <Badge color='secondary' variant='dot' invisible={!unread.balances}/>
                                                <ListItemText primary={'Статистика снабженцев'} />
                                            </ListItem>
                                        </Link>
                                        <Divider/>
                                    </>
                                    :
                                    null
                                }
                            </List>
                        </Collapse>
                    </List>
                    :
                    null
            }
        </Drawer>
    )
})

function mapStateToProps (state) {
    return {
        app: state.app,
        user: state.user,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        appActions: bindActionCreators(appActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

MyDrawer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(drawerStyle)(MyDrawer))