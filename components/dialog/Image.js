import React  from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as mini_dialogActions from '../../redux/actions/mini_dialog'
import dialogContentStyle from '../../src/styleMUI/dialogContent'

const Image =  React.memo(
    (props) =>{
        const { classes, imgSrc } = props;
        const { showFullDialog } = props.mini_dialogActions;
        return (
            <img style={{
                width: '100%',
                height: '100%',
                objectFit: 'scale-down'
            }} src={imgSrc} onClick={()=>{showFullDialog(false)}}/>
        );
    }
)

function mapStateToProps () {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        mini_dialogActions: bindActionCreators(mini_dialogActions, dispatch),
    }
}

Image.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(dialogContentStyle)(Image));