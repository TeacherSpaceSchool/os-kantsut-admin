import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getBalance1CHistory = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($supplier: ID!, $skip: Int!, $date: String!) {
                        balance1CHistory(supplier: $supplier, skip: $skip, date: $date) {
                            _id
                            createdAt
                            amount
                            supplier {_id name}
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}
