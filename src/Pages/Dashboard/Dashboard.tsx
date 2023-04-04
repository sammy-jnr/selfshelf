import { useRef, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./Dashboard.css"
import { BookInterface, ProcessedBookInterface } from '../../Interface'
import Star from '../../utils/Stars/Star'
import closeDarkblue from "../../Assets/icons/closeDarkblue.svg"
import editIcon from "../../Assets/icons/editIcon.svg"
import trashIcon from "../../Assets/icons/trashIcon.svg"
import addIcon from "../../Assets/icons/addIcon.svg"
import downIcon from "../../Assets/icons/downIcon.svg"
import noBookBackground from "../../Assets/images/noBookBackground.png"
import { RootState } from "../../store"
import { useDispatch, useSelector } from "react-redux"
import { setBooksArray, setCategoriesArray } from '../../Features/MainSlice'
import SelectedBook from '../../utils/SelectedBook/SelectedBook'
import { removeBook, removeCategoryDb } from '../../utils/axiosCalls'
import { toast } from 'react-toastify'


const Dashboard = () => {
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const bookRef = useRef<HTMLDivElement | null>(null)
  const categoryContentRef = useRef<HTMLInputElement | null>(null)

  const dispatch = useDispatch()

  const store = useSelector((store: RootState) => store)
  const booksArray = store.main.booksArray
  const categoryList = store.main.categories



  const [enterCategoryEditMode, setenterCategoryEditMode] = useState(false);

  const [showPopup, setshowPopup] = useState<boolean>(false);
  const [popupReason, setpopupReason] = useState("deleteCategory");

  const [selectedBooksArray, setselectedBooksArray] = useState<ProcessedBookInterface[]>([]);

  const [selectedCategory, setselectedCategory] = useState("All");

  const [selectedBookId, setselectedBookId] = useState<string | null>(null);

  const [baseBookListForSearch, setbaseBookListForSearch] = useState<ProcessedBookInterface[]>([]);

  const [selectedSearchType, setselectedSearchType] = useState<"book" | "author">("book");

  const navigate = useNavigate()


  scrollRef.current?.addEventListener("wheel", (e) => {
    e.preventDefault()
    if (scrollRef.current)
      scrollRef.current.scrollLeft += e.deltaY
  })



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
    let editedBooks:ProcessedBookInterface[] = []
    newBookArray.forEach(book => {
      if (book.categories.length === 1 && book.categories[0] === category) {
        return
      } else {
        if (book.categories.includes(category)) {
          const newBookCategory = book.categories.filter(element => element !== category)
          const newBook = { ...book, categories: newBookCategory }
          editedBooks.push(newBook)
        }else{
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



  const books = selectedBooksArray.map(book => {
    return (
      <div key={book.id} className="book hoverable" ref={bookRef}
        onClick={() => {
          setselectedBookId(book.id)
        }}
      >
        <div className='bookImg'>
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
        {book.isFavourite && <p className='favouriteText'>Favourite</p>}
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

  const DisplayCategoryList = () => {
    return (
      <div className='categoriesList' ref={scrollRef}>
        <div className='category hoverable'
          style={selectedCategory === "All" ? selectedCategoryStyle : {}}
          onClick={() => {
            if (enterCategoryEditMode) return
            setselectedBookId(null)
            setselectedCategory("All")
          }}
        >All</div>
        {
          categoryList.map((category) => {
            return <div className='category hoverable' key={category}
              style={selectedCategory === category ? selectedCategoryStyle : {}}
              onClick={() => {
                if (enterCategoryEditMode) return
                setselectedBookId(null)
                setselectedCategory(category)
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
    )
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
      <header>
        <div className='dashboardHeader1'>
          <h2>My shelf</h2>
          <div>
            <img src="" alt="" className='profileImg' />
            <p className='profileName'>sammy</p>
          </div>
        </div>
        <div className='dashboardHeader2'>
          <h2>Categories
            <div className='hoverable'>
              <img src={editIcon} alt=""
                onClick={() => setenterCategoryEditMode(prev => !prev)} />
            </div>
          </h2>
          <DisplayCategoryList />
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