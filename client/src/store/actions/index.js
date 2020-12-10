import * as api from '../../api'

export const signupUser = (userData) => async (dispatch) => {
    dispatch({type: 'AUTH_USER',

    payload: api.signupUser(userData)})

}