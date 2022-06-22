// https://usehooks-typescript.com/react-hook/use-fetch
import { useEffect, useReducer } from 'react';
const fetchCache = {};
function useFetch(fetcher, params = {}, options = {}) {
    const paramsStr = JSON.stringify(params);
    let cancelRequest = false;
    const { initValues, manual = false, fetchKey } = options;
    const hooksId = Date.now();
    const initialState = {
        status: 'init',
        error: undefined,
        data: initValues,
        run: () => Promise.resolve({})
    };
    // Keep state logic separated
    const fetchReducer = (state, action) => {
        switch (action.type) {
            case 'request':
                return { ...state, status: 'fetching' };
            case 'success':
                return { ...state, status: 'fetched', data: action.payload };
            case 'failure':
                return { ...state, status: 'error', error: action.payload };
            default:
                return state;
        }
    };
    const [state, dispatch] = useReducer(fetchReducer, initialState);
    const { status } = state;
    const run = async (params = {}) => {
        if (!fetcher || state.status === "fetching") {
            return;
        }
        dispatch({ type: 'request' });
        try {
            const response = await (fetcher === null || fetcher === void 0 ? void 0 : fetcher({ ...params }));
            if (cancelRequest)
                return;
            if ((response === null || response === void 0 ? void 0 : response.code) === 0) {
                dispatch({ type: 'success', payload: response === null || response === void 0 ? void 0 : response.resp });
                return response === null || response === void 0 ? void 0 : response.resp;
            }
            else {
                dispatch({ type: 'failure', payload: response === null || response === void 0 ? void 0 : response.info });
            }
        }
        catch (error) {
            if (cancelRequest)
                return;
            dispatch({ type: 'failure', payload: error.message });
        }
    };
    useEffect(() => {
        if (!fetch || manual) {
            return;
        }
        run(params);
        return () => {
            cancelRequest = true;
        };
    }, [fetcher, paramsStr]);
    useEffect(() => {
        var _a;
        if (fetchKey) {
            const obj = {
                id: hooksId,
                cb: (newData) => {
                    // console.log(newData);
                    dispatch({ type: 'success', payload: newData });
                },
            };
            if (fetchCache[fetchKey]) {
                (_a = fetchCache[fetchKey]) === null || _a === void 0 ? void 0 : _a.push(obj);
            }
            else {
                fetchCache[fetchKey] = [obj];
            }
            return () => {
                if (fetchKey) {
                    fetchCache[fetchKey] = fetchCache[fetchKey].filter(item => item.id !== hooksId);
                }
            };
        }
    }, [fetchKey]);
    useEffect(() => {
        if (status === "fetched" && fetchKey) {
            fetchCache[fetchKey].map(({ cb }) => cb(state.data));
        }
    }, [status, fetchKey]);
    return { ...state, run };
}
export default useFetch;
