import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const api = axios.create({
  baseURL: 'https://tell-me-your-dreams-backend.vercel.app/'
});

function App() {
  const [dreamers, setDreamers] = useState([]);
  const [newName, setNewName] = useState('');
  const [newDream, setNewDream] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    api.get('/dreams').then((res) => {
      console.log(res);
      setDreamers(res.data);
    });
  }, []);

  useEffect(() => {
    setIsFormValid(
      newName !== '' &&
      newDream !== ''
    );
  }, [newName, newDream]);

  function addInformation() {
    if (isFormValid) {
      const newDreamer = {
        name: newName,
        dream: newDream,
        id: uuidv4(),
      };

      api.post('/dreams', newDreamer).then((res) => {
        setDreamers([...dreamers, newDreamer]);
        console.log(res);
      });
    }
  }
    useEffect(() => {
      const audioElement = document.querySelector('#audio');
      audioElement.volume = 0.03;
    }, []);

    const playSound = () => {
      if(audioRef.current){
        audioRef.current.volume = 0.05;
        audioRef.current.play();
      }
    };

  return (
    <div className="container">
      <audio
        id="audio"
        src="./musics/song.mp3"
        autoPlay={true}
        loop
      ></audio>
      <h1>Tell me your Dreams</h1>
      <h2>Share information about your dreams.</h2>
      <div className='centering'>
        <input placeholder='Name' onChange={event => setNewName(event.target.value)} />
        <input placeholder='Dream' onChange={event => setNewDream(event.target.value)} />
        <button onClick={() =>{addInformation();playSound();}} disabled={!isFormValid}>Add information</button>
      </div>
      <div>
        <h2>See other people&apos;s dreams below.</h2>
        <ul>
          {dreamers.map(dreamer => (
            <li key={dreamer.id} > Name: {dreamer.name} - Dream: {dreamer.dream}</li>
          ))
          }
        </ul>
      </div>
      <audio ref={audioRef}>
        <source src="./musics/wind.mp3" type="audio/mp3"/>
      </audio>
    </div>
  )
}

export default App;
