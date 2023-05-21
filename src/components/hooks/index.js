import {  useQuery,  } from "@tanstack/react-query";
import axios from "axios";


const getUsers = async (filters)=>{
  console.log('filters', filters)
  const response = await axios.get(`http://localhost:3000/paginated?page=${filters?.page}&limit=${filters?.limit}`)
  return response;
}

const getInfiniteUsers = async ()=>{
  const response = await axios.get("http://localhost:3000/paginanted")
  return response;
}

export const useGetUSers = ()=>{
  return useQuery({
    queryKey:["users"],
    queryFn:getUsers
  })
}

export const useInfintiteUSers = (query)=>{
  console.log('query', query)
  return useQuery({
    queryKey:["users"],
    queryFn:getInfiniteUsers
  })
}