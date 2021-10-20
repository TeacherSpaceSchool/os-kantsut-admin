import React, { useEffect, useState } from 'react';
import AppBar from '../components/app/AppBar'
import Dialog from '../components/app/Dialog'
import PinCode from '../components/app/PinCode'
import FullDialog from '../components/app/FullDialog'
import SnackBar from '../components/app/SnackBar'
import Drawer from '../components/app/Drawer'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as userActions from '../redux/actions/user'
import * as appActions from '../redux/actions/app'
import * as snackbarActions from '../redux/actions/snackbar'
import CircularProgress from '@material-ui/core/CircularProgress';
import '../scss/app.scss'
import Router from 'next/router'
import { useRouter } from 'next/router';
import { useBottomScrollListener } from 'react-bottom-scroll-listener';
import { useSubscription } from '@apollo/react-hooks';
import { subscriptionData } from '../src/gql/data';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';

export const mainWindow = React.createRef();
export const alert = React.createRef();

const App = React.memo(props => {
    const { setProfile, logout, removedPinCode } = props.userActions;
    const { setIsMobileApp, setShowLightbox, setShowAppBar } = props.appActions;
    const { profile, authenticated, pinCode } = props.user;
    const { load, search, showLightbox, imagesLightbox, indexLightbox, showAppBar } = props.app;
    let { checkPagination, sorts, filters, pageName, dates, searchShow, setList, list, defaultOpenSearch } = props;
    const { showSnackBar } = props.snackbarActions;
    const router = useRouter();
    const [unread, setUnread] = useState({});
    const [reloadPage, setReloadPage] = useState(false);
    useEffect( ()=>{
        /*if(authenticated&&!profile.role)
            setProfile()
        else if(!authenticated&&profile.role)
            logout(false)*/
    },[authenticated])
    useEffect( ()=>{
        if(mainWindow.current&&mainWindow.current.offsetWidth<900) {
            setIsMobileApp(true)
        }
    },[mainWindow])
    useEffect( ()=>{
        if(process.browser) {
            //window.addEventListener('blur', () => {removedPinCode()})
            window.addEventListener('offline', ()=>{showSnackBar('Нет подключения к Интернету')})
        }
    },[process.browser])

    Router.events.on('routeChangeStart', async (url, err)=>{
        if (!router.pathname.includes(url)&&!router.asPath.includes(url)&&!reloadPage)
            setReloadPage(true)
        if (err&&err.cancelled&&reloadPage)
            setReloadPage(false)
    })

    const containerRef = useBottomScrollListener(async()=>{
        if(checkPagination) {
            await setReloadPage(true)
            await checkPagination()
            await setReloadPage(false)
        }
    });


    let subscriptionDataRes = useSubscription(subscriptionData);
    useEffect( ()=>{
        /*if (
            subscriptionDataRes &&
            authenticated &&
            profile.role &&
            subscriptionDataRes.data &&
            subscriptionDataRes.data.reloadData
        ) {
            if(subscriptionDataRes.data.reloadData.memorandum){
                if (router.pathname === '/memorandums') {
                    if (subscriptionDataRes.data.reloadData.type === 'ADD'&&!search.length) {
                        setList([subscriptionDataRes.data.reloadData.memorandum, ...list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'SET') {
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.memorandum._id) {
                                _list[i] = subscriptionDataRes.data.reloadData.memorandum
                            }
                        }
                        setList([..._list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'DELETE') {
                        let index = undefined
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.memorandum._id) {
                                index = i
                            }
                        }
                        if(index!==undefined) {
                            _list.splice(index, 1);
                            setList([..._list])
                        }
                    }
                }
                else {
                    if (!unread.memorandums) {
                        unread.memorandums = true
                        setUnread({...unread})
                    }
                    if (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate)
                        navigator.vibrate(200);
                }

            }
            else if(subscriptionDataRes.data.reloadData.application){
                if (router.pathname === '/applications') {
                    if (subscriptionDataRes.data.reloadData.type === 'ADD'&&!search.length) {
                        setList([subscriptionDataRes.data.reloadData.application, ...list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'SET') {
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.application._id) {
                                _list[i] = subscriptionDataRes.data.reloadData.application
                            }
                        }
                        setList([..._list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'DELETE') {
                        let index = undefined
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.application._id) {
                                index = i
                            }
                        }
                        if(index!==undefined) {
                            _list.splice(index, 1);
                            setList([..._list])
                        }
                    }
                }
                else {
                    if (!unread.applications) {
                        unread.applications = true
                        setUnread({...unread})
                    }
                    if (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate)
                        navigator.vibrate(200);
                }

            }
            else if(subscriptionDataRes.data.reloadData.cashExchange){
                if (router.pathname === '/cashexchanges') {
                    if (subscriptionDataRes.data.reloadData.type === 'ADD'&&!search.length) {
                        setList([subscriptionDataRes.data.reloadData.cashExchanges, ...list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'SET') {
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.cashExchanges._id) {
                                _list[i] = subscriptionDataRes.data.reloadData.cashExchanges
                            }
                        }
                        setList([..._list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'DELETE') {
                        let index = undefined
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.cashExchanges._id) {
                                index = i
                            }
                        }
                        if(index!==undefined) {
                            _list.splice(index, 1);
                            setList([..._list])
                        }
                    }
                }
                else {
                    if (!unread.cashExchanges) {
                        unread.cashExchanges = true
                        setUnread({...unread})
                    }
                    if (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate)
                        navigator.vibrate(200);
                }

            }
            else if(subscriptionDataRes.data.reloadData.cashConsumable){
                if (router.pathname === '/cashconsumables') {
                    if (subscriptionDataRes.data.reloadData.type === 'ADD'&&!search.length) {
                        setList([subscriptionDataRes.data.reloadData.cashConsumable, ...list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'SET') {
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.cashConsumable._id) {
                                _list[i] = subscriptionDataRes.data.reloadData.cashConsumable
                            }
                        }
                        setList([..._list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'DELETE') {
                        let index = undefined
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.cashConsumable._id) {
                                index = i
                            }
                        }
                        if(index!==undefined) {
                            _list.splice(index, 1);
                            setList([..._list])
                        }
                    }
                }
                else {
                    if (!unread.cashConsumables) {
                        unread.cashConsumables = true
                        setUnread({...unread})
                    }
                    if (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate)
                        navigator.vibrate(200);
                }

            }
            else if(subscriptionDataRes.data.reloadData.waybill){
                if (router.pathname === '/waybills') {
                    if (subscriptionDataRes.data.reloadData.type === 'ADD'&&!search.length) {
                        setList([subscriptionDataRes.data.reloadData.waybill, ...list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'SET') {
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.waybill._id) {
                                _list[i] = subscriptionDataRes.data.reloadData.waybill
                            }
                        }
                        setList([..._list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'DELETE') {
                        let index = undefined
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.waybill._id) {
                                index = i
                            }
                        }
                        if(index!==undefined) {
                            _list.splice(index, 1);
                            setList([..._list])
                        }
                    }
                }
                else {
                    if (!unread.waybills) {
                        unread.waybills = true
                        setUnread({...unread})
                    }
                    if (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate)
                        navigator.vibrate(200);
                }

            }
            else if(subscriptionDataRes.data.reloadData.expenseReport){
                if (router.pathname === '/expensereports') {
                    if (subscriptionDataRes.data.reloadData.type === 'ADD'&&!search.length) {
                        setList([subscriptionDataRes.data.reloadData.expenseReport, ...list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'SET') {
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.expenseReport._id) {
                                _list[i] = subscriptionDataRes.data.reloadData.expenseReport
                            }
                        }
                        setList([..._list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'DELETE') {
                        let index = undefined
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.expenseReport._id) {
                                index = i
                            }
                        }
                        if(index!==undefined) {
                            _list.splice(index, 1);
                            setList([..._list])
                        }
                    }
                }
                else {
                    if (!unread.expenseReports) {
                        unread.expenseReports = true
                        setUnread({...unread})
                    }
                    if (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate)
                        navigator.vibrate(200);
                }
            }
            else if(subscriptionDataRes.data.reloadData.balance){
                if (router.pathname === '/balances') {
                    if (subscriptionDataRes.data.reloadData.type === 'ADD'&&!search.length) {
                        setList([subscriptionDataRes.data.reloadData.balance, ...list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'SET') {
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.balance._id) {
                                _list[i] = subscriptionDataRes.data.reloadData.balance
                            }
                        }
                        setList([..._list])
                    }
                    else if (subscriptionDataRes.data.reloadData.type === 'DELETE') {
                        let index = undefined
                        let _list = [...list]
                        for (let i = 0; i < _list.length; i++) {
                            if (_list[i]._id === subscriptionDataRes.data.reloadData.balance._id) {
                                index = i
                            }
                        }
                        if(index!==undefined) {
                            _list.splice(index, 1);
                            setList([..._list])
                        }
                    }
                }
                else {
                    if (!unread.balances) {
                        unread.balances = true
                        setUnread({...unread})
                    }
                    if (navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate)
                        navigator.vibrate(200);
                }

            }

        }*/
    },[subscriptionDataRes.data])

    return(
        <div ref={mainWindow} className='App'>
            {
                /*!authenticated||pinCode*/false?
                    <>
                    {
                        showAppBar?
                            <>
                            <Drawer unread={unread} setUnread={setUnread}/>
                            <AppBar unread={unread} defaultOpenSearch={defaultOpenSearch} searchShow={searchShow} dates={dates} pageName={pageName} sorts={sorts} filters={filters}/>
                            </>
                            :
                            null
                    }
                    <div ref={containerRef} className='App-body'>
                        {props.children}
                    </div>
                    <FullDialog/>
                    <SnackBar/>
                    {load||reloadPage?
                        <div className='load'>
                            <CircularProgress/>
                        </div>
                        :
                        null
                    }
                    {showLightbox?
                        <Lightbox
                            images={imagesLightbox}
                            startIndex={indexLightbox}
                            onClose={() => {setShowAppBar(true); setShowLightbox(false)}}
                        />
                        :
                        null
                    }
                    </>
                    :
                    <PinCode/>
            }
            <Dialog />
            <audio src='/alert.mp3' ref={alert}/>
        </div>
    )
});

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        userActions: bindActionCreators(userActions, dispatch),
        appActions: bindActionCreators(appActions, dispatch),
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);