import { usePagination, useTable } from "react-table"
import { TableColumns } from "./columns"
import {  useMemo, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import axios from "axios"


export default function Table() {
  const [pageNumber, setPageNumber] = useState(1)
  const [limit, setPageLimit] = useState(10)


  //fns
  const getUsers = async (pageNumber, limit) => {
    const response = await axios.get(`http://localhost:3000/paginated?page=${pageNumber}&limit=${limit}`)
    return response;
  }

  const { data, isLoading, isError } = useQuery(["users", pageNumber], ()=> getUsers(pageNumber, limit))


 
  const memoizedColumns = useMemo(() => TableColumns, [])
  const memoizedTableData = useMemo(() => data?.data?.results || [], [data])


  console.log('memoizedTableData', memoizedTableData)


  
  //inbuilt fns
  const nextPage = ()=>{
    setPageNumber(pageNumber+ 1)
  }
  



  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    // nextPage,
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
  const handleGoToPage=(e)=>{
    console.log('chan')
    const pageumber = e.target.value ?  Number(e.target.value) - 1 : 0
    gotoPage(pageumber)
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
    <>
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
            <tr {...row.getRowProps()} key={`row-${row.id}`}>
              {row.cells.map(cell => (
                <td {...cell.getCellProps()} key={`cell-${cell.column.id}`}>
                  {cell.render('Cell')}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
     <div>
      <span>
        Go to page : 
        <input onChange={e => handleGoToPage(e)}  type="number" />
      </span>
      <br />
      <select onChange={e=>{setPageSize(Number(e.target.value))}} value={pageSize}  
      name="page-size" id="pageSize">
        {

        [10, 25, 50].map(pageSize => (
        <option key={pageSize} value={pageSize}>
          show{pageSize}
        </option>
        ))
          }

      </select>
      <br />
        <button disabled={!canPreviousPage} onClick={()=> gotoPage(0)} >{'<<'}</button>
        <button disabled={!canPreviousPage} onClick={() => previousPage()} >Prev</button>
        <button onClick={() => nextPage()} >Next</button>
        <button onClick={() => gotoPage(pageCount - 1 )} >{'>>'}</button>
        <br />
        <span>
          page {pageIndex + 1} of {pageOptions?.length}
        </span>
      </div>
      </>
  )
}
