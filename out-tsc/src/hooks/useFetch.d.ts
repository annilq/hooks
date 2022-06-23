declare type fetcher<T> = (params: any) => Promise<T> | false | any;
interface State<T> {
    status: 'init' | 'fetching' | 'error' | 'fetched';
    data?: T;
    error?: string;
    run: (params?: any) => Promise<any>;
}
interface Options<T> {
    initValues?: T;
    manual?: boolean;
    fetchKey?: string;
}
declare function useFetch<T = unknown>(fetcher?: fetcher<T>, params?: any, options?: Options<T>): State<T>;
export default useFetch;
