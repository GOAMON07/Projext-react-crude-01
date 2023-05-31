import { CircularProgress, Box } from "@mui/material";
import React from "react";


const  Loading = ({loading=true}) =>{
  React.useEffect(() => {
    if (document && loading) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "visible";
      };
    }
  }, [loading]);

  return (
    <>
    {loading && (
        <> 
        <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        position: "fixed",
        zIndex: 9998,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          zIndex: 9999,
          padding: "35px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0px 16px 32px -4px rgba(0, 0, 0, 0.12)",
          borderRadius: "20px",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    </Box>
        </>
    )}
    </>

  );
}

export default Loading;