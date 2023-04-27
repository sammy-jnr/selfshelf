import React, { useState, useRef } from 'react'
import "./AddBook.css"
import arrowBack from "../../Assets/icons/arrowBack.svg"
import closeIcon from "../../Assets/icons/closeIcon.svg"
import closeDarkblue from "../../Assets/icons/closeDarkblue.svg"
import pdfThumbnail from "../../Assets/images/pdfThumbnail.png"
import { RootState } from "../../store"
import { useDispatch, useSelector } from "react-redux"
import { setBooksArray, setCategoriesArray } from '../../Features/MainSlice'
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Rating } from 'react-simple-star-rating'
import { useNavigate } from 'react-router-dom'
import { addNewBook, createNewCategory } from '../../utils/axiosCalls'
import { toast } from 'react-toastify'
const AddBook = () => {

  const bookNameRef = useRef<HTMLInputElement>(null)
  const bookDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const bookAuthorRef = useRef<HTMLInputElement>(null)
  const bookNumberOfPagesRef = useRef<HTMLInputElement>(null)
  const bookISBNRef = useRef<HTMLInputElement>(null)
  const bookLinkRef = useRef<HTMLInputElement>(null)
  const bookIsFavouriteRef = useRef<HTMLInputElement>(null)

  const newGenreRef = useRef<HTMLInputElement>(null)
  const cropperRef = useRef<ReactCropperElement>(null);
  const fileRef: React.Ref<HTMLInputElement> = useRef(null)

  const [isLoading, setisLoading] = useState(false);

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const [selectedCategories, setselectedCategories] = useState<string[]>(["Comedy"]);

  const [showAddCategoryPopup, setshowAddCategoryPopup] = useState(true);

  const [categoryNameExists, setcategoryNameExists] = useState(false);

  const [maxSelectableCategories, setmaxSelectableCategories] = useState(false);

  const [croppedImage, setcroppedImage] = useState<File>();

  const [imageDataUrl, setimageDataUrl] = useState<string | null>(null);

  const [pdfFile, setpdfFile] = useState<File | null>(null);

  const [bookRating, setbookRating] = useState<number>(0)



  const store = useSelector((store: RootState) => store)
  const categories = store.main.categories
  const booksArray = store.main.booksArray

  const selectedCategoryStyle = {
    backgroundColor: "#02022b",
    color: "white"
  }

  const onCrop = async () => {
    const cropper = cropperRef.current?.cropper;
    if (!cropper) return
    const blob = await (await fetch(cropper.getCroppedCanvas().toDataURL())).blob();
    const file = new File([blob], 'profile.jpg', { type: "image/jpeg" });
    cropper && setcroppedImage(file)
  };

  const onNewImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (files) {
      const file = files[0]
      if (file.size > 5048000) {
        if (fileRef.current)
          fileRef.current.value = ""
        toast("File must be less than 5MB", { type: "error" })
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => {
        if (typeof (e.target?.result) === "string") {
          setimageDataUrl(e.target?.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }



  const sendBook = () => {
    if (isLoading) return
    setisLoading(true)
    const name = bookNameRef.current?.value
    const author = bookAuthorRef.current?.value
    const ISBN = bookISBNRef.current?.value ?? ""
    const description = bookDescriptionRef.current?.value
    const numberOfPages = bookNumberOfPagesRef.current?.value
    const link = bookLinkRef.current?.value ?? ""
    const isFavourite = bookIsFavouriteRef.current?.checked ?? false
    const imgFile = croppedImage
    const pdf = pdfFile
    const categories = selectedCategories
    const rating = bookRating

    if (pdfFile && pdfFile?.size > 5048000) {
      toast("Pdf is too large, max size(5MB)", { type: "error" })
      setisLoading(false)
      return
    }

    if (!name || !author || !description || !numberOfPages || !imgFile || categories.length < 1) {
      toast("Some mandatory fields are still empty", {
        type: "error"
      })
      setisLoading(false)
      return
    }

    const bookdata = new FormData()
    bookdata.append("imgFile", imgFile)
    bookdata.append("link", link)
    bookdata.append("name", name)
    bookdata.append("id", "")
    bookdata.append("author", author)
    bookdata.append("description", description)
    bookdata.append("rating", `${rating}`)
    bookdata.append("dateAdded", "")
    categories.forEach((category) => {
      bookdata.append("categories", category)
    })
    pdf && bookdata.append("pdfFile", pdf)
    bookdata.append("numberOfPages", `${numberOfPages}`)
    bookdata.append("ISBN", `${ISBN}`)
    bookdata.append("isFavourite", `${isFavourite}`)

    const entries = bookdata.entries()
    for (let entry of entries) {
      console.log(entry)
    }
    addNewBook(bookdata)
      .then((res) => {
        dispatch(setBooksArray([...booksArray, res.data.book]))
        setisLoading(false)
        navigate("/dashboard")
      })
      .catch(() => {
        setisLoading(false)
      })
  }

  const displayAllCategories = categories.map((category) => {
    return (
      <div className='hoverable' key={category}
        style={selectedCategories.includes(category) ? selectedCategoryStyle : {}}
        onClick={() => {
          setmaxSelectableCategories(false)
          if (selectedCategories.includes(category)) {
            setselectedCategories(prev => prev.filter(item => item !== category))
          } else {
            if (selectedCategories.length > 3) {
              setmaxSelectableCategories(true)
              return
            }
            setselectedCategories(prev => [...prev, category])
          }
        }}
      >
        <p>{category}</p>
      </div>
    )
  })



  return (
    <div className='addBookContainer'>
      <header>
        <img src={arrowBack} alt=""
          className='hoverable'
          onClick={() => navigate("/dashboard")}
        />
        <h2>Add book</h2>
      </header>
      <div className="addBookContainerInner">
        <input type="text" className="addBookItems" placeholder='Name' ref={bookNameRef} />
        <input type="text" className="addBookItems" placeholder='Author' ref={bookAuthorRef} />
        <input type="number" className="addBookItems" placeholder='Number of pages' min={0} ref={bookNumberOfPagesRef} />
        <textarea name="" id="addBookItemTextarea" placeholder='Write a Description/ Summary' ref={bookDescriptionRef}></textarea>
        <label htmlFor="addBookItemFavouriteCheckbox" className="addBookItemFavourite hoverable">
          <input type="checkbox" name="addBookItemFavouriteCheckbox" id="addBookItemFavouriteCheckbox" ref={bookIsFavouriteRef} />
          Add to favourites
        </label>
        <input type="text" className="addBookItems" placeholder='ISBN(optional)' ref={bookISBNRef} />
        <input type="link" className="addBookItems" placeholder='Link to an online copy(Optional)' ref={bookLinkRef} />
        <div className="addBookItemCategoriesDiv">
          <div className='addBookItemCategoriesDiv_line1'>
            <p>Select genre</p>
            <button
              onClick={() => setshowAddCategoryPopup(prev => !prev)}
            >{showAddCategoryPopup ? "close" : "select"}</button>
          </div>
          {showAddCategoryPopup && <div>
            <div className='displayAllCategoryList'>
              {displayAllCategories}
            </div>
            {maxSelectableCategories && <p className="errorText">Maximum of three genres</p>}

            <div className="createNewCategoryText">
              <p>Create new genre</p>
              <div className='createNewCategoryInputDiv'>
                <input type="text"
                  placeholder='Genre name'
                  spellCheck={false}
                  ref={newGenreRef}
                  maxLength={25}
                  onFocus={() => setcategoryNameExists(false)}
                />
                <button
                  onClick={() => {
                    if (newGenreRef.current?.value === "" || !newGenreRef.current?.value) return
                    let err = false
                    categories.forEach((category) => {
                      if (category.toLowerCase() === newGenreRef.current?.value.toLowerCase()) {
                        err = true
                        return
                      }
                    })
                    if (err) {
                      setcategoryNameExists(true)
                      return
                    }
                    dispatch(setCategoriesArray([...categories, newGenreRef.current?.value]))
                    createNewCategory(newGenreRef.current.value)
                      .catch((error) => {
                        const newCategoriesArray = categories.filter(category => category !== error.response.data)
                        setCategoriesArray(newCategoriesArray)
                      })
                    newGenreRef.current.value = ""
                  }}
                >Create</button>
              </div>
            </div>
            {categoryNameExists && <p className="errorText">This genre already exists</p>}
          </div>
          }
        </div>
        <div className="addBookItemImageDiv">
          {!imageDataUrl ?
            <div className='addBookItemImageDiv_noFile'>
              <input type="file" onChange={(e) => onNewImage(e)} />
              <p>Click to add Image</p>
            </div>
            :
            <div className='addBookItemImageDiv_file'>

              <Cropper
                src={imageDataUrl ? imageDataUrl : ""}
                initialAspectRatio={1 / 1}
                guides={false}
                crop={onCrop}
                ref={cropperRef}
                className="imagePreview"
              />
              <img src={closeDarkblue} alt=""
                onClick={() => {
                  setimageDataUrl(null)
                }}
                className="imageFileCloseButton" />
            </div>
          }
        </div>
        <div className="addBookItemRatingDiv">
          <p>Rating</p>
          <Rating
            onClick={(rate) => setbookRating(rate)}
            initialValue={0}
            transition
            allowFraction
            size={30}
            style={{ height: 30 }}
            emptyStyle={{ color: "#a1a1a1" }}
            className="hoverable"
          />
        </div>
        <div className="addBookItemFilepdf">
          <input type="file" name="" id=""
            accept="application/pdf"
            onChange={(e) => { e.target.files && setpdfFile(e.target.files[0]) }}
          />
          <div>
            {
              !pdfFile ?
                <p className='pdfFileText'>Add book (optional), only .pdf file extension is accepted. </p>
                :
                <div className='pdfFileDiv'>
                  <img src={pdfThumbnail} alt="" className='pdfFileImage' />
                  {pdfFile.name}
                  <img src={closeDarkblue}
                    onClick={() => setpdfFile(null)}
                    className='pdfFileCloseIcon' alt="" />
                </div>
            }
          </div>
        </div>
        <button className='addToShelf'
          onClick={sendBook}
        >{isLoading
          ?
          <span className='generalLoadingIconSmall'></span>
          :
          "Add to shelf"
          }
        </button>
      </div>
    </div>
  )
}

export default AddBook