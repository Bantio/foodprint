import axios from 'axios';
import { nutritionixConfig, nutritionixURL} from '../secrets';
import { Actions } from 'react-native-router-flux'
/* -----------------    ACTIONS     ------------------ */

const SELECT_MEAL = 'SELECT_MEAL';

/* ------------   ACTION CREATORS     ------------------ */

export const loadSelectedMeal = (foodTagArray, finalNutritionObject, url) => {
  return {
    type: SELECT_MEAL,
    foodTags: foodTagArray,
    nutritionInfo: finalNutritionObject,
    url: url
  }
};

/* ------------       REDUCERS     ------------------ */
const initialState = {
  selectedMeal: {
    foodTags: [],
    nutritionInfo: {},
    url: ""
  }
};

const camera = (state = initialState, action) => {
  const newState = Object.assign({}, state)

  switch (action.type) {
    case SELECT_MEAL:
      newState.selectedMeal.foodTags = action.foodTags
      newState.selectedMeal.nutritionInfo = action.nutritionInfo
      newState.selectedMeal.url = action.url
      return newState

    default:
      return newState
  }
}

/* ------------       DISPATCHERS     ------------------ */

export const getNutrientsValue = (tags, url) => {

  return (dispatch) => {

    let allMeal = [];
    const data = {
      "query": tags.join(" ")
    };
    axios.post(nutritionixURL, data, nutritionixConfig)
      .then(response => {
        response.data.foods.forEach(eachFoodObject => {
          let foodObject = {
            food_name: eachFoodObject.food_name,
            serving_qty: eachFoodObject.serving_qty,
            serving_unit: eachFoodObject.serving_unit,
            serving_weight_grams: eachFoodObject.serving_weight_grams,
            calories: eachFoodObject.nf_calories,
            total_fat: eachFoodObject.nf_total_fat,
            saturated_fat: eachFoodObject.nf_saturated_fat,
            cholesterol: eachFoodObject.nf_cholesterol,
            sodium: eachFoodObject.nf_sodium,
            total_carbohydrate: eachFoodObject.nf_total_carbohydrate,
            dietary_fiber: eachFoodObject.nf_dietary_fiber,
            sugars: eachFoodObject.nf_sugars,
            protein: eachFoodObject.nf_protein,
            potassium: eachFoodObject.nf_potassium
          };
          allMeal.push(foodObject);
        });
        let finalNutritionObject = {
          calories: 0.0,
          total_fat: 0.0,
          saturated_fat: 0.0,
          cholesterol: 0.0,
          sodium: 0.0,
          total_carbohydrate: 0.0,
          sugars: 0.0,
          protein: 0.0,
        };
        let foodTagArray = [];

        allMeal.forEach(nutrients => {
          foodTagArray.push(nutrients.food_name);
          finalNutritionObject.calories += nutrients.calories;
          finalNutritionObject.total_fat += nutrients.total_fat;
          finalNutritionObject.saturated_fat += nutrients.saturated_fat;
          finalNutritionObject.cholesterol += nutrients.cholesterol;
          finalNutritionObject.sodium += nutrients.sodium;
          finalNutritionObject.total_carbohydrate += nutrients.total_carbohydrate;
          finalNutritionObject.sugars += nutrients.sugars;
          finalNutritionObject.protein += nutrients.protein;
        });
        return dispatch(loadSelectedMeal(foodTagArray, finalNutritionObject, url))
        //Add to state of all meals
    }
  )
.then(() => Actions.meal())
.catch(console.error)
}
};

export default camera