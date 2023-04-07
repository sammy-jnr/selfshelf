import axios from "axios"
import { getCookie } from "./cookies"
import { ProcessedBookInterface } from "../Interface";

const accessTokenCookie = getCookie("accessToken")
const refreshTokenCookie = getCookie("refreshToken")

const headers = {
  "Content-Type": "application/json",
  authorization: `Bearer ${accessTokenCookie}`,
};



// const baseUrl = "https://selfshelfbackend.onrender.com"
const baseUrl = "http://localhost:5000"

export const registerNewUser = (username:string,email:string,password:string) => {
  return axios({
    withCredentials: true,
    url: `${baseUrl}/register`,
    method: "post",
    data:{
      username,
      email,
      password
    }
  })
}
export const loginDB = (email:string,password:string) => {
  return axios({
    withCredentials: true,
    url: `${baseUrl}/login`,
    method: "post",
    data:{
      email,
      password
    }
  })
}

export const registerGoogle = (code:string, username:string, password:string) => {
  return axios({
    withCredentials: true,
    url: `${baseUrl}/registerGoogle`,
    method: "post",
    data:{
      code,
      username,
      password
    }
  })
}
export const loginGoogle = (code:string) => {
  return axios({
    withCredentials: true,
    url: `${baseUrl}/loginGoogle`,
    method: "post",
    data:{
      code
    }
  })
}


export const getUser = () => {
  return axios({
    withCredentials: true,
    url: `${baseUrl}/user`,
    method: "get",
    headers
  })
}

export const getNewAccessToken = (email:string) => {
  return axios({
    withCredentials: true,
    url: `${baseUrl}/newAccessToken`,
    method: "post",
    data: {
      refreshToken: refreshTokenCookie,
      email
    }
  })
}

export const changeNameDb = (newName:string) => {
  return axios({
    withCredentials: true,
    url: `${baseUrl}/changeName`,
    method: "post",
    data:{
      newName
    },
    headers: headers
  })
}

export const createNewCategory = (categoryName:string) => {
  return axios({
    withCredentials: true,
    url: `${baseUrl}/createNewCategory`,
    method: "post",
    data:{
      categoryName
    },
    headers: headers
  })
}
export const removeCategoryDb = (newBooksArray:ProcessedBookInterface[], categoryList:string[]) => {
  return axios({
    withCredentials: true,
    url: `${baseUrl}/deleteCategory`,
    method: "post",
    data:{
      newBooksArray,
      categoryList
    },
    headers: headers
  })
}
export const addNewBook = (bookdata:FormData) => {
  console.log(accessTokenCookie)
  return axios({
    withCredentials: true,
    url: `${baseUrl}/addBook`,
    method: "post",
    data: bookdata,
    headers: {
      "Content-Type": "multipart/form-data",
      authorization: `Bearer ${accessTokenCookie}`,
    }
  })
}
export const removeBook = (bookId:string) => {
  return axios({
    withCredentials: true,
    url: `${baseUrl}/deleteBook`,
    method: "post",
    data:{
      bookId
    },
    headers
  })
}





