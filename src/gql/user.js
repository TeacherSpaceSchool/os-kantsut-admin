import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getUsers = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $filter: String!, $skip: Int, $all: Boolean) {
                        users(search: $search, filter: $filter, skip: $skip, all: $all) {
                            _id
                            createdAt
                            login
                            name
                            role
                            status
                            del
                            phone
                            pinCode
                            addApplication
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getFilterUsers = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        filterUser {
                           name
                           value
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const sendPinCode = async(pinCode)=>{
    try{
        let res = await new SingletonApolloClient().getClient()
            .query({
                variables: {pinCode},
                query: gql`
                    query ($pinCode: String) {
                        sendPinCode(pinCode: $pinCode) 
                    }`,
            })
        return res.data.sendPinCode
    } catch(err){
        console.error(err)
    }
}

export const unloadingUser = async({document}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .mutate({
                variables: {document: document},
                mutation: gql`
                    mutation ($document: Upload!) {
                        unloadingUser(document: $document) {
                            data
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getSuppliers = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        suppliers {
                            _id
                            createdAt
                            login
                            name
                            role
                            status
                            del
                            phone
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getStaffs = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        staffs {
                            _id
                            createdAt
                            login
                            phone
                            name
                            role
                            status
                            del
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getHeads = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        heads {
                            _id
                            createdAt
                            login
                            name
                            phone
                            role
                            status
                            del
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getSpecialists = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        specialists {
                            _id
                            createdAt
                            login
                            name
                            role
                            status
                            phone
                            del
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getUsersTrash = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!) {
                        usersTrash(search: $search) {
                            _id
                            createdAt
                            login
                            phone
                            name
                            role
                            status
                            del
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getUser = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query (_id: ID!) {
                        user(_id: $_id) {
                            _id
                            createdAt
                            login
                            name
                            role
                            phone
                            status
                            del
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteUser = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteUser(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const restoreUser = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        restoreUser(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const onoffUser = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        onoffUser(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addUser = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($phone: String, $login: String!, $addApplication: Boolean!, $name: String!, $role: String!, $password: String!) {
                        addUser(phone: $phone, login: $login, name: $name, addApplication: $addApplication, role: $role, password: $password) {
                            _id
                            createdAt
                            login
                            name
                            role
                            status
                            del
                            pinCode
                            addApplication
                        }
                    }`})
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const setUser = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $phone: String, $login: String, $addApplication: Boolean, $name: String, $role: String, $password: String) {
                        setUser(_id: $_id, phone: $phone, login: $login, addApplication: $addApplication, name: $name, role: $role, password: $password) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}