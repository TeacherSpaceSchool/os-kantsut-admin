import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import dialogContentStyle from '../../src/styleMUI/dialogContent'
import { Map, YMaps, Placemark } from 'react-yandex-maps';
import Fab from '@material-ui/core/Fab';
import GpsFixed from '@material-ui/icons/GpsFixed';
import * as snackbarActions from '../../redux/actions/snackbar'
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Confirmation from './Confirmation'

const PdfViewer =  React.memo(
    (props) =>{
        const { showFullDialog } = props.mini_dialogActions;
        const { classes, pdf } = props;
        return (
            <div className={classes.column}>
                <object style={{height: window.innerHeight-140, width: window.innerWidth-48}} data={pdf} type='application/pdf'>
                    <iframe style={{height: window.innerHeight-145, width: window.innerWidth-48}} src={`https://docs.google.com/viewer?url=${pdf}&embedded=true`}/>
                </object>
                <center>
                    <Button variant='contained' color='secondary' onClick={()=>{showFullDialog(false);}} className={classes.button}>
                            Закрыть
                    </Button>
                </center>
            </div>
        );
    }
)

function mapStateToProps (state) {
    return {
        mini_dialog: state.mini_dialog,
        app: state.app
    }
}

function mapDispatchToProps(dispatch) {
    return {
        snackbarActions: bindActionCreators(snackbarActions, dispatch),
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch)
    }
}

PdfViewer.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(PdfViewer));