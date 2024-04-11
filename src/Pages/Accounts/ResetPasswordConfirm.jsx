import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  selectLoading,
  selectError,
  selectUser,
  resetPassword,
  resetPasswordConfirm,
} from "../../redux/slices/authSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import AuthWrapper from "../../components/AuthPages/AuthWrapper/AuthWrapper";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

function ResetPasswordConfirm() {
  const { uid, token } = useParams();
  const [credentials, setCredentials] = useState({
    password1: "Mike2004",
    password2: "Mike2004",
    token: token,
    uid: uid,
  });
  const [clicked, setClicked] = useState(false);
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectUser);
  const navigate = useNavigate();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const handleSubmit = (e) => {
    e.preventDefault();
    setClicked(true);
    dispatch(resetPasswordConfirm(credentials));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <AuthWrapper>
      {!clicked && (
        <form onSubmit={handleSubmit}>
          <Input
            label="Password"
            type="password"
            icon="password"
            value={credentials.password1}
            onChange={(e) =>
              setCredentials((prevCredentials) => {
                return {
                  ...prevCredentials,
                  password1: e,
                };
              })
            }
          />
          <Input
            label="Confirm Password"
            type="password"
            icon="password"
            value={credentials.password2}
            onChange={(e) =>
              setCredentials((prevCredentials) => {
                return {
                  ...prevCredentials,
                  password2: e,
                };
              })
            }
          />
          {/* Username and password input fields */}
          <Button fullWidth submit={true} disabled={loading}>
            {loading ? "RESETTING PASSWORD IN..." : "RESET PASSWORD"}
          </Button>
        </form>
      )}

      {clicked && !error && !loading && (
        <div>
          Thanks for verifying! Use link bellow to login.
          <br />
          <Link to={"/accounts/login/"}>Login.</Link>
        </div>
      )}
    </AuthWrapper>
  );
}

export default ResetPasswordConfirm;
