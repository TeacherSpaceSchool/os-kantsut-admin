import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getBalanceHistory = async(element, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: element,
                query: gql`
                    query ($supplier: ID!, $skip: Int!, $date: String!) {
                        balanceHistory(supplier: $supplier, skip: $skip, date: $date) {
                            _id
                            createdAt
                            removeAmount
                            addAmount
                            supplier {_id name}
                          }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}
