import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getSetting = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        setting {
                            _id
                            createdAt 
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const setSetting = async(element)=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            variables: {...element},
            mutation : gql`
                    mutation ($supplier: String) {
                        setSetting(supplier: $supplier) {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}

export const clearStorage = async()=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            mutation : gql`
                    mutation {
                        clearStorage {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}