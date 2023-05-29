import { usePagination, useTable } from "react-table"
import { TableColumns } from "./columns"
import {  useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Box, Button, HStack, Heading, Input, VStack } from "@chakra-ui/react"


export default function CustomTable() {
  const [pageNumber, setPageNumber] = useState(1)
  const [limit, setPageLimit] = useState(10)


  //fns
  const getUsers = async (pageNumber, limit) => {
    const response = await axios.get(`http://localhost:3000/paginated?page=${pageNumber}&limit=${limit}`)
    return response;
  }

  const { data, isLoading, isError } = useQuery(["users", pageNumber, limit], ()=> getUsers(pageNumber, limit))

 
  const memoizedColumns = useMemo(() => TableColumns, [])
  const memoizedTableData = useMemo(() => data?.data?.results || [], [data])

  console.log('memoizedTableData', memoizedTableData)


  //inbuilt fns
 
  const previousPage = () => {
    console.log('pageNumber', pageNumber)
    pageNumber !== 1 ?
    setPageNumber(pageNumber - 1): setPageNumber(1)
  }

 
  // const setPageSize = (limit) => {
  //   console.log('limit', limit)
  //   setPageLimit(limit)
  // }
  

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    // nextPage,
    // canNextPage,
    // canPreviousPage,
    // previousPage,
    prepareRow,
    pageOptions,
    // pageCount,
    state,
    // setPageSize,
    // gotoPage
  } = useTable({
    columns: memoizedColumns,
    data: memoizedTableData
  }, usePagination)


  const nextPage = () => {
    setPageNumber(pageNumber + 1)
  }


  //nav to page 
  const handleGoToPage=(e)=>{
    const pageNumber = e.target.value
    setPageNumber(pageNumber? pageNumber: 0)
  }

  const {pageIndex, pageSize} = state;
  if(isLoading){
    return (
      <p>loading...</p>
    )
  }

  if (isError || !data) {
    return <p>Error fetching data.</p>;
  }


  return (
    <VStack spacing={8}>
      <Heading >Custom Table</Heading>
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
            <tr style={{border:"1px"}}  {...row.getRowProps()} key={`row-${row.id}`}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()} key={`cell-${cell.column.id}`}>
                  <Box paddingY={4} >

                  {cell.render('Cell')}
                  </Box>
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
      <VStack>
      <HStack>
      <Input 
      placeholder="Go to page .." 
      onChange={e => handleGoToPage(e)}  
      type="number" 
      // value={pageNumber} 
      />
          {/* <Select
            onChange={(e) => setPageSize(Number(e.target.value))}
            value={pageSize}
            name="page-size"
            id="pageSize"
          >
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                show {pageSize}
              </option>
            ))}
          </Select> */}
      </HStack>
      <HStack>
        <button onClick={()=> setPageNumber(1)}>{'<<'}</button>
        <Button onClick={() => previousPage()}>Prev</Button>
        <Button onClick={() => nextPage()} >Next</Button>
        <button onClick={() => setPageNumber(3 )} >{'>>'}</button>
        </HStack>
        <span>
          page {pageIndex + 1} of {pageOptions?.length}
        </span>
      </VStack>
      </VStack>
  )
}
