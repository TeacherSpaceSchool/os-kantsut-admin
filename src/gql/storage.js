import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getStorages = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($search: String!, $skip: Int!) {
                        storages(search: $search, skip: $skip) {
                            _id
                            createdAt
                            count
                            item {_id name}
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const getStorageHistory = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($item: ID!, $skip: Int!, $date: String!) {
                        storageHistory(item: $item, skip: $skip, date: $date) {
                            _id
                            createdAt
                            count
                            item {_id name}
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}
