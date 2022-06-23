declare function useLocalStorage<T>(key: string, initialValue?: any): [T, (value: any) => void];
export default useLocalStorage;
