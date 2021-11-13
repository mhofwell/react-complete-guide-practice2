import React, { useState, useEffect, useReducer } from "react";

import Card from "../UI/Card/Card";
import classes from "./Login.module.css";
import Button from "../UI/Button/Button";

const emailReducer = (prevState, action) => {
  // the action is whatever is inside the brackets of dispatchEmail(), ex., dispatchEmail({type: 'USER_INPUT', val: event.target.value})
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: action.val, isValid: action.val.includes("@") };
  }
  return { value: prevState.value, isValid: prevState.value.includes("@") };
};

const passwordReducer = (prevState, action) => {
  if (action.type === "USER_INPUT") {
    return { value: action.val, isValid: action.val.length > 6 };
  }
  if (action.type === "INPUT_BLUR") {
    return { value: action.val, isValid: action.val.length > 6 };
  }
  return { value: prevState.value.trim(), isValid: prevState.value.length > 6 };
};

const Login = (props) => {
  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmailReducer] = useReducer(emailReducer, {
    value: "",
    isValid: null,
  });

  const [pwState, dispatchPasswordReducer] = useReducer(passwordReducer, {
    value: "",
    isValid: null,
  });


  // further optimize useEffect, you can destructure your objects to get only the isValid value and use that value as a dependency for your useEffect so it only re-runs when the validity has changed and not re-run a validity check every time the pw field changes even after its been validated. 

  const {isValid: emailIsValid} = emailState; 
  const {isValid: pwIsValid} = pwState; 

  useEffect(() => {
    const loginTimeout = setTimeout(() => {
      setFormIsValid(emailIsValid && pwIsValid); 
    }, 500);

    return () => {
      clearTimeout(loginTimeout);
    };
  }, [emailIsValid, pwIsValid]);

  const emailChangeHandler = (event) => {
    // description 'type' and payload 'val'
    dispatchEmailReducer({ type: "USER_INPUT", val: event.target.value });

    setFormIsValid(
      event.target.value.includes("@") && pwState.isValid
    );
  };

  const passwordChangeHandler = (event) => {
    dispatchPasswordReducer({ type: "USER_INPUT", val: event.target.value });

    setFormIsValid(emailState.isValid && event.target.value.trim().length > 6);
  };

  const validateEmailHandler = (e) => {
    dispatchEmailReducer({
      type: "INPUT_BLUR", val: e.target.value,
    });
  };

  const validatePasswordHandler = (e) => {
    dispatchPasswordReducer({
      type: "INPUT_BLUR", val: e.target.value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailState.value, pwState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            pwState.isValid === false ? classes.invalid : ""
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={pwState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
