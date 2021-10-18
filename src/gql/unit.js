import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getUnits = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $skip: Int) {
                        units(search: $search, skip: $skip) {
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

export const getUnit = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query (_id: ID!) {
                        unit(_id: $_id) {
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

export const deleteUnit = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteUnit(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addUnit = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($name: String!) {
                        addUnit(name: $name) {
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

export const setUnit = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $name: String) {
                        setUnit(_id: $_id, name: $name) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}