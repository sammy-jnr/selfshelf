import { RootState } from "./store"
import { useSelector } from "react-redux"
import { Outlet, Navigate, useLocation } from "react-router-dom"

const ProtectedRoutes = () => {

  const location = useLocation()
  const store = useSelector((store: RootState) => store)
  const initialLoading = store.auth.initialLoading
  const isLoggedIn = store.auth.isLoggedIn

  if(initialLoading)return null
  return (
    isLoggedIn ? <Outlet/> : <Navigate to={"/register"} state={{ from: location }} replace/>
  )
}

export default ProtectedRoutes