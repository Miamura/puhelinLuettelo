import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const initialPersons = await personService.getAll();
        setPersons(initialPersons);
      } catch (error) {
        setErrorMessage("Failed to fetch data from the server.");
        setTimeout(() => setErrorMessage(null), 5000);
      }
    };
    fetchData();
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const tempPerson = persons.find((person) => person.name === newName);

    if (newName === "" || newNumber === "") {
      return null;
    }

    if (tempPerson) {
      const confirmReplace = window.confirm(
        `${tempPerson.name} is already added to phonebook, replace the old number with a new one?`
      );

      if (confirmReplace) {
        const updatedPerson = { ...tempPerson, number: newNumber };
        personService
          .update(tempPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== tempPerson.id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            setSuccessMessage(`${tempPerson.name}'s number has been updated.`);
            setTimeout(() => setSuccessMessage(null), 5000);
          })
          .catch((error) => {
            setErrorMessage(
              `The information for ${tempPerson.name} has already been removed from the server.`
            );
            setTimeout(() => setErrorMessage(null), 5000);
            setPersons(persons.filter((person) => person.id !== tempPerson.id));
          });
      }
    } else {
      const maxId =
        persons.length > 0 ? Math.max(...persons.map((p) => Number(p.id))) : 0;

      const newPerson = {
        name: newName,
        number: newNumber,
        id: (maxId + 1).toString(),
      };
      personService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        setSuccessMessage(`${newName} has been added to the phonebook.`);
        setTimeout(() => setSuccessMessage(null), 5000);
      });
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id));
          setSuccessMessage(`${name} has been deleted from the phonebook.`);
          setTimeout(() => setSuccessMessage(null), 5000);
        })
        .catch((error) => {
          setErrorMessage(
            `Failed to delete ${name}. It might have already been removed.`
          );
          setTimeout(() => setErrorMessage(null), 5000);
          setPersons(persons.filter((person) => person.id !== id));
        });
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  const Notification = ({ message, type }) => {
    if (message === null) {
      return null;
    }

    return <div className={type}>{message}</div>;
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add a new</h2>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>

      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;

/* 
import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const tempPerson = persons.find((person) => person.name === newName);

    if (newName === "" || newNumber === "") {
      return null; // İsim veya numara eksik, işlem yapılmıyor
    }

    if (tempPerson) {
      const confirmReplace = window.confirm(
        `${tempPerson.name} is already added to phonebook, replace the old number with a new one?`
      );

      if (confirmReplace) {
        const updatedPerson = { ...tempPerson, number: newNumber };
        personService
          .update(tempPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== tempPerson.id ? person : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
            alert(`${tempPerson.name}'s number has been updated.`);
          })
          .catch((error) => {
            alert(
              `The information for ${tempPerson.name} has already been removed from the server.`
            );
            setPersons(persons.filter((person) => person.id !== tempPerson.id));
          });
      }
    } else {
      const newPerson = {
        name: newName,
        number: newNumber,
        id: String(persons.length + 1),
      };
      personService.create(newPerson).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson));
        setNewName("");
        setNewNumber("");
        alert(`${newName} has been added to the phonebook.`);
      });
    }
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add a new</h2>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>

      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;

---------------------------------------

1:14 tehty 1.15'kin toimi mutta jos laitoin sama nimi 
ohjelmointi antaa alert mutta lisää uudelleen, ratkaistaa

import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    persons.some((person) => person.name === newName)
      ? alert(`${newName} is already added to phonebook`)
      : newName === "" || newNumber === ""
      ? null
      : (setPersons([...persons, { name: newName, number: newNumber }]),
        setNewName(""),
        setNewNumber(""),
        alert(`${newName} has been added to the phonebook`));

    const newPerson = {
      name: newName,
      number: newNumber,
      id: String(persons.length + 1),
    };
    personService.create(newPerson).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
      alert(`${newName} telefon rehberine eklendi`);
    });
  };

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.remove(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
      });
    }
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add a new</h2>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>

      <Persons persons={personsToShow} deletePerson={deletePerson} />
    </div>
  );
};

export default App;

------------------------------------
const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      filter shown with:{" "}
      <input value={filter} onChange={(e) => setFilter(e.target.value)} />
    </div>
  );
};

export default Filter;

const Person = ({ person }) => {
  return (
    <li>
      {person.name} {person.number}
    </li>
  );
};

export default Person;

const PersonForm = ({
  newName,
  newNumber,
  setNewName,
  setNewNumber,
  addPerson,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name:{" "}
        <input value={newName} onChange={(e) => setNewName(e.target.value)} />
      </div>
      <div>
        number:{" "}
        <input
          value={newNumber}
          onChange={(e) => setNewNumber(e.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;

import Person from "./Person";

const Persons = ({ persons }) => {
  return (
    <ul>
      {persons.map((person, index) => (
        <Person key={index} person={person} />
      ))}
    </ul>
  );
};

export default Persons;

import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);
  console.log("render", persons.length, "person");

  const addPerson = (event) => {
    event.preventDefault();
    persons.some((person) => person.name === newName)
      ? alert(`${newName} is already added to phonebook`)
      : newName === "" || newNumber === ""
      ? null
      : (setPersons([...persons, { name: newName, number: newNumber }]),
        setNewName(""),
        setNewNumber(""),
        alert(`${newName} has been added to the phonebook`));
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h2>Add a new</h2>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewName={setNewName}
        setNewNumber={setNewNumber}
        addPerson={addPerson}
      />

      <h2>Numbers</h2>

      <Persons persons={personsToShow} />
    </div>
  );
};

export default App;

*/

// if its not number write again or only number .....
/*
import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-1231244" },
    { name: "Ada Lovelace", number: "39-44-5323523" },
    { name: "Dan Abramov", number: "12-43-234345" },
    { name: "Mary Poppendieck", number: "39-23-6423122" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const addPerson = (event) => {
    event.preventDefault();
    persons.some((person) => person.name === newName)
      ? alert(`${newName} is already added to phonebook`)
      : newName === "" || newNumber === ""
      ? null
      : (setPersons([...persons, { name: newName, number: newNumber }]),
        setNewName(""),
        setNewNumber(""),
        alert(`${newName} has been added to the phonebook`));
  };

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with:{" "}
        <input value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>
      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name:{" "}
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number:{" "}
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {personsToShow.map((person, index) => (
          <li key={index}>
            {person.name} {person.number}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
*/
