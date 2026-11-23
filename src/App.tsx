import { useEffect, useState } from 'react'

import './App.css'
import type { User } from './types/types'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [nev, setNev] = useState("")
  const [osztaly, setOsztaly] = useState("")
  const [kredit, setKredit] = useState(0);

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
      if (!response.ok) {
        throw new Error("Felvétel nem sikerült")
      }
      const felhasznalo: User = await response.json();
      setUsers((elozo) => [...elozo, felhasznalo])
      setNev("")
      setOsztaly("")


    } catch (err) {
      console.log("hiba történt felvételnél:" + err.message)
    }

  }


  async function handleTorles(id: string) {
    if (!confirm("Biztos törölni akarod?")) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users/" + id, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Tőrlés nem sikerült")
      }
      setUsers((elozo) => elozo.filter((user) => user.id !== id))
    } catch (error) {
      console.log("Hiba" + error.message)

    }
  }

  async function handleKredit(user: User) {
    if (!confirm("Biztosan meg szeretnén növelni " + user.nev + "kreditjeinek számát 1000-el?")) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users/" + user.id, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ kredit: user.kredit + 1000 })

      });
      if (!response.ok) {
        throw new Error("Kredit emelés nem sikerült")
      }
      setUsers((elozo) =>
        elozo.map(users => users.id === user.id ? { ...users, kredit: users.kredit + 1000 } : users,
        )
      )

    } catch (error) {
      console.log("Hiba" + error.message)

    }

  }

  async function handleKreditMinusz(user: User) {
    if (!confirm("Biztosan le szeretnéd csökkenteni " + user.nev + "kreditjeinek számát 1000-el?")) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users/" + user.id, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ kredit: user.kredit - 1000 })

      });
      if (!response.ok) {
        throw new Error("Kredit csökkentés nem sikerült")
      }
      setUsers((elozo) =>
        elozo.map(users => users.id === user.id ? { ...users, kredit: users.kredit - 1000 } : users,
        )
      )

    } catch (error) {
      console.log("Hiba" + error.message)

    }

  }

  async function handleNullaKredit(user: User) {
    if (!confirm("Biztosan nullázni szeretnéd " + user.nev + " kreditjeit?")) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users/" + user.id, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ kredit: 0 })
      });
      if (!response.ok) {
        throw new Error("Kredit nullázás nem sikerült")
      }
      setUsers((elozo) =>
        elozo.map(users => users.id === user.id ? { ...users, kredit: 0 } : users)
      )
    } catch (error) {
      console.log("Hiba" + error.message)
    }
  }

  async function handleOnalloKredit(user: User) {
    if (!confirm("Biztosan nullázni szeretnéd " + user.nev + " kreditjeit?")) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users/" + user.id, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ kredit: 0 })
      });
      if (!response.ok) {
        throw new Error("Kredit nullázás nem sikerült")
      }
      setUsers((elozo) =>
        elozo.map(users => users.id === user.id ? { ...users, kredit: 0 } : users)
      )
    } catch (error) {
      console.log("Hiba" + error.message)
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
            <th>Kredit</th>
            <th>Tankötelesség</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nev}</td>
              <td>{user.osztaly}</td>
              <td>{user.kredit}</td>
              <td>{user.tankoteles ? "Tanköteles" : "Nem tanköteles"}</td>
              <button className='btn' onClick={() => handleTorles(user.id.toString())}>❌</button>
              <button type="button" className="btn btn-primary" onClick={() => handleKredit(user)}>+1000</button>
              <button className="btn btn-primary" onClick={() => handleKreditMinusz(user)}>-1000</button>
              <button className="btn btn-primary" onClick={() => handleNullaKredit(user)}>Kredit nullázása</button>
              <button className='btn btn-primary'>Önálló kredit felvétele</button>
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
