import { useState, useEffect } from "react";
import Advertisement from "../components/HomePage/Advertisement/Advertisement";
import BestSellers from "../components/HomePage/BestSellers/BestSellers";
import Intro from "../components/HomePage/Intro/Intro";
import NewIn from "../components/HomePage/NewIn/NewIn";
import Loader from "../Layout/Loader/Loader";

const Home = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLoadingComplete = () => {
      setLoading(false);
    };

    if (document.readyState === "complete") {
      handleLoadingComplete();
    } else {
      const handleLoad = () => {
        handleLoadingComplete();
        window.removeEventListener("load", handleLoad);
      };
      window.addEventListener("load", handleLoad);
    }

    return () => {
      document.body.removeAttribute("style");
    };
  }, []);
  return (
    <>
      <Loader loading={loading} />
      {!loading && (
        <>
          <Intro />
          <BestSellers />
          <Advertisement />
          <NewIn />
        </>
      )}
    </>
  );
};

export default Home;
