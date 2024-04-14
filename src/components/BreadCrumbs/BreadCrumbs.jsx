import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BreadCrumbs.scss";
import Container from "../Container/Container";
import { Link, useLocation } from "react-router-dom";

const BreadCrumbs = () => {
  const location = useLocation();
  const [routes, setRoutes] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const pathname = location.pathname.replace(/\/$/, ""); // Remove trailing slash
    const pathSegments = pathname.split("/");
    let breads = [];
    pathSegments.map((segment, index) => {
      if (index === 0) {
        breads.push({ path: "/", name: "Home" });
      } else {
        if (index === pathSegments.length - 1) {
          breads.push({
            path: `${pathSegments.slice(0, index + 1).join("/")}/`,
            name: segment.replace("-", " "),
          });
        } else {
          breads.push({
            path: pathSegments.slice(0, index + 1).join("/"),
            name: segment.replace("-", " "),
          });
        }
      }
    });
    setRoutes(breads);
  }, [location]);

  return (
    <Container className="breadcrumbs">
      {routes &&
        routes.length > 0 &&
        routes.map((route, index) => (
          <Link
            key={index}
            to={route.path}
            className={[
              "breadcrumb",
              index === routes.length - 1 ? "last" : "",
            ].join(" ")}
            onClick={(e) => {
              e.preventDefault();
              navigate(route.path);
              window.location.reload();
            }}
          >
            {route.name}
            {index < routes.length - 1 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M6 12L10 8L6 4"
                  stroke="#4F4F4F"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </Link>
        ))}
    </Container>
  );
};

export default BreadCrumbs;
