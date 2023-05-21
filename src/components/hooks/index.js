import {  useQuery,  } from "@tanstack/react-query";
import axios from "axios";



const getNormalUsers = async ()=>{
  const response = await axios.get("http://localhost:3000/users")
  return response;
}

export const useGetNormalUSers = ()=>{
  return useQuery({
    queryKey:["users"],
    queryFn:getNormalUsers
  })
}



const getInfiniteUsers = async ()=>{
  const response = await axios.get("http://localhost:3000/paginanted")
  return response;
}

export const useInfintiteUSers = (query)=>{
  console.log('query', query)
  return useQuery({
    queryKey:["users"],
    queryFn:getInfiniteUsers
  })
}