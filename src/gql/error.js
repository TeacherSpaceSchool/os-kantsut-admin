import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getErrors = async(client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                query: gql`
                    query {
                        errors {
                            _id
                            createdAt
                            err
                            path
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}

export const clearAllErrors = async()=>{
    try{
        const client = new SingletonApolloClient().getClient()
        await client.mutate({
            mutation : gql`
                    mutation {
                        clearAllErrors {
                             data
                        }
                    }`})
    } catch(err){
        console.error(err)
    }
}