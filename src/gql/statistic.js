import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';

export const getStatisticSupplier = async({dateStart, dateType}, client)=>{
    try{
        client = client? client : new SingletonApolloClient().getClient()
        let res = await client
            .query({
                variables: {dateStart: dateStart, dateType: dateType},
                query: gql`
                    query ($dateStart: Date, $dateType: String) {
                        statisticSupplier(dateStart: $dateStart, dateType: $dateType) {
                            columns
                            row 
                                {_id data}
                        }
                    }`,
            })
        return res.data
    } catch(err){
        console.error(err)
    }
}
