// https://usehooks-typescript.com/react-hook/use-fetch
import { useEffect, useReducer } from 'react';
// 引入 manual 实现手动触发请求
// 引入 fetchKey 来实现跨组件数据共享

interface FetchItem {
  id: number
  cb: (data: any) => void
}

const fetchCache: Record<string, FetchItem[]> = {
};

type fetcher<T> = (params: any) => Promise<T> | false |any
interface State<T> {
  status: 'init' | 'fetching' | 'error' | 'fetched';
  data?: T;
  error?: string;
  run: (params?: any) => Promise<any>
}

interface Options<T> {
  initValues?: T;
  manual?: boolean
  fetchKey?: string
}

// discriminated union type
type Action<T> =
  | { type: 'request' }
  | { type: 'success'; payload: T }
  | { type: 'failure'; payload: string };
function useFetch<T = unknown>(
  fetcher?: fetcher<T>,
  params: any = {},
  options: Options<T> = {}
): State<T> {
  const paramsStr = JSON.stringify(params);
  let cancelRequest = false;

  const { initValues, manual = false, fetchKey } = options

  const hooksId = Date.now();

  const initialState: State<T> = {
    status: 'init',
    error: undefined,
    data: initValues,
    run: () => Promise.resolve({})
  };

  // Keep state logic separated
  const fetchReducer = (state: State<T>, action: Action<T>): State<T> => {
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

  const run = async (params: any = {}) => {
    if (!fetcher || state.status === "fetching") { return }
    dispatch({ type: 'request' });
    try {
      const response = await fetcher?.({ ...params });
      if (cancelRequest) return;
      if (response?.code === 0) {
        dispatch({ type: 'success', payload: response?.resp });
        return response?.resp
      } else {
        dispatch({ type: 'failure', payload: response?.info });
      }
    } catch (error) {
      if (cancelRequest) return;
      dispatch({ type: 'failure', payload: error.message });
    }
  };

  useEffect(
    () => {
      if (!fetch || manual) {
        return;
      }

      run(params);
      return () => {
        cancelRequest = true;
      };
    }, [fetcher, paramsStr]);


  useEffect(
    () => {

      if (fetchKey) {
        const obj = {
          id: hooksId,
          cb: (newData) => {
            // console.log(newData);
            dispatch({ type: 'success', payload: newData });
          },
        }
        if (fetchCache[fetchKey]) {
          fetchCache[fetchKey]?.push(obj)
        } else {
          fetchCache[fetchKey] = [obj]
        }
        return () => {
          if (fetchKey) {
            fetchCache[fetchKey] = fetchCache[fetchKey].filter(item => item.id !== hooksId)
          }
        }
      }

    }, [fetchKey]
  );


  useEffect(
    () => {
      if (status === "fetched" && fetchKey) {
        fetchCache[fetchKey].map(({ cb }) => cb(state.data))
      }
    }, [status, fetchKey]
  );


  return { ...state, run };
}
export default useFetch;
