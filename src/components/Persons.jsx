import Person from "./Person";

const Persons = ({ persons, deletePerson }) => {
  return (
    <ul>
      {persons.map((person) => (
        <Person key={person.id} person={person} deletePerson={deletePerson} />
      ))}
    </ul>
  );
};

export default Persons;

/* 
!!!!Huom 
const Persons = ({ persons, deletePerson }) => {
  return (
    <ul>
      {persons.map((person) => (
        <Person key={person.id} person={person} deletePerson={deletePerson} />
      ))}
    </ul>
  );
};

Tämä auttaa Reactia seuraamaan jokaista elementtiä 
paremmin ja estää turhia uudelleenrenderöintejä. 
Käyttämällä id-arvoa avaimena, vältetään sekaannukset, 
joita voisi syntyä silloin, kun listan järjestystä 
muutetaan (esim. suodattamalla, lajittelemalla tai poistamalla 
elementtejä). Näin jokaisella elementillä on ainutlaatuinen tunniste, 
joka parantaa suorituskykyä ja vähentää virheitä.

ero;
<ul>
      {persons.map((person, index) => (
        <Person key={index} person={person} deletePerson={deletePerson} />
      ))}
    </ul>







*/
