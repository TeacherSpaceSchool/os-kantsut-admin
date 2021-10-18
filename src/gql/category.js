import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';

export const getCategorys = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $skip: Int) {
                        categorys(search: $search, skip: $skip) {
                            _id
                            createdAt
                            name
                            del
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getCategorysTrash = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!) {
                        categorysTrash(search: $search) {
                            _id
                            createdAt
                            name
                            del
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getCategory = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query (_id: ID!) {
                        category(_id: $_id) {
                            _id
                            createdAt
                            name
                            del
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteCategory = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteCategory(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const restoreCategory = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        restoreCategory(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addCategory = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($name: String!) {
                        addCategory(name: $name) {
                            _id
                            createdAt
                            name
                            del
                        }
                    }`})
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const setCategory = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $name: String) {
                        setCategory(_id: $_id, name: $name) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}