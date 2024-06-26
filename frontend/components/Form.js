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
    .trim()
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
  toppings: [],
};
const initialFormErrors = {
  fullName: "",
  size: "",
};

const orderURL = "http://localhost:9009/api/order";

export default function Form() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [enabled, setEnabled] = useState(false);
  const [serverFailure, setServerFailure] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");

  useEffect(() => {
    formSchema.isValid(formValues).then((isValid) => {
      setEnabled(isValid);
    });
  }, [formValues]);
 
  const onChange = (event) => {
    let { type, checked, name, value } = event.target;

    if (type === "checkbox") {
      value = checked;
      if (checked) {
        setFormValues((prevState) => ({
          ...prevState,
          toppings: [...prevState.toppings, name],
        }));
      } else {
        setFormValues((prevState) => ({
          ...prevState,
          toppings: prevState.toppings.filter(
            (toppingId) => toppingId !== name
          ),
        }));
      }
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }

    Yup.reach(formSchema, name)
      .validate(value)
      .then(() => {
        setFormErrors({ ...formErrors, [name]: "" });
      })
      .catch((err) => {
        setFormErrors({ ...formErrors, [name]: err.errors[0] });
      });
  };

  const onSubmit = (event) => {
    event.preventDefault();

    axios
      .post(orderURL, formValues)
      .then((res) => {
        setServerSuccess(res.data.message);
        setFormValues(initialFormValues);
        setServerFailure("");
      })
      .catch((err) => {
        setServerFailure(err.response.data.message);
        setServerSuccess("");
      });
  };

  return (
    <form onSubmit={onSubmit}>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <div className="success">{serverSuccess}</div>}
      {serverFailure && <div className="failure">{serverFailure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label>
          <br />
          <input
            placeholder="Type full name"
            id="fullName"
            type="text"
            name="fullName"
            value={formValues.fullName}
            onChange={onChange}
          />
        </div>
        {formErrors.fullName && (
          <div className="error">{formErrors.fullName}</div>
        )}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label>
          <br />
          <select
            id="size"
            onChange={onChange}
            name="size"
            value={formValues.size}
          >
            <option value="">----Choose Size----</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
        </div>
        {formErrors.size && <div className="error">{formErrors.size}</div>}
      </div>

      <div className="input-group">
        {toppings.map((topping) => (
          <label key={topping.topping_id}>
            <input
              name={topping.topping_id}
              type="checkbox"
              onChange={onChange}
              checked={formValues.toppings.includes(topping.topping_id)}
              value={topping.topping_id}
            />
            {topping.text}
            <br />
          </label>
        ))}
      </div>
      <input type="submit" disabled={!enabled} />
    </form>
  );
}
