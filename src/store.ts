// store.ts
import { createStore } from 'redux';

// Define your initial state
export interface AppState {
    globalVariable: string;
    age: number;
}

// Define your action types
const SET_GLOBAL_VARIABLE = 'SET_GLOBAL_VARIABLE';
const SET_AGE = 'SET_AGE';

// Define your reducer
const initialState: AppState = {
    globalVariable: '',
    age: 0,
};

function rootReducer(state = initialState, action: any) {
    switch (action.type) {
        case SET_GLOBAL_VARIABLE:
            return {
                ...state,
                globalVariable: action.payload,
            };
        case SET_AGE:
            return {
                ...state,
                age: action.payload,
            };
        default:
            return state;
    }
}

// Create the Redux store
const store = createStore(rootReducer);

export const setGlobalVariable = (variable: string) => {
    return {
        type: SET_GLOBAL_VARIABLE,
        payload: variable,
    };
};


export const setAge = (age: number) => {
    return {
        type: SET_AGE,
        payload: age,
    };
};

export default store;