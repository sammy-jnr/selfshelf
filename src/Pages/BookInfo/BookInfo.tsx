import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import "./BookInfo.css"
import arrowBack from "../../Assets/icons/arrowBack.svg"
import { RootState } from "../../store"
import { useSelector } from "react-redux"
import SelectedBook from '../../utils/SelectedBook/SelectedBook'


const BookInfo = () => {
  const params = useParams()

  const store = useSelector((store: RootState) => store)
  const books = store.main.booksArray
  const book = books.find(book => book.id === params.bookId)
  
  const navigate = useNavigate()

  if (!book) return null
  return (
    <div className='bookInfoContainer'>
      <header>
        <img src={arrowBack} alt=""
          onClick={() => navigate("/dashboard")}
        />
        <p>{book.name}</p>
      </header>
      <SelectedBook book={book} />
    </div>
  )
}

export default BookInfo