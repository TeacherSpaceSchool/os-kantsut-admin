import React from 'react';
import { connect } from 'react-redux'
import cardCategoryStyle from '../src/styleMUI/card'
import Skeleton from '@material-ui/lab/Skeleton';

const CardPlaceholder = React.memo((props) => {
    const classes = cardCategoryStyle();
    const { isMobileApp } = props.app;
    const { height } = props;
    return (
        <div className={isMobileApp?classes.cardM:classes.cardD} style={{height: height?height:100}}>
            <Skeleton variant='rect' height='100%'/>
        </div>
    );
})

function mapStateToProps (state) {
    return {
        user: state.user,
        app: state.app
    }
}

export default connect(mapStateToProps)(CardPlaceholder)