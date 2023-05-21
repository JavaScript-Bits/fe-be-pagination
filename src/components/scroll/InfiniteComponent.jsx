import React, { useState } from 'react'
import { useInfintiteUSers } from '../hooks'

export default function InfiniteComponent() {

  const [page, setPage] = useState(0)
  const [limit, setLimit] = useState(10)

  const {data } = useInfintiteUSers({page, limit});

  
  return (
    <div>InfiniteComponent</div>
  )
}
