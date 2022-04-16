import logo from './logo.svg';
// React import하기
import React from "react";
import './App.css';
/* 
  실무에서는 각 컴포넌트를 다른 파일로 분류하여 export-import하는 것이 관례.
  src 폴더 안에 따로 폴더(여기서는 components)를 만들고,
  거기에 새로운 js 파일을 만들어 거기서 함수를 선언한 뒤
  그 함수를 export default시켜주고(해당 파일 참조)
  App.js에서 그것을 import해오는 것이다. (끝에 js는 생략 가능)
*/
import Title from "./components/Title"

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

function CatItem(props) {
  return (<li>
    <img src={props.img} style={{ width: '150px' }} />
  </li>);
}

function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>;
  }

  return (
    <ul className="favorites">
      {favorites.map((cat) => <CatItem img={cat} key={cat} />)}
    </ul>
  );
}

const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  const heartIcon = alreadyFavorite ? "💖" : "🤍";

  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button onClick={onHeartClick}>{heartIcon}</button>
    </div>
  );
}

// const Title = (props) => {
//   return (
//     <h1>{props.children}</h1>
//   );
// }

const FormDiv = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  function handleInputChange(e) {
    const userValue = e.target.value;

    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    } else {
      setErrorMessage("");
    }
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    setErrorMessage("");
    if (value === '') {
      setErrorMessage("빈 값으로 만들 수 없습니다.")
      return;
    }

    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p style={{ color: 'red' }}>{errorMessage}</p>
    </form>
  );
}

const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem('counter');
  });

  const [maincardImage, setMaincardImage] = React.useState(CAT1);

  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  })

  const alreadyFavorite = favorites.includes(maincardImage);

  const titleText = (counter === null) ? '고양이 가라사대' : `${counter}번째 고양이 가라사대`;

  async function setInitialCat() {
    const newCat = await fetchCat('First cat');
    console.log(newCat);
    setMaincardImage(newCat);
  }

  React.useEffect(() => {
    setInitialCat();
  }, []);

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);

    setMaincardImage(newCat);
    const nextCounter = counter + 1;
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem('counter', nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, maincardImage]
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem('favorites', nextFavorites);
  }

  return (
    <div>
      <Title>{titleText}</Title>
      <FormDiv updateMainCat={updateMainCat} />
      <MainCard img={maincardImage} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favorites={favorites} />
    </div>
  )
}

export default App;
