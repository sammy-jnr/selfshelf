import React from 'react'
import "./SelectedBook.css"
import { ProcessedBookInterface } from '../../Interface'
import Star from '../../utils/Stars/Star'
import fullStar from "../../Assets/icons/fullStar.svg"
import { Link } from 'react-router-dom'

const SelectedBook = (props: { book: ProcessedBookInterface | undefined }) => {
  if (!props.book) return null
  const book = props.book
  const date = new Date(Number(book.dateAdded))
  return (
    <div className="bookInfoInner">
      <div className="bookInfoInner_Top">
        <div className="bookInfoImageDiv">
          {book.isFavourite && <img src={fullStar} alt="" id='favouriteStar' />}
          <img src={book.imgFile[0]} alt="" className='bookImage2' />
        </div>
        <div className="bookInfoNameDiv">
          <div className="bookInfoItemsDiv">
            <p className='bookInfoItemsKey'>Name</p>
            <p className='bookInfoItemsValue'>{book?.name}</p>
          </div>
          <div className="bookInfoItemsDiv">
            <p className='bookInfoItemsKey'>Author</p>
            <p className='bookInfoItemsValue'>{book?.author}</p>
          </div>
          <div className="bookInfoItemsDiv">
            <p className='bookInfoItemsKey'>Rating</p>
            <div className='bookInfoItemsValue'><Star amount={Number(book?.rating)} /></div>
          </div>
          <div className="bookInfoItemsDiv">
            <p className='bookInfoItemsKey'>Genre</p>
            <div className='bookInfoItemsValue bookInfoCategoriesContainer'>
              {book?.categories.map((category => {
                return <div key={category} className="bookInfoCategories">{category}</div>
              }))}
            </div>
          </div>

        </div>
      </div>
      <div className="bookInfoInner_Bottom">
        <div className="bookInfoItemsDiv">
          <p className='bookInfoItemsKey'>Link</p>
          <p className='bookInfoItemsValue bookInfoLink'>{
            <Link to={book.link ? book.link : ""} className='booklink'>{book.link}</Link>
            ||
            "No link"
          }
          </p>
        </div>
        <div className="bookInfoItemsDiv">
          <p className='bookInfoItemsKey'>Number of pages</p>
          <p className='bookInfoItemsValue'>{book.numberOfPages} Pages</p>
        </div>
        <div className="bookInfoItemsDiv">
          <p className='bookInfoItemsKey'>ISBN</p>
          <p className='bookInfoItemsValue'>{book.ISBN ?? "Not provided"}</p>
        </div>
        <div className="bookInfoItemsDiv">
          <p className='bookInfoItemsKey'>Date added</p>
          <p className='bookInfoItemsValue'>{date.toLocaleString('en-US',{month: "long", year:"numeric"}).split(",")[0]}</p>
        </div>
        <div className="bookInfoItemsDiv">
          <p className='bookInfoItemsKey bookInfoDescriptionKey'>Description</p>
          <p className='bookInfoItemsValue bookInfoDescriptionValue'>{book.description}</p>
        </div>
      </div>
      {book.pdfFile && <div className="bookInfoItemsFileDiv">
        <Link to={book.pdfFile[0]} className='link'>
          <button>Download</button>
        </Link>
      </div>}
    </div>
  )
}

export default SelectedBook