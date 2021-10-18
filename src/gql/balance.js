import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getBalances = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $skip: Int!) {
                        balances(search: $search, skip: $skip) {
                            _id
                            createdAt
                            amount {name value}
                            supplier {_id name}
                            error
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getBalances1C = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $skip: Int!) {
                        balances1C(search: $search, skip: $skip) {
                            _id
                            createdAt
                            amount {name value}
                            supplier {_id name}
                            error
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getMyBalance = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        myBalance {
                            _id
                            createdAt
                            amount {name value}
                            supplier {_id name}
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getMyBalance1C = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        myBalance1C {
                            _id
                            createdAt
                            amount {name value}
                            supplier {_id name}
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}
