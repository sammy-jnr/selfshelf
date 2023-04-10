import './App.css';
import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './Pages/Home/Home';
import Dashboard from './Pages/Dashboard/Dashboard';
import AddBook from './Pages/Addbook/AddBook';
import BookInfo from './Pages/BookInfo/BookInfo';
import Register from './Pages/Register/Register';
import Login from './Pages/Register/Login';
import { getCookie, setCookie } from './utils/cookies';
import { getNewAccessToken, getUser } from './utils/axiosCalls';
import { RootState } from "./store"
import { useDispatch, useSelector } from "react-redux"
import { setInitialLoading, setIsLoggedIn } from './Features/AuthSlice';
import { setBooksArray, setCategoriesArray, setUsername } from './Features/MainSlice';
import { ProcessedBookInterface } from './Interface';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import GoogleOnboarding from './Pages/Onboarding/GoogleOnboarding';
import ProtectedRoutes from './ProtectedRoutes';



function App() {

  const dispatch = useDispatch()

  const store = useSelector((store: RootState) => store)
  const isLoggedIn = store.auth.isLoggedIn

  const fetchUserInfoFromDB = () => {
    if (isLoggedIn) return
    getUser()
      .then((res) => {
        const { books, categories, username } = res.data
        dispatch(setBooksArray(books.sort((a: ProcessedBookInterface, b: ProcessedBookInterface) => a.name.localeCompare(b.name))))
        dispatch(setCategoriesArray(categories))
        dispatch(setUsername(username))
        dispatch(setInitialLoading(false))
        dispatch(setIsLoggedIn(true))
      })
      .catch(() => {
        dispatch(setInitialLoading(false))
      })
  }


  useEffect(() => {
    if (getCookie("accessToken")) {
      fetchUserInfoFromDB()
    } else {
      const refreshToken = getCookie("refreshToken")
      if (refreshToken) {
        const userEmail = localStorage.getItem("email")
        if (!userEmail) {
          dispatch(setIsLoggedIn(false))
          dispatch(setInitialLoading(false))
          return
        }
        getNewAccessToken(userEmail)
          .then((res) => {
            const { accessToken, refreshToken, books, categories, username } = res.data
            setCookie("accessToken", accessToken, 1)
            setCookie("refreshToken", refreshToken, 7)
            dispatch(setBooksArray(books.sort((a: ProcessedBookInterface, b: ProcessedBookInterface) => a.name.localeCompare(b.name))))
            dispatch(setCategoriesArray(categories))
            dispatch(setUsername(username))
            dispatch(setInitialLoading(false))
            dispatch(setIsLoggedIn(true))
          })
          .catch(() => {
            dispatch(setIsLoggedIn(false))
            dispatch(setInitialLoading(false))
          })
      } else {
        dispatch(setIsLoggedIn(false))
        dispatch(setInitialLoading(false))
      }
    }
  }, [isLoggedIn]);

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        pauseOnFocusLoss
        pauseOnHover
        theme="light"
      />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/addbook" element={<AddBook />} />
            <Route path="/dashboard/info/:bookId" element={<BookInfo />} />
          </Route>
          <Route path="/:action/authenticate/google" element={<GoogleOnboarding />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
