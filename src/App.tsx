import { useEffect, useState } from 'react'

import './App.css'
import type { User } from './types/types'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [nev, setNev] = useState("")
  const [osztaly, setOsztaly] = useState("")

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("http://localhost:3000/users")
        const data: User[] = await response.json();
        setUsers(data)

      } catch (err) {
        console.log("hiba történt:" + err.message)

      }
    }
    fetchUsers();
  }, [])


  async function handleFelhasznaloFelvetel(e) {
    e.preventDefault();
    const ujFelhasznalo = {
      nev: nev,
      osztaly: osztaly
    }
    console.log(ujFelhasznalo)
    try {
      const response = await fetch("http://localhost:3000/users", {
        "method": "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(ujFelhasznalo)
      });
      const felhasznalo: User = await response.json();
      setUsers((elozo) => [...elozo, felhasznalo])
      setNev("")
      setOsztaly("")


    } catch (err) {
      console.log("hiba történt felvételnél:" + err.message)

    }

  }


  // npm i json-server -D
  // package.json-be: "jsonserver":"json-server public/users.json"

  return (
    <>
      <h1>Felhasználók</h1>
      <h2>Felhasználólista</h2>

      <table className='table table-bordered table-hover'>
        <thead>
          <tr>
            <th>Név</th>
            <th>Osztály</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nev}</td>
              <td>{user.osztaly}</td>
              <button className='bton btn-danger' onClick={()=> handleTorles(user.id.toString())}></button>
            </tr>
          ))}

        </tbody>
      </table>


      <h2>Felhasználó felvétele</h2>
      <form onSubmit={handleFelhasznaloFelvetel} >
        <input className="form-control" type="text" placeholder='név' value={nev} onChange={(e) => setNev(e.target.value)} />
        <input className="form-control" type="text" placeholder='osztály' value={osztaly} onChange={(e) => setOsztaly(e.target.value)} />
        <button className='btn btn-success' type='submit'>Felvétel</button>
      </form>





    </>
  )
}

export default App
