import React, { useEffect, useState, createContext, useCallback } from "react";
import Typography from "@mui/material/Typography";
import { Box, Grid, Modal } from "@mui/material";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Table from "../component/Table";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "../@core/component/loading";
import BasicModal from "../component/modal/form/index";
import NewModal from "../component/modal/extraform";

export const DataContext = createContext();

export default function index() {
  const [data, setData] = useState();
  const [reload, setReload] = useState(1);
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [status, setStatus] = useState("");
  const [openNewsModal, setOpenNewsModal] = useState(false);
  const [newsData, setNewsData] = useState();

   const callApi = useCallback(async () => {
    setLoading(true);
    await axios
      .get(
        "https://us-central1-api-test-9bed7.cloudfunctions.net/expressApi/api/users"
      )

      .then((res) => {
        if (res?.data) {
          setData(res?.data);
        }
      })
      .catch(() => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  });

  useEffect(() => {
    callApi();
  }, [reload]);

  return (
    <DataContext.Provider
      value={{
        data,
        reload,
        loading,
        setReload,
        setLoading,
        setId,
        id,
        openModal,
        setOpenModal,
        status,
        setStatus,
        setOpenNewsModal,
        openNewsModal,
        newsData,
        setNewsData,
      }}
    >
      <Loading loading={loading} />
      <Box sx={{ display: "flex", marginTop: "50px" }}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              paddingBottom: "10px",
            }}
          >
            <Typography variant="h4">
              ระบบจัดการรายชื่อและอายุ ของบุลคลทั่วไป
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginRight: "50px",
              marginBottom: "10px",
            }}
          >
            <Button
              variant="contained"
              startIcon={<AddCircleOutlineIcon />}
              onClick={() => {
                setOpenModal(true);
                setStatus("create");
                
              }}
            >
              เพิ่มข้อมูล
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <Table />
          </Grid>
        </Grid>
      </Box>
      <BasicModal />
      <NewModal />
    </DataContext.Provider>
  );
}
