import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getSellers = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $skip: Int) {
                        sellers(search: $search, skip: $skip) {
                            _id
                            createdAt
                            name
                            address
                            phone
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getSeller = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query (_id: ID!) {
                        seller(_id: $_id) {
                            _id
                            createdAt
                            name
                            address
                            phone
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const deleteSeller = async(_id)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {_id: _id},
            mutation : gql`
                    mutation ($_id: [ID]!) {
                        deleteSeller(_id: $_id) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const addSeller = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        let res = await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($name: String!, $address: String, $phone: String) {
                        addSeller(name: $name, address: $address, phone: $phone) {
                            _id
                            createdAt
                            name
                            address
                            phone
                        }
                    }`})
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const setSeller = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: element,
            mutation : gql`
                    mutation ($_id: ID!, $name: String, $address: String, $phone: String) {
                        setSeller(_id: $_id, name: $name, address: $address, phone: $phone) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}