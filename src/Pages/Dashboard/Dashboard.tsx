import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./Dashboard.css"
import { ProcessedBookInterface } from '../../Interface'
import Star from '../../utils/Stars/Star'
import closeDarkblue from "../../Assets/icons/closeDarkblue.svg"
import editIcon from "../../Assets/icons/editIcon.svg"
import trashIcon from "../../Assets/icons/trashIcon.svg"
import addIcon from "../../Assets/icons/addIcon.svg"
import downIcon from "../../Assets/icons/downIcon.svg"
import noBookBackground from "../../Assets/images/noBookBackground.png"
import { RootState } from "../../store"
import { useDispatch, useSelector } from "react-redux"
import { setBooksArray, setCategoriesArray, setDashboardScrollPosition, setSelectedCategory, setUsername } from '../../Features/MainSlice'
import SelectedBook from '../../utils/SelectedBook/SelectedBook'
import { changeNameDb, removeBook, removeCategoryDb } from '../../utils/axiosCalls'
import { toast } from 'react-toastify'
import { removeCookie } from '../../utils/cookies'
import { setIsLoggedIn } from '../../Features/AuthSlice'


const Dashboard = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const bookRef = useRef<HTMLDivElement | null>(null)
  const categoryContentRef = useRef<HTMLInputElement | null>(null)
  const changeNameRef = useRef<HTMLInputElement | null>(null)

  const dispatch = useDispatch()

  const store = useSelector((store: RootState) => store)
  const booksArray = store.main.booksArray
  const username = store.main.username
  const categoryList = store.main.categories
  const dashboardScrollPosition = store.main.dashboardScrollPosition
  const selectedCategory = store.main.selectedCategory


  const [enterCategoryEditMode, setenterCategoryEditMode] = useState(false);

  const [showPopup, setshowPopup] = useState<boolean>(false);
  const [popupReason, setpopupReason] = useState("deleteCategory");

  const [selectedBooksArray, setselectedBooksArray] = useState<ProcessedBookInterface[]>([]);

  const [selectedBookId, setselectedBookId] = useState<string | null>(null);

  const [baseBookListForSearch, setbaseBookListForSearch] = useState<ProcessedBookInterface[]>([]);

  const [selectedSearchType, setselectedSearchType] = useState<"book" | "author">("book");

  const [showChangeNameDiv, setshowChangeNameDiv] = useState<boolean>(false);

  const [showProfileOptions, setshowProfileOptions] = useState<boolean>(false);

  const [changeNameLoading, setchangeNameLoading] = useState<boolean>(false);

  const navigate = useNavigate()

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollLeft = dashboardScrollPosition
  }, [scrollRef.current, dashboardScrollPosition]);

  useEffect(() => {
    const closeProfileOptions = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target || !target.parentElement || !target.parentElement.parentElement || !target.parentElement.parentElement.parentElement || !target.parentElement.parentElement.parentElement.parentElement) return
      if (
        !target.classList.contains("profileOptions") &&
        !target.classList.contains("profileName") &&
        !target.parentElement.classList.contains("profileOptions") &&
        !target.parentElement.parentElement.classList.contains("profileOptions") &&
        !target.parentElement.parentElement.parentElement.classList.contains("profileOptions") &&
        !target.parentElement.parentElement.parentElement.parentElement.classList.contains("profileOptions")
      ) {
        setshowChangeNameDiv(false)
        setshowProfileOptions(false)
      }
    }
    window.addEventListener("click", (e) => closeProfileOptions(e))
    return () => {
      window.removeEventListener("click", (e) => closeProfileOptions(e))
    }
  }, []);

  useEffect(() => {
    const unselectBook = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target || !target.parentElement || !target.parentElement.parentElement || !target.parentElement.parentElement.parentElement || !target.parentElement.parentElement.parentElement.parentElement) return
      if (
        !target.classList.contains("book") &&
        !target.parentElement.classList.contains("book") &&
        !target.parentElement.parentElement.classList.contains("book") &&
        !target.parentElement.parentElement.parentElement.classList.contains("book") &&
        !target.parentElement.parentElement.parentElement.parentElement.classList.contains("book")
      ) {
        setselectedBookId(null)
      }
    }
    window.addEventListener("click", (e) => unselectBook(e))
    return () => {
      window.removeEventListener("click", (e) => unselectBook(e))
    }
  }, []);


  useEffect(() => {
    if (selectedCategory === "All") {
      setselectedBooksArray(booksArray)
      setbaseBookListForSearch(booksArray)
    } else {
      setselectedBooksArray(booksArray.filter(book => book.categories.includes(selectedCategory)))
      setbaseBookListForSearch(booksArray.filter(book => book.categories.includes(selectedCategory)))
    }
  }, [booksArray, selectedCategory]);



  const selectedCategoryStyle = {
    backgroundColor: "#1b199999",
    color: "white"
  }



  const removeCategory = (category: string) => {
    const deleteCategoryConsent = localStorage.getItem("deleteCategoryConsent")
    if (!deleteCategoryConsent || deleteCategoryConsent !== "true") {
      setshowPopup(true)
      setpopupReason(`deleteCategory ${category}`)
      return
    } else {
      removeCategoryFunc(category)
    }
  }

  const removeCategoryFunc = (category: string) => {
    const newBookArray: ProcessedBookInterface[] = structuredClone(booksArray)
    let editedBooks: ProcessedBookInterface[] = []
    newBookArray.forEach(book => {
      if (book.categories.length === 1 && book.categories[0] === category) {
        return
      } else {
        if (book.categories.includes(category)) {
          const newBookCategory = book.categories.filter(element => element !== category)
          const newBook = { ...book, categories: newBookCategory }
          editedBooks.push(newBook)
        } else {
          editedBooks.push(book)
        }
      }
    })
    dispatch(setBooksArray(editedBooks.sort((a: ProcessedBookInterface, b: ProcessedBookInterface) => a.name.localeCompare(b.name))))

    const newCategoryList = categoryList.filter((item => item !== category))
    dispatch(setCategoriesArray(newCategoryList))

    removeCategoryDb(editedBooks, newCategoryList)
      .catch((error) => {
        console.log(error)
        toast("Couldn't add book, reload and try again.", { type: "error" })
      })
  }

  const search = (searchString: string) => {
    setselectedBookId(null)
    if (searchString === "") {
      setselectedBooksArray(baseBookListForSearch)
    }
    if (selectedSearchType === "book") {
      const filteredBooks = baseBookListForSearch.filter(book => book.name.toLowerCase().startsWith(searchString.toLowerCase()))
      setselectedBooksArray(filteredBooks)
    }
    if (selectedSearchType === "author") {
      const filteredBooks = baseBookListForSearch.filter(book => book.author.toLowerCase().startsWith(searchString.toLowerCase()))
      setselectedBooksArray(filteredBooks)
    }
  }


  const ProfileOptions = () => {
    return (
      <div className='profileOptions'>
        {!showChangeNameDiv &&
          <div className="profileOptions1">
            <button
              onClick={() => { setshowChangeNameDiv(true) }}
            >Change Name</button>
            <button
              onClick={() => {
                removeCookie("accessToken")
                removeCookie("refreshToken")
                dispatch(setIsLoggedIn(false))
                navigate("/")
              }}
            >Log out</button>
          </div>}
        {showChangeNameDiv &&
          <div className='profileOptions2'>
            <input type="text" name='name' ref={changeNameRef} placeholder='Enter new name' />
            <button
              onClick={() => {
                if (changeNameLoading || !changeNameRef.current) return
                if (changeNameRef.current.value === "") return
                setchangeNameLoading(true)
                changeNameDb(changeNameRef.current.value)
                  .then((res) => {
                    if (!changeNameRef.current) return
                    dispatch(setUsername(res.data))
                    setchangeNameLoading(false)
                    setshowChangeNameDiv(false)
                    setshowProfileOptions(false)
                    changeNameRef.current.value = ""
                  })
                  .catch(() => {
                    toast("Couldn't update name", { type: "error" })
                    setchangeNameLoading(false)
                  })
              }}
            >
              {changeNameLoading ? <span className='generalLoadingIconSmall'></span> : "Submit"}
            </button>
          </div>
        }
      </div>
    )
  }




  const books = selectedBooksArray.map(book => {
    return (
      <div key={book.id} className="book hoverable" ref={bookRef}
        onClick={() => {
          setselectedBookId(book.id)
        }}
      >
        <div className='bookImgDiv'>
          {book.isFavourite && <p className='favouriteText'>Favourite</p>}
          <img src={book.imgFile[0]} alt="" className='bookImage' />
        </div>
        <div className='bookBasicInfo'>
          <h2>{book.name}</h2>
          <Star amount={Number(book.rating)} />
          <div className="bookCategories">
            {book.categories.map((category) => {
              return <p key={category}>{category}</p>
            })}
          </div>
        </div>
        {selectedBookId === book.id &&
          <Link to={`/dashboard/info/${book.id}`}>
            <img src={downIcon} alt="" className='showMore' />
          </Link>
        }
        {selectedBookId === book.id &&
          <img src={trashIcon} alt="" className='deleteBookIcon'
            onClick={() => {
              setshowPopup(true)
              setpopupReason(`deleteBook`)
            }}
          />
        }
      </div>
    )
  })

  const DashboardPopup = () => {
    return (
      <div className='dashboardPopup'>
        {
          popupReason.split(" ")[0] === "deleteCategory"
            ?
            <div className='deleteCategoryContainer'>
              <p>Deleting a category deletes that category from all books with that category and if it is the only category in the book it deletes the book </p>
              <div className='deleteCategoryInputDiv'>
                <label htmlFor='categoryContent' className='hoverable'>
                  <input className='hoverable' type="checkbox" name="categoryContent" id="categoryContent" ref={categoryContentRef} />
                  Don't show again
                </label>
              </div>
              <div className='deleteCategoryButtons'>
                <button
                  onClick={() => {
                    setshowPopup(false)
                    setpopupReason("")
                  }}
                >Back</button>
                <button
                  onClick={() => {
                    if (categoryContentRef.current?.checked) {
                      localStorage.setItem("deleteCategoryConsent", "true")
                    }
                    removeCategoryFunc(popupReason.split(" ")[1])
                    setshowPopup(false)
                    setpopupReason("")
                  }}

                >Delete</button>
              </div>
            </div>
            :
            <div className='yesNoDiv'>
              <p>Are you sure?</p>
              <div>
                <button
                  onClick={() => {
                    setshowPopup(false)
                    setpopupReason("")
                  }}
                >No</button>
                <button
                  onClick={() => {
                    if (popupReason === "deleteBook") {
                      const newBookArray = booksArray.filter(item => selectedBookId !== item.id)
                      dispatch(setBooksArray(newBookArray))
                      setshowPopup(false)
                      setpopupReason("")
                      selectedBookId && removeBook(selectedBookId)
                    }
                  }}
                >Yes</button>
              </div>
            </div>
        }
      </div>
    )
  }


  return (
    <div className='dashboardContainer'>
      {showPopup && <DashboardPopup />}
      {showProfileOptions && <ProfileOptions />}
      <header>
        <div className='dashboardHeader1'>
          <h2>My shelf</h2>
          <div>
            <img src="" alt="" className='profileImg' />
            <p className='profileName hoverable'
              onClick={() => {
                setshowProfileOptions(prev => !prev)
                setshowChangeNameDiv(false)
              }}
            >{username ?? "Anonymous"}</p>
          </div>
        </div>
        <div className='dashboardHeader2'>
          <h2>Categories
            <div className='hoverable'>
              <img src={editIcon} alt=""
                onClick={() => setenterCategoryEditMode(prev => !prev)} />
            </div>
          </h2>
          <div className='categoriesList' ref={scrollRef}>
            <div className='category hoverable'
              style={selectedCategory === "All" ? selectedCategoryStyle : {}}
              onClick={() => {
                if (enterCategoryEditMode) return
                setselectedBookId(null)
                dispatch(setSelectedCategory("All"))
                scrollRef.current && dispatch(setDashboardScrollPosition(0))
              }}
            >All</div>
            {
              categoryList.map((category) => {
                return <div className='category hoverable' key={category}
                  style={selectedCategory === category ? selectedCategoryStyle : {}}
                  onClick={() => {
                    if (enterCategoryEditMode) return
                    setselectedBookId(null)
                    dispatch(setSelectedCategory(category))
                    scrollRef.current && dispatch(setDashboardScrollPosition(scrollRef.current?.scrollLeft))
                  }}
                >
                  {category}
                  {enterCategoryEditMode &&
                    <img src={closeDarkblue} alt=''
                      onClick={() => removeCategory(category)}
                      className='mediumIcon' />}
                </div>
              })
            }
          </div>
        </div>
      </header>
      <div className='searchSection'>
        <input type="text" placeholder='Search shelf'
          onChange={(e) => { search(e.target.value) }}
        />
        <div>
          <button
            style={selectedSearchType === "book" ? selectedCategoryStyle : {}}
            onClick={() => setselectedSearchType("book")}
            className='searchForBook'>book</button>
          <button
            style={selectedSearchType === "author" ? selectedCategoryStyle : {}}
            onClick={() => setselectedSearchType("author")}
            className='searchForAuthor'>author</button>
        </div>
      </div>

      {
        booksArray.length === 0
          ?
          <Link to={"/addbook"}>
            <div className='firstBookDiv'>
              <p>Add your first book</p>
              <img src={addIcon} alt="" />
            </div>
          </Link>
          :
          selectedBooksArray.length === 0
            ?
            <div className='noBookMatch'>No match</div>
            :
            <div className='dashboardBody'>
              <section className='dashboardBody1'>
                {selectedBookId
                  ?
                  <SelectedBook book={selectedBooksArray.find(book => book.id === selectedBookId)} />
                  :
                  <img src={noBookBackground} alt="" />
                }
              </section>
              <section className='dashboardBody2'>
                {books}
              </section>
            </div>
      }

      <button className='addBookButton'
        onClick={() => navigate("/addbook")}
      >
        Add book
      </button>
    </div>
  )
}

export default Dashboard