import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getDivisions = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $skip: Int) {
                        divisions(search: $search, skip: $skip) {
                            _id
                            createdAt
                            name
                            del
                            suppliers{
                                _id
                                createdAt
                                login
                                name
                                role
                                status
                            }
                            staffs{
                                _id
                                createdAt
                                login
                                name
                                role
                                status
                            }
                            head{
                                _id
                                createdAt
                                login
                                name
                                role
                                status
                            }
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getDivision = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!) {
                        divisions(search: $search) {
                            _id
                            createdAt
                            name
                            del
                            suppliers{
                                _id
                                createdAt
                                login
                                name
                                role
                                status
                            }
                            staffs{
                                _id
                                createdAt
                                login
                                name
                                role
                                status
                            }
                            head{
                                _id
                                createdAt
                                login
                                name
                                role
                                status
                            }
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getDivisionsTrash = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!) {
                        divisionsTrash(search: $search) {
                            _id
                            createdAt
                            name
                            del
                            suppliers{
                                _id
                                createdAt
                                login
                                name
                                role
                                status
                            }
                            staffs{
                                _id
                                createdAt
                                login
                                name
                                role
                                status
                            }
                            head{
                                _id
                                createdAt
                                login
                                name
                                role
                                status
                            }
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const addDivision = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($name: String!, $suppliers: [ID]!, $staffs: [ID]!, $head: ID) {
                        addDivision(name: $name, suppliers: $suppliers, staffs: $staffs, head: $head) {
                            _id
                            createdAt
                            name
                            del
                            suppliers{
                                _id
                                createdAt
                                login
                                name
                                role
                                status
                            }
                            staffs{
                                _id
                                createdAt
                                login
                                name
                                role
                                status
                            }
                            head{
                                _id
                                createdAt
                                login
                                name
                                role
                                status
                            }
                        }
                    }`})
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const setDivision = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $name: String, $suppliers: [ID], $head: ID, $staffs: [ID]) {
                        setDivision(_id: $_id, name: $name, suppliers: $suppliers, head: $head, staffs: $staffs) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const deleteDivision = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteDivision(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const restoreDivision = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        restoreDivision(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}