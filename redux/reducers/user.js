import {
    AUTHENTICATED,
    UNAUTHENTICATED,
    SET_PROFILE,
    ERROR_AUTHENTICATED,
    SET_AUTH,
    SETED_PIN_CODE,
    REMOVED_PIN_CODE
} from '../constants/user'

const initialState = {
    authenticated: undefined,
    profile: {},
    error: false,
    pinCode: false,
}

export default function user(state = initialState, action) {
    switch (action.type) {

        case AUTHENTICATED:
            return { ...state, authenticated: true, error: false  };

        case UNAUTHENTICATED:
            return {
                ...state,
                authenticated: false,
                error: false,
                profile: {}
            };

        case ERROR_AUTHENTICATED:
            return { ...state, authenticated: false, error: true  };

        case SETED_PIN_CODE:
            return { ...state, pinCode: true  };
        case REMOVED_PIN_CODE:
            return { ...state, pinCode: false  };

        case SET_PROFILE:
            return { ...state, profile: action.payload };

        case SET_AUTH:
            return { ...state, authenticated: action.payload };

        default:
            return state

    }
}