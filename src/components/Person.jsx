const Person = ({ person, deletePerson }) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={() => deletePerson(person.id, person.name)}>
        delete
      </button>
    </li>
  );
};

export default Person;

//{person.name} {person.number}
/*
 const Person = ({ person, pilota }) => {
  return (
    <li>
      {person.name} {person.number} 
      <button onClick={pilota}>delete</button>
    </li>
  );
};

export default Person;
*/
