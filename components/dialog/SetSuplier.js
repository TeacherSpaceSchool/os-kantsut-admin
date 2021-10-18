import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import Button from '@material-ui/core/Button';
import dialogContentStyle from '../../src/styleMUI/dialogContent'

const ShippingList =  React.memo(
    (props) =>{
        const { classes, suppliers, setSupplier } = props;
        const { isMobileApp } = props.app;
        const { showMiniDialog } = props.mini_dialogActions;
        const width = isMobileApp? (window.innerWidth-112) : 500
        return (
            <div className={classes.main} style={{width: width}}>
                {
                    suppliers.map((supplier, idx) =>
                        <Button size='small' key={idx} color="primary" onClick={()=>{showMiniDialog(false);setSupplier(supplier)}} className={classes.button}>
                            {supplier.name}
                        </Button>
                    )
                }
                <div>
                    <Button variant="contained" color="secondary" onClick={()=>{showMiniDialog(false);}} className={classes.button}>
                        Закрыть
                    </Button>
                </div>
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
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

ShippingList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(ShippingList));