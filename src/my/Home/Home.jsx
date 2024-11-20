import React, { useEffect } from "react";
import axios from "axios";
import './Home.css';

const DEFAULT_MOVIES = [
    'Inception', 
    'arjun reddy', 
    'naruto:shippuden', 
    'ragnarok'
];

export default function Home(){
    const [value, setValue] = React.useState("") 
    const [modal, setModal] = React.useState(false)
    const [movies, setMovies] = React.useState([])
    const [modalContent, setModalContent] = React.useState("")

    useEffect(() => {
        const fetchDefaultMovies = async () => {
            try {
                const promises = DEFAULT_MOVIES.map(movie => 
                    axios.get(`https://www.omdbapi.com/?apikey=a2526df0&s=${movie}`)
                );
                
                const results = await Promise.all(promises);
                const defaultMovies = results
                    .map(res => res.data.Search[0])
                    .filter(movie => movie);
                
                setMovies(defaultMovies);
            } catch (err) {
                console.error("Error fetching default movies:", err);
            }
        };

        fetchDefaultMovies();
    }, []);

    const handleClick = () => {
        if(value){
            axios.get(`https://www.omdbapi.com/?apikey=a2526df0&s=${value}`)
            .then((res)=>{
                if(res.data.Search){
                    setMovies(res.data.Search)
                } else {
                    setModal(true)
                    setModalContent(["No Movies Found", "", "No results", "Try another search", ""])
                }
            })
            .catch((err)=>{
                setModal(true)
                setModalContent(["Search Error", "", "Error", "Please try again", ""])
                console.log(err)
            })
        } else {
            console.log({err:`error`})            
        }
    }

    const handleContent = (index) => {
        setModalContent([
            movies[index].Title,
            movies[index].Poster,
            movies[index].Type,
            movies[index].Year,
            movies[index].imdbID
        ])
    }

    return(
       <div className="home">
            <div className="search-space">
                <label htmlFor="" className="search-box">
                    <input 
                        type="text" 
                        placeholder="Search movies..." 
                        value={value} 
                        onChange={(e)=>setValue(e.target.value)} 
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleClick();
                            }
                        }}
                    />
                </label>
            </div>
            <div>
                {movies.map((movie,index)=>(
                    <div className="holder" key={index}>
                        <div>{movie.Title}</div>
                        <img 
                            src={movie.Poster} 
                            alt="poster"  
                            onClick={()=>[setModal(true),handleContent(index)]}
                        />
                    </div>
                ))}
            </div>

            {modal && 
               <div className="modal">
                    <div>
                        <h2>{modalContent[0]}</h2>
                        {modalContent[1] && <img src={modalContent[1]} alt="poster" />}
                        <p>Type: {modalContent[2]}</p>
                        <p>Year: {modalContent[3]}</p>
                        {modalContent[4] && <p>IMDB: {modalContent[4]}</p>}
                        <button onClick={()=>setModal(false)}>Close</button>
                    </div>
               </div>
            }
       </div>
    )
}