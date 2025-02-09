import { Dispatch, useEffect, useState } from "react"
import { v4 as uuidv4} from "uuid"
import { categories } from "../data/categories"
import type { Activity } from "../types"
import { ActivityActions, ActivityState } from "../reducers/activity-reducer"

type FormProps = {
  dispatch : Dispatch<ActivityActions>,
  state : ActivityState
}
const initialState : Activity = {
  id: uuidv4(),
  category: 1,
  name: '',
  calories: 0
}
export default function Form({dispatch, state} : FormProps) {

  const [activity, setActivity] = useState<Activity>(initialState)

  useEffect(() =>{
    if(state.activeId){
      const selectActivity = state.activities.filter( stateActivity  => stateActivity.id === state.activeId)[0]
      setActivity(selectActivity)
    }
  }, [state.activeId])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const itsNumber = ['category', 'calories'].includes(id);
    
    setActivity({
      ...activity,
      [id]: itsNumber ? +value : value
    });
  }

  const isValidActivity = () =>{
    const{name, calories} =  activity
    // console.log(name.trim() !== '' && calories >0)
    return name.trim() !== '' && calories > 0
  }
  const hadleSubmit = (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault()

    dispatch({type : 'save-activity', payload: { newActivity:activity}})

    setActivity({
      ...initialState,
      id: uuidv4()
    })
  }
  return (
    <form 
      className=" space-y-5 bg-white shadow p-10 rounded-lg"
      onSubmit={ hadleSubmit}
      >
      <div className=" grid grid-cols-1 gap-3">
        <label className=" font-bold" htmlFor="category">
          Cartegory
        </label>
        <select 
          className="borde border-slate-100 p-2 rounded-lg w-full bg-white"
          id="category"
          value={activity.category}
          onChange={handleChange}
        >
          {categories.map(category => (
            <option 
              key={category.id} 
              value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className=" grid grid-cols-1 gap-3">
        <label className=" font-bold" htmlFor="name">
          Activity
        </label>
        <input
          id="name"
          type="text"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="Food: appple, banana, mango. Exercise: squads"
          value={activity.name}
          onChange={handleChange}

        />
      </div>
      <div className=" grid grid-cols-1 gap-3">
        <label className=" font-bold" htmlFor="calories">
          Calories
        </label>
        <input
          id="calories"
          type="number"
          className="border border-slate-300 p-2 rounded-lg"
          placeholder="200 "
          value={activity.calories}
          onChange={handleChange}

        />
      </div>
      <input
      type="submit"
        className="bg-gray-600 hover:bg-gray-800 w-full p-2 font-bold text-white uppercase cursor-pointer disabled:opacity-20"
        value='Add'
        disabled={!isValidActivity()}

      />
    </form>
  )
}
