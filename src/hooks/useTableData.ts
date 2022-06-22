import { useState, useEffect, useRef } from 'react';

import useFetch from './useFetch';

interface State<T> {
  setParams: (params: any) => void
  params: any
  reloadAndRest: () => void
  tableProps: any
}

interface Options<T> {
  initValues?: T;
  manual?: boolean
  key?: string
}

const initialPagination = {
  currentPage: 1,
  pageSize: 10
}

function useTableData<T = unknown>(
  fetcher?: any,
  initParams: any = {},
  options: Options<T> = {}
): State<T> {

  const [params, setParams] = useState(initParams);
  const [paginationparams, setpagination] = useState(initialPagination);
  const cacheData = useRef<{ list: T[], pagination: any }>()
  const { data = {}, run, status, } = useFetch(fetcher, {}, { manual: true, ...options });
  const { list, currentPage, pageSize, totalSize } = data as any

  const pagination = {
    current: currentPage,
    total: totalSize,
    pageSize
  }

  // 更新或者删除列表时候保留查询参数
  const reloadAndRest = () => {
    setpagination({ ...paginationparams, ...initialPagination })
  }

  useEffect(
    () => {
      if (list) {
        cacheData.current = { list, pagination }
      }
    }, [list])

  // 初始化加载
  useEffect(
    () => {
      run({ ...params, ...paginationparams, ...initialPagination })
    }, [params]
  )

  useEffect(
    () => {
      // 第一次只run初始化加载的部分
      if (cacheData.current) {
        run({ ...params, ...paginationparams })
      }
    }, [paginationparams]
  )

  const tableProps = {
    pagination: pagination.current ? pagination : cacheData.current?.pagination,
    dataSource: list,
    // dataSource: status === "fetched" ? list : list || cacheData.current?.list,
    loading: status === "fetching",
    onChange: (pagination: any, filters: any, sorter: any, extra: any) => {
      setpagination({ currentPage: pagination.current, pageSize: pagination.pageSize })
    },
    request: () => run({ ...params, ...paginationparams })
  }

  return {
    setParams,
    params: { ...params, ...paginationparams },
    reloadAndRest,
    tableProps,
  };
}
export default useTableData;
