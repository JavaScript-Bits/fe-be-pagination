import { usePagination, useTable } from "react-table"
import { TableColumns } from "./columns"
import { useGetNormalUSers } from "./hooks"
import { useMemo } from "react"
import { Button, ButtonSpinner, HStack, Heading, Input, Select, VStack } from "@chakra-ui/react"


export default function NormalTable() {
  const { data, isLoading, isError } = useGetNormalUSers()

  const memoizedColumns = useMemo(() => TableColumns, [])
  const memoizedTableData = useMemo(() => data?.data || [], [data])



  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    canNextPage,
    canPreviousPage,
    previousPage,
    prepareRow,
    pageOptions,
    pageCount,
    state,
    setPageSize,
    gotoPage
  } = useTable({
    columns: memoizedColumns,
    data: memoizedTableData
  }, usePagination)


  //nav to page 
  const handleGoToPage = (e) => {
    const pageumber = e.target.value ? Number(e.target.value) - 1 : 0
    gotoPage(pageumber)
  }

  const { pageIndex, pageSize } = state;
  if (isLoading) {
    return (
      <p>loading...</p>
    )
  }

  if (isError || !data) {
    return <p>Error fetching data.</p>;
  }



  return (
    <VStack spacing={8}>
      <Heading>Normal Table</Heading>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={`header-${headerGroup.id}`}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} key={`header-${column.id}`}>
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr  {...row.getRowProps()} key={`row-${row.id}`}>
                {row.cells.map(cell => (
                  <td  {...cell.getCellProps()} key={`cell-${cell.column.id}`}>
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <VStack spacing={1} >
        <HStack alignItems={"center"}>
          <Input placeholder="go to page" onChange={e => handleGoToPage(e)} type="number" />
        <Select onChange={e => { setPageSize(Number(e.target.value)) }} value={pageSize}
          name="page-size" id="pageSize">
          {
            [10, 25, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                show {pageSize}
              </option>
            ))
          }
        </Select>
        </HStack>
        <HStack marginTop={4}>
        <button disabled={!canPreviousPage} onClick={() => gotoPage(0)} >{'<<'}</button>
        <Button disabled={!canPreviousPage} onClick={() => previousPage()}>Prev</Button>
        <Button disabled={!canNextPage} onClick={() => nextPage()}>Next</Button>
        <button disabled={!canNextPage} onClick={() => gotoPage(pageCount - 1)} >{'>>'}</button>
        </HStack>
        <br />
        <span>
          page {pageIndex + 1} of {pageOptions?.length}
        </span>
      </VStack>
    </VStack>
  )
}
