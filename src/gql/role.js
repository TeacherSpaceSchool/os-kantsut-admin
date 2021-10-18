import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getRoles = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $skip: Int) {
                        roles(search: $search, skip: $skip) {
                            _id
                            createdAt
                            name
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getRole = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query (_id: ID!) {
                        role(_id: $_id) {
                            _id
                            createdAt
                            name
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteRole = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteRole(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addRole = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($name: String!) {
                        addRole(name: $name) {
                            _id
                            createdAt
                            name
                        }
                    }`})
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const setRole = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $name: String!) {
                        setRole(_id: $_id, name: $name) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}