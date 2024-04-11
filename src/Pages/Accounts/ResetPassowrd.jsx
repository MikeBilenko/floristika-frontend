import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectLoading,
  selectError,
  selectUser,
  resetPassword,
} from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import AuthWrapper from "../../components/AuthPages/AuthWrapper/AuthWrapper";
import Input from "../../ui/Input/Input";
import Button from "../../ui/Button/Button";

const ResetPassword = () => {
  const [credentials, setCredentials] = useState({
    email: "mike@codnity.com",
  });
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectUser);
  const navigate = useNavigate();

  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(resetPassword(credentials));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated]);

  return (
    <AuthWrapper>
      <form onSubmit={handleSubmit}>
        <Input
          type="email"
          label="Email address"
          value={credentials.email}
          onChange={(e) =>
            setCredentials((prevCredentials) => {
              return {
                ...prevCredentials,
                email: e,
              };
            })
          }
        />
        {/* Username and password input fields */}
        <Button fullWidth submit={true} disabled={loading}>
          {loading ? "RESETTING PASSWORD IN..." : "RESET PASSWORD"}
        </Button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </AuthWrapper>
  );
};

export default ResetPassword;
