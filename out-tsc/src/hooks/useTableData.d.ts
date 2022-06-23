interface State<T> {
    setParams: (params: any) => void;
    params: any;
    reloadAndRest: () => void;
    tableProps: any;
}
interface Options<T> {
    initValues?: T;
    manual?: boolean;
    key?: string;
}
declare function useTableData<T = unknown>(fetcher?: any, initParams?: any, options?: Options<T>): State<T>;
export default useTableData;
