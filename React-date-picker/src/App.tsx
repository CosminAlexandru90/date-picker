import React from 'react';
import {createComponent} from "@lit/react";
import { CustomDatePicker as CustomDatePickerWC } from '../../custom-date-picker/src/custom-date-picker.ts'
import {SubmitHandler, useForm} from "react-hook-form";

export const CustomDatePicker = createComponent({
  tagName: 'custom-date-picker',
  elementClass: CustomDatePickerWC,
  react: React,
  events: {
    onactivate: 'activate',
    onchange: 'change',
  },
});
function App() {
  type Inputs = {
    example: string;
    exampleRequired: string;
    dateInput1: Date;
    dateInput2: Date;
    date: Date;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>()
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data,typeof data.dateInput1)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input defaultValue="test" {...register("example")} style={{color: "blue"}} className={'border-amber-700 border-2 rounded-lg'} />

      <input {...register("exampleRequired", { required: true })} style={{color: "blue"}} className={'border-amber-700 border-2 rounded-lg'} />
      {errors.exampleRequired && <span>This field is required</span>}

      <CustomDatePicker id="dateInput" {...register("dateInput1")} />
      <CustomDatePicker id="dateInput" {...register("dateInput2")} />
      <input type={"date"} {...register("date")} style={{margin: '50px', padding:'15px', backgroundColor:'blue'}} className={'border-amber-700 border-2 rounded-lg'} />
      <input type="submit" className={'p-2 m-2 rounded-lg border-cyan-600 border-2 bg-cyan-500'}/>
      <input type="reset" className={'p-2 m-2 rounded-lg border-cyan-600 border-2 bg-cyan-500'}/>
    </form>
  )
}

export default App
