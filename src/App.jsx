import { Auth } from './components/Auth';
import { db, auth, storage } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, updateDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';
import './App.css';


function App() {
  const [movieList, setMovieList] = useState([]);
  // new movie states
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setisNewMovieOscar] = useState(false);
  // update title state
  const [updatedTitle, setUpdatedTitle] = useState('');
  // file upload state
  const [fileUpload, setFileUpload] = useState(null)

  const moviesColletionRef = collection(db, "movies");

  const getMovieList = async () => {
    // read the data
    // set the movie list
    try {
      const data = await getDocs(moviesColletionRef);
      console.log(data)
      const filteredData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      console.log(filteredData);
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getMovieList();
  }, [])

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesColletionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
        userId: auth?.currentUser?.uid,

      });
      getMovieList();
    } catch (err) {
      console.error(err)
    }
  }

  const deleteMovie = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
  }

  const updateMovieTitle = async (id) => {
    const movieDoc = doc(db, "movies", id);
    await updateDoc(movieDoc, { title: updatedTitle });
    getMovieList();
  }

  const uploadFile = async () => {
    if (!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload);
    } catch (err) {
      console.error(err)
    }
  }


  // useEffect(() => {
  //   getDocs(moviesColletionRef)
  //     .then((snapshot) => {
  //       console.log(snapshot.docs)
  //       let movies = [];
  //       snapshot.docs.forEach((doc) => {
  //         movies.push({ ...doc.data() })
  //       })
  //       console.log(movies)
  //     })
  // }, [])

  return (
    <>
      <h1>Firebase project</h1>
      <Auth />

      <div>
        <input
          placeholder='Movie title...'
          onChange={(e) => setNewMovieTitle(e.target.value)} />
        <input
          placeholder='Released date...'
          type="number"
          onChange={(e) => setNewReleaseDate(Number(e.target.value))} />
        <input
          type="checkbox"
          checked={isNewMovieOscar}
          onChange={(e) => setisNewMovieOscar(e.target.checked)} />
        <label>Received an Oscar</label>
        <button onClick={onSubmitMovie}>Submit movie</button>
      </div>

      <div>{movieList.map((movie) => (
        <div>
          <h1 style={{ color: movie.receivedAnOscar ? 'green' : 'red' }}>{movie.title}</h1>
          <p>Date: {movie.releaseDate}</p>
          <button onClick={() => deleteMovie(movie.id)}>Delete movie</button>
          <input placeholder='New title...' onChange={(e) => {
            setUpdatedTitle(e.target.value)
            console.log(updatedTitle)
          }
          } />
          <button onClick={() => updateMovieTitle(movie.id)}>Update title</button>
        </div>
      ))}

        <div>
          <input type="file" onChange={(e) => setFileUpload(e.target.files[0])} />
          <button onClick={uploadFile}>Upload file</button>
        </div>
      </div>
    </>
  )
}

export default App


// UWAGI
// 1. trzeba odswiezyc storne zeby aktualne dane => nie ma onvalue, onsapshot, albo dodatkowe wywolanie funkcji
// albo zależności w useEffect
// 2. clear input po submit
// 3. przez brak osobnych komponentów - wpis w jednym inpucie i kliknięcie update w drugim zmienia tytuł w drugim