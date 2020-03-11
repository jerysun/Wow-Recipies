import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';

/** Global state of the app
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};
window.state = state;

/**
 * Search Controller
 */
const controlSearch = async() => {
    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add it to state
        state.search = new Search(query);

        // 3) Prepare UI for recipes
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await state.search.getResults();

            // 5) Render recipes on UI
            clearLoader();
            searchView.renderResults(state.search.recipes);
        } catch (err) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();// prevent the page refresh, we'll use AJAX
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goToPage);
    }
});

/**
 * Recipe Controller
 */
const controlRecipe = async() => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    likesView.toggleLikeMenu(!state.likes ? 0 : state.likes.getNumLikes());

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);// the param is the parent so it knows where to render it

        // Highlight selected search item
        if (state.search) {
            searchView.highlightSelected(id);
        }

        // Create new recipe object
        state.recipe = new Recipe(id);

        // Get recipe data and parse ingredients
        try {
            await state.recipe.getRecipe();
            // console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe, !state.likes ? false : state.likes.isLiked(state.recipe.id));
            // console.log(state.recipe);// OK, but when we refresh the page, everything is gone! Need to fix because
                                         // the user could bookmark the url. So need to add a load event listener too
        } catch (err) {
            alert('Error processing recipe!');
        }
    }
};

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
[ 'hashchange', 'load' ].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * List Controller
 */
const controlList = () => {
    // Create a new list IF there is not yet
    if (!state.list) {
        state.list = new List();
    }

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete event
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);
        // Delete from UI
        listView.deleteItem(id);

      // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});

/**
 * Likes Controller
 */
const controlLike = () => {
    if (!state.likes) {
        state.likes = new Likes();
    }

    const currentID = state.recipe.id;

    if (!state.likes.isLiked(currentID)) { // To like
        // Add Like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);

        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);
        console.log(state.likes);
    } else { // To dislike
        // Remove Like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }

    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        state.recipe.updateServings('dec');
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Populate or remove the Likes
        controlLike();
    }

    recipeView.updateServingsIngredients(state.recipe);
});
