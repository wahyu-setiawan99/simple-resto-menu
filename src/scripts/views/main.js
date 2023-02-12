const api_endpoint = {
  mealsByFirstLetter : `http://www.themealdb.com/api/json/v1/1/search.php?f=b`,
  searchMeal: (keyword) => `http://www.themealdb.com/api/json/v1/1/search.php?s=${keyword}`,
  detailMeals: (mealId) => `http://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
}


class TheMealDBSource {
  static async listMeals() {
    const response = await fetch(api_endpoint.mealsByFirstLetter);
    const responseJson = await response.json();
    const meals = responseJson.meals;
    return meals;
  }

  static async searchMeal(keyword) {
    const response = await fetch(api_endpoint.searchMeal(keyword));
    const responseJson = await response.json();
    const meals = responseJson.meals;
    return meals;
  }

  static async mealDetail(id) {
    const response = await fetch(api_endpoint.detailMeals(id));
    const responseJson = await response.json();
    const meals = responseJson.meals;
    return meals[0];
  }
}


const createMenuItemTemplate = (menu) => `
  <div class=".menu-item">
    <div class="menu-item__header">
      <img src="${menu.strMealThumb}" alt="${menu.strMeal}">
      <h3><a href="/#/detail/${menu.idMeal}">${menu.strMeal}</a></h3>
      <p>${menu.strArea}</p>
    </div>
    <div class="menu-item__content">
      <p>${menu.strInstructions}</p>
    </div>
  </div>
`;

const createMenuDetailTemplate = (menu) => `
<div class="menu-detail__container">
  <div class="menu-detail__header">
    <img src="${menu.strMealThumb}" alt="${menu.strMeal}">
  </div>
  <div class="menu-detail__instructions">
    <h3>${menu.strMeal}</h3>
    <p>${menu.strInstructions}</p>
  </div>
</div>
`;

window.addEventListener('hashchange', () => {
  try {
    const url = window.location.hash.slice(1);
    const id = url.split('/')[2];
    detail(id);

  } catch (error) {
    return new Error('not detail')
  }
  
})



const MainPage = {
  async render() {
    return `
      <div class="main-page">
        <div class="search-menu">
          <input id="search-type" type="text" placeholder="Search menu">
          <button id="search-button">Search</button>
        </div>
        <div class="menu__container" id="menu__container">

        </div>
      </div>
    `;
  },

  async afterRender(){
    const menus = await TheMealDBSource.listMeals();
    const menuContainer = document.querySelector('#menu__container');
    for (let i = 0; i < 20; i++ ) {
      menuContainer.innerHTML +=createMenuItemTemplate(menus[i]);
    }
  },

  async afterSearch(){
    const keyword = document.querySelector('#search-type').value;
    const menuFound = await TheMealDBSource.searchMeal(keyword);
    const menuContainer = document.querySelector('#menu__container');
    menuContainer.innerHTML = ``;
    menuFound? menuFound.forEach(menu => {
      menuContainer.innerHTML +=createMenuItemTemplate(menu);         
    }) : menuContainer.innerHTML = `Not found`;
  },

  
}


const DetailPage = {
  async render () {
    return `
    <div class="menu-detail__container" id="menu-detail__container">
    </div>
    `;
  },


  async detailPage(idMeal) {
    const detailMenu = await TheMealDBSource.mealDetail(idMeal);
    const detailMenuContainer = document.querySelector('#menu-detail__container');
    detailMenuContainer.innerHTML = createMenuDetailTemplate(detailMenu);

  }

}


const detail = async(idMeal) => {
  const menuContainer = document.querySelector('.main__container');
  menuContainer.innerHTML = await DetailPage.render();
  await DetailPage.detailPage(idMeal);
}









const main = async () => {
  const menuContainer = document.querySelector('.main__container');
  menuContainer.innerHTML = await MainPage.render();
  await MainPage.afterRender();

  document.querySelector('#search-button').addEventListener('click', () => {
    MainPage.afterSearch()
  } );
}

main();


