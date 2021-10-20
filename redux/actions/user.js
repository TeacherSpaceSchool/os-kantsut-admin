import {
    AUTHENTICATED,
    UNAUTHENTICATED,
    SET_PROFILE,
    SET_AUTH,
    ERROR_AUTHENTICATED,
    SETED_PIN_CODE,
    REMOVED_PIN_CODE
} from '../constants/user'
import {
    SHOW_MINI_DIALOG
} from '../constants/mini_dialog'
import {
    SET_COUNT_BASKET,
    SHOW_LOAD
} from '../constants/app'
import Cookies from 'js-cookie';
import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../../src/singleton/client';
import { unregister, register } from '../../src/subscribe';
import Router from 'next/router';

export function signup(payload) {
    return async (dispatch) => {
        await dispatch({
            type: SHOW_LOAD,
            payload: true
        })
        try {
            const client = new SingletonApolloClient().getClient()
            let result = await client.mutate({
                variables: payload,
                mutation : gql`
                    mutation ($login: String!, $password: String!) {
                        signupuser(login: $login, password: $password) {
                           role
                           status
                           login
                           _id
                        }
                    }`})
            if(result.data.signupuser.role==='Проверьте данные') {
                await dispatch({
                    type: ERROR_AUTHENTICATED,
                    payload: true
                })
                await dispatch({
                    type: SHOW_LOAD,
                    payload: false
                })
            }
            else {
                await dispatch({
                    type: SHOW_MINI_DIALOG,
                    payload: false
                })
                /*
                await dispatch({type: AUTHENTICATED});
                await dispatch({
                    type: SET_PROFILE,
                    payload: result.data.signupuser
                })*/
                //await window.location.reload()
                await register(true)
                await Router.push(`/client/${result.data.signupuser._id}`)
            }
        } catch(error) {
            await dispatch({
                type: SHOW_LOAD,
                payload: false
            })
            dispatch({
                type: ERROR_AUTHENTICATED,
                payload: true
            });
        }
    };
}

export function signin(payload) {
    return async (dispatch) => {
        await dispatch({
            type: SHOW_LOAD,
            payload: true
        })
        try {
            const client = new SingletonApolloClient().getClient();
            let result = await client.mutate({
                variables: payload,
                mutation : gql`
                    mutation ($login: String!, $password: String!) {
                        signinuser(login: $login, password: $password) {
                           role
                           status
                           login
                           _id
                        }
                    }`})
            if(result.data.signinuser.role==='Проверьте данные') {
                await dispatch({
                    type: ERROR_AUTHENTICATED,
                    payload: true
                })
                await dispatch({
                    type: SHOW_LOAD,
                    payload: false
                })
            }
            else {
                await dispatch({
                    type: SHOW_MINI_DIALOG,
                    payload: false
                })
                //await Router.push('/')
                await register(true)
                window.location.reload()

                /*await dispatch({type: AUTHENTICATED});
                await dispatch({
                    type: SET_PROFILE,
                    payload: result.data.signinuser
                })*/
            }
        } catch(error) {
            await dispatch({
                type: SHOW_LOAD,
                payload: false
            })
            await dispatch({
                type: ERROR_AUTHENTICATED,
                payload: true
            })
        }
    };
}

export function checkAuthenticated() {
    return async (dispatch) => {
        try {
            if (Cookies.get('jwt')) {
                dispatch ({type: AUTHENTICATED});
            } else {
                dispatch ({type: UNAUTHENTICATED});
            }
        } catch (error) {
            dispatch ({type: UNAUTHENTICATED});
        }
    };
}

export function setedPinCode() {
    return {
        type: SETED_PIN_CODE
    }
}

export function removedPinCode() {
    return {
        type: REMOVED_PIN_CODE
    }
}

export function setAuthenticated(auth) {
    return {
        type: SET_AUTH,
        payload: auth
    }
}

export function logout(reload) {
    return async (dispatch) => {
        await dispatch({
            type: SHOW_LOAD,
            payload: true
        })
        await dispatch({
            type: UNAUTHENTICATED,
        })
        await Cookies.remove('jwt');
        await dispatch({
            type: SET_COUNT_BASKET,
            payload: 0
        })
        await dispatch({
            type: SET_PROFILE,
            payload: {}
        })
        if(reload) {
            await unregister()
            await Router.push('/')
            window.location.reload()
        }
        else
            await dispatch({
                type: SHOW_LOAD,
                payload: false
            })
    }
}

export function setProfile() {
    return async (dispatch) => {
        try {
            const client = new SingletonApolloClient().getClient()
            let result = await client
                .query({
                    query: gql`
                    query {
                        getStatus {
                           role
                           status
                           login
                           _id
                           addApplication
                          }
                    }`
                })

            await dispatch({
                type: SET_PROFILE,
                payload: result.data.getStatus
            })
        } catch(error) {
            console.error(error)
        }
    };
}

export async function getProfile(client) {
    try {
        console.log('getStatus1', client.toString())
        client = client? client : new SingletonApolloClient().getClient()
        console.log('getStatus2')
        let result = await client
            .query({
                query: gql`
                   query {
                       getStatus {
                          role
                          status
                          login
                          _id
                          addApplication
                         }
                   }`
            })
        console.log('getStatus3', result.data.getStatus)
        return result.data.getStatus
    } catch(error) {
        console.error(error)
    }
}