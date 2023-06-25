import React from "react";
import { server } from "@/config/index";
import useSWR from "swr";
import NavBar from "./NavBar";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function GetSideCategories() {
  const { data, error, isLoading } = useSWR(`/api/category`, fetcher);

  // console.log("data inside useSWR = ", data);

  return {
    data,
    isLoading,
    isError: error,
  };
}

function SideBar() {
  const { data, error, isLoading } = GetSideCategories();
  // const {topics} = data;
  
  if (isLoading) {
    return <div> Loading ... </div>;
  }

  if (error) {
    return <div> Error fetching side topics </div>;
  }

  const {data: categories} = data;
  // console.log("data inside sideBar = ", data);
  // console.log("categories inside sideBar = ", categories);

  if(categories === undefined || categories === null) {
    return <div> No categories found. Please check your connection and whether the categories exist in database or not.</div>
  }

  if(categories.length === 0){
    return <div> No categories found. Please add some categories before proceeding.</div>
  }

  return (
    <NavBar items={categories} path="donations" />
  );
}

export default SideBar;
