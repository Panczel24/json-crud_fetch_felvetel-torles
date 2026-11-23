import { useEffect, useState } from 'react'

import './App.css'
import type { User } from './types/types'

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [nev, setNev] = useState("")
  const [osztaly, setOsztaly] = useState("")
  const [onalloKreditek, setOnalloKreditek] = useState<Record<string, number>>({})

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
        throw new Error("Törlés nem sikerült")
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
    const ujKredit = onalloKreditek[user.id] ?? 0
    if (!confirm("Biztosan be szeretnéd állítani " + user.nev + " kreditjeit " + ujKredit + " értékre?")) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/users/" + user.id, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ kredit: ujKredit })
      });
      if (!response.ok) {
        throw new Error("Kredit beállítása nem sikerült")
      }
      setUsers((elozo) =>
        elozo.map(users => users.id === user.id ? { ...users, kredit: ujKredit } : users)
      )

    } catch (error) {
      console.log("Hiba" + error.message)
    }
  }


  async function handleAktiv(user: User) {
    if (!confirm("Biztosan változtatni szeretnéd " + user.nev + " tankötelességét?")) {
      return;
    }
    const newAktiv = !user.tankoteles;
    try {
      const response = await fetch("http://localhost:3000/users/" + user.id, {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ tankoteles: newAktiv })
      });
      if (!response.ok) {
        throw new Error("Nem sikerült a váltás")
      }
      setUsers((elozo) =>
        elozo.map(users => users.id === user.id ? { ...users, tankoteles: newAktiv } : users)
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
              <input
                type="number"
                value={onalloKreditek[user.id] ?? ""}
                onChange={(e) => setOnalloKreditek((elozo) => ({
                  ...elozo,
                  [user.id]: Number(e.target.value)
                }))}
              />
              <button className='btn btn-primary' onClick={() => handleOnalloKredit(user)}>Önálló kredit felvétele</button>
              <button className="btn btn-primary" onClick={()=>handleAktiv(user)}>aktivitás váltása</button>
              {/* tanköteles mező váltás */}
              {/* tanköteles mező váltás csak 18 év felett */}
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
