import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: "full name must be at least 3 characters",
  fullNameTooLong: "full name must be at most 20 characters",
  sizeIncorrect: "size must be S or M or L",
};

// 👇 Here you will create your schema.
const formSchema = Yup.object().shape({
  fullName: Yup.string()
    .required()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong),
  size: Yup.string()
    .required()
    .oneOf(["S", "M", "L"], validationErrors.sizeIncorrect),
});

// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: "1", text: "Pepperoni" },
  { topping_id: "2", text: "Green Peppers" },
  { topping_id: "3", text: "Pineapple" },
  { topping_id: "4", text: "Mushrooms" },
  { topping_id: "5", text: "Ham" },
];

const initialFormValues = {
  fullName: "",
  size: "",
  // figure out how to add values for toppings to be set to false here.
};
const initialFormErrors = {
  fullName: "",
  size: "",
};
const initialDisabled = true;

export default function Form() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [disabled, setDisabled] = useState(initialDisabled);
  const [serverFailure, setServerFailure] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  
  return (
    <form>
      <h2>Order Your Pizza</h2>
      {true && <div className="success">Thank you for your order!</div>}
      {true && <div className="failure">Something went wrong</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input placeholder="Type full name" id="fullName" type="text" />
        </div>
        {true && <div className="error">Bad value</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label>
          <br />
          <select id="size">
            <option value="">----Choose Size----</option>
            {/* Fill out the missing options */}
          </select>
        </div>
        {true && <div className="error">Bad value</div>}
      </div>

      <div className="input-group">
        {/* 👇 Maybe you could generate the checkboxes dynamically */}
        <label key="1">
          <input name="Pepperoni" type="checkbox" />
          Pepperoni
          <br />
        </label>
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input type="submit" disabled={disabled} />
    </form>
  );
}
