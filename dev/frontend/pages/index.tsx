import React, {useEffect, useState} from 'react'

function index() {
  const [msg, setMsg] = useState("Loading . . .");
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/home").then(
      response => response.json()
    ).then((data) => {
        setMsg(data.message);
        setPeople(data.people);
      }
    )
  }, [])
  
  return ( 
    <div>
      <div>{msg}</div>

      {people.map((person,index) => (
        <div key={index}>{person}</div>
      ))}
    </div>    
  )
}

export default index