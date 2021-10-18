import React from 'react';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

let getMuiTheme = () => createMuiTheme({
    overrides: {
        MUIDataTableBodyCell: {
            root: {
                textOverflow: 'ellipsis',
                maxHeight: '400px',
                maxWidth: '200px',
                overflow: 'hidden',
                wordWrap: 'break-word'
            }
        },
        MuiPaper: {
            root: {
                minWidth: '100%',
            },
            elevation4:{
                boxShadow: 'none'
            }
        }

    }
})

const MyTable =  React.memo(
    (props) =>{
        const { columns, row, dateStart, dateEnd } = props;
        let data = row.map(row=>row.data)
        const options = {
            customSort: (data, colIndex, order) => {
                data = data.sort(function(a, b) {
                    return order==='desc'?
                        parseInt(b.data[colIndex]) - parseInt(a.data[colIndex])
                        :
                        parseInt(a.data[colIndex]) - parseInt(b.data[colIndex])
                });
                return data
            },
            selectableRows: 'none',
            print: false,
            pagination: true,
            rowsPerPage: 1000,
            rowsPerPageOptions: [1000],
            count: data.length,
            responsive: 'scroll',
            downloadOptions: {filename: 'tableDownload.csv', separator: ','},
            onCellClick: (colData, colMeta) => {
                if(row[colMeta.rowIndex]&&row[colMeta.rowIndex]._id&&dateStart&&dateEnd)
                    window.open(`/applications?supplier=${row[colMeta.rowIndex]._id}&dateStart=${dateStart}&dateEnd=${dateEnd}`,'_blank');
            },
        };
        return (
            <div  style={{zoom: 0.94, width: '100%'}}>
                <MuiThemeProvider theme={getMuiTheme()}>
                    <MUIDataTable
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </MuiThemeProvider>
            </div>
        );
    }
)

export default MyTable;