import { gql } from 'apollo-boost';
import { SingletonApolloClient } from '../singleton/client';
import { SingletonStore } from '../singleton/store';



export const subscriptionData = gql`
  subscription  {
    reloadData {
        type
        ids
        roles
        application 
            {
                _id
                createdAt
                status
                number
                division {_id name suppliers {_id name}}
                category {_id name}
                budget
                note
                paymentType
                official
                dateClose
                term
                amount {name value}
                specialist {_id name}
                supplier {_id name}
                items {GUID name unit price count comment status currency} 
                routes {role confirmation cancel comment}
            }
        cashConsumable 
            {
                _id
                createdAt
                number
                amount
                supplier {_id name}
                comment
                budget
                currencyType
            } 
        cashExchange 
            {
                _id
                createdAt
                number
                supplier {_id name}
                comment
                exchangeFrom
                sync
                currencyTypeFrom
                exchangeTo
                currencyTypeTo
                exchangeRate
                note
            } 
        waybill 
            {
                _id
                createdAt
                status
                number
                dateClose
                acceptSpecialist
                application {_id number amount {name value}}
                seller
                patent
                specialist {_id name}
                supplier {_id name}
                items {name unit price count comment status currency} 
                amount {name value}
            }
        expenseReport 
            {
                _id
                createdAt
                status
                sync
                number
                dateClose
                acceptHead
                addedItems {name unit price count comment status currency} 
                applications {_id number amount {name value}}
                waybills { _id number seller patent amount {name value} items {name currency unit price count comment status} }
                cashConsumables {_id number amount currencyType}
                supplier {_id name}
                balanceStart {name value}
                receivedAmount {name value}
                expense {name value}
                overExpense {name value}
                outCashbox {name value}
                balanceEnd {name value}
            }
            memorandum
             {
                            _id
                            createdAt
                            status
                            number
                            name
                            comment
                            note
                            term
                            who {_id name}
                            whom {_id name}
                            notifiables {_id name}
                            routes {user {_id} confirmation cancel comment}
                            approve
                            completed
                            checked
                        }
    }
  }
`