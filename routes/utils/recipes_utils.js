const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */


async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}

async function createRecipe(recipe){
    // readyInMinuteInt = await parseInt(recipe.readyInMinutes);
    // aggregateLikesInt = await parseInt(recipe.aggregateLikes);
    isWatchedInt = 0;
    isFavoriteInt = 0;
    // user_idInt = await parseInt(recipe.user_id);
    // recipe_idInt = await parseInt(recipe.recipe_id);


    await DButils.execQuery(
        `INSERT INTO newrecipes (title, imageRecipe, readyInMinutes, aggregateLikes, vegan, vegetarian,
            glutenFree, isWatched,isFavorite, user_id ,recipe_id)
        VALUES ('${recipe.title}', '${recipe.imageRecipe}',${recipe.readyInMinutes},
        ${recipe.aggregateLikes}, ${recipe.vegan}, ${recipe.vegetarian},${recipe.glutenFree},
         ${isWatchedInt}, ${isFavoriteInt},${recipe.user_id}, ${recipe.recipe_id})`);

    return recipe.recipe_id
}


async function addIngredientToRecipe(recipe_id,ingredient) {
    await DButils.execQuery(
        `INSERT INTO recipeingrediants (recipe_id, name, amount, measure)
        VALUES ('${recipe_id}', '${ingredient.name}',${ingredient.amount}, '${ingredient.measure}')`);
    }
async function addinstructionToRecipe(recipe_id,instruction) {
        await DButils.execQuery(
            `INSERT INTO recipeingrediants (recipe_id, stage, instruction)
            VALUES ('${recipe_id}', ${instruction.name},${instruction.instruction})`);
    }





async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
    }
}


async function getRecipesPreview(recipes_array) {
    if (recipes_array.length == 0){
        return {}
    }
    let recipes = await axios.get(`${api_domain}/informationBulk?ids=${recipes_array}`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
    let recipes_arr = [];
    for (i = 0; i < recipes.data.length; i++)
    {
        let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipes.data[i];
        recipes_arr.push({
            id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree
        })
    }
    return recipes_arr
    // }
    // let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipes.data;

    // return {
    //     id: id,
    //     title: title,
    //     readyInMinutes: readyInMinutes,
    //     image: image,
    //     popularity: aggregateLikes,
    //     vegan: vegan,
    //     vegetarian: vegetarian,
    //     glutenFree: glutenFree,
        
    // }
}

exports.getRecipesPreview = getRecipesPreview
exports.addIngredientToRecipe = addIngredientToRecipe
exports.addinstructionToRecipe = addinstructionToRecipe 
exports.getRecipeDetails = getRecipeDetails;
exports.createRecipe= createRecipe



