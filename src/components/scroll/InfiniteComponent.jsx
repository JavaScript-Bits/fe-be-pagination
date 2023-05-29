import { Box, Heading, VStack } from "@chakra-ui/react";
import axios from "axios";
import { useCallback } from "react";
import { useRef } from "react";
import { useEffect, useState } from "react";

export default function InfiniteComponent() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [allData, setAllData] = useState([])

  //pagination stills
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [hasMore, setHasmore] = useState(false)

  console.log('allData', allData)

  useEffect(()=>{
    setLoading(true)
    setError(false)
    const fetchUsers = async () => {
      try {
        const {data} = await axios.get(`http://localhost:3000/paginated?page=${page}&limit=${limit}`)
        console.log('data', data)
        const newData = [...allData, ...data.results]
        setAllData(newData)
        setHasmore(data?.next)
        setLoading(false)
        
      } catch (error) {
        setError(true)
        setLoading(false)
      }
    }
    fetchUsers()
  },[page, limit])

  console.log('hasMore', hasMore)

///
  const observer = useRef()


  const lastResultElementRef = useCallback(node => {
    if (loading) return //do not do anything
    
    if (observer.current) observer.current.disconnect() //if there's a current observer instance running

    observer.current = new IntersectionObserver(entries => { //else create a new one
      
      if (entries[0].isIntersecting && hasMore) {
        //if it's intersecting
        console.log('page', entries[0])
        setPage(prevPageNo => prevPageNo + 1)
      } 
    })

    if (node) observer.current.observe(node)
  }, [loading, hasMore])

  
  const textRef = useRef()

  console.log('textRef', textRef.current)

  if(loading){
    return (
      <Box>Loading.....</Box>
    )
  }

  if (error) {
    return (
      <Box>Error..</Box>
    )
  }
  return (
    <VStack>
      <Heading>Infinite comp</Heading>
      <Box>
        {
          // allData?.map((result, index)=>(
          //   <Box key={index}>
          //     {result?.name}
          //   </Box>
          // ))
          allData?.map((result, index) => {
            if (allData.length === index + 1) {
              return <Box ref={lastResultElementRef} key={result.name}>{result.name}</Box>
            } else {
              return <Box key={result.name}>{result.name}</Box>
            }
          })
        }
      </Box>
    </VStack>   
  )
}
