import React, { useEffect, useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { useForm } from "react-hook-form";
import "./InviteToClass.scss";
import VALIDATOR from "../../../shared/Util/Validator";
import PopupSubject from "../../../shared/Util/PopupSubject";
import ClassService from "../../../services/ClassService";

const arrayFromNumber = (num) => {
  let out = [];
  for (let i = 0; i < num; i++) {
    out.push(i);
  }
  return out;
};

const InviteToClass = ({ classId, onDone, onClose }) => {
  const [people, setPeople] = useState([]);
  const [rows, setRows] = useState(1);
  const [sending, setSending] = useState(false);
  const { reset, watch, register, errors, handleSubmit } = useForm({
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: {
      name: [],
      email: [],
    },
  });
  const increaseRow = () => {
    setRows((prev) => prev + 1);
  };
  const onPaste = (e) => {
    const text = e.clipboardData.getData("text");
    console.log(text);
    const data = text
      .split(/(?:\n|\r\n)/)
      .map((line) => {
        const [name, email] = line.split(/\t/);
        if (name && email) {
          return {
            name: name,
            email: email,
          };
        } else return null;
      })
      .filter((d) => d);
    setRows((prev) => prev + data.length);
    setPeople(data);
  };
  const onSubmit = async (data) => {
    setSending(true);
    console.log("check-data", data);
    if (data.email.length <= 1) {
      setSending(false);
      PopupSubject.next({
        type: "WARN",
        message: "Field value is not valid!!! You cannot send the invitation!",
        showTime: 4,
      });
      return;
    }
    const p = data.email
      .filter((d) => d)
      .map((e, i) => {
        return { email: e, name: data.name[i] };
      })
      .filter((pp) => pp);
    await ClassService.invite({ ...p, ...people }, classId);
    setSending(false);
  };
  const onError = (error) => {
    console.log("error", error);
    PopupSubject.next({
      type: "WARN",
      message: "Field value is not valid!!! You cannot send the invitation!",
      showTime: 4,
    });
  };
  const onReset = () => {
    reset({
      name: [],
      email: [],
    });
    setPeople([]);
    setRows(1);
  };
  useEffect(() => {
    try {
      const length = watch("email").filter((e) => e).length;
      if (length === rows) {
        increaseRow();
      }
    } catch (error) {
      return;
    }
  }, [watch("email")]);
  return (
    <div className="invite-page">
      <div className="invite-page__header">
        <h2>Add People</h2>
        <Button onClick={onClose} color="default" variant="outlined">
          Close
        </Button>
      </div>
      <div className="invite-page__main">
        <div className="invite-page__main__left">{/* left panel */}</div>
        <div className="invite-page__main__right">
          <div className="invite-page__main__right__top">
            <p className="instruction">
              Enter contacts or copy/paste from a spreadsheet
            </p>
            <p className="explain">
              Copy and paste directly from Google Sheets or Microsoft Excel .
            </p>
          </div>
          <div className="invite-page__main__right__bot">
            <div className="table-header">
              <p>Name(optional)</p>
              <p>Email</p>
            </div>
            <form
              className="invite-form"
              onSubmit={handleSubmit(onSubmit, onError)}
            >
              {people.length > 0 &&
                people.map((person, i) => {
                  return (
                    <div key={person.email + i} className="invite-people">
                      <TextField
                        name={`name[${i}]`}
                        placeholder="Name"
                        variant="filled"
                        value={person.name}
                        onPaste={(e) => (i === 0 ? onPaste(e) : null)}
                        inputRef={register()}
                      />
                      <TextField
                        value={person.email}
                        name={`email[${i}]`}
                        inputRef={register({
                          ...VALIDATOR.EMAIL.PARTTERN,
                          required: watch(`name`)[i],
                        })}
                        error={Boolean(
                          errors.email
                            ? errors.email[i]
                              ? errors.email[i].message
                              : null
                            : null
                        )}
                        placeholder="Email"
                        variant="filled"
                        helperText={
                          errors.email
                            ? errors.email[i]
                              ? errors.email[i].message
                              : null
                            : null
                        }
                      />
                    </div>
                  );
                })}
              {arrayFromNumber(rows - people.length).map((k) => {
                const key = k + people.length;
                return (
                  <div key={"additionalField" + key} className="invite-people">
                    <TextField
                      name={`name[${key}]`}
                      placeholder="Name"
                      variant="filled"
                      // value={person.name}
                      onPaste={(e) => (key === 0 ? onPaste(e) : null)}
                      inputRef={register()}
                    />
                    <TextField
                      // value={person.email}
                      name={`email[${key}]`}
                      inputRef={register({
                        ...VALIDATOR.EMAIL.PARTTERN,
                        required: watch(`name`)[key],
                      })}
                      error={Boolean(
                        errors.email
                          ? errors.email[key]
                            ? errors.email[key].message
                            : "Email is required!"
                          : null
                      )}
                      placeholder="Email"
                      variant="filled"
                      helperText={
                        errors.email
                          ? errors.email[key]
                            ? errors.email[key].message
                            : null
                          : null
                      }
                    />
                  </div>
                );
              })}
              <div className="form-action">
                <Button
                  disabled={sending}
                  color="primary"
                  variant="contained"
                  type="submit"
                >
                  Send
                </Button>
                <Button
                  onClick={onReset}
                  color="secondary"
                  variant="contained"
                  type="reset"
                  disabled={sending}
                >
                  Reset
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteToClass;
