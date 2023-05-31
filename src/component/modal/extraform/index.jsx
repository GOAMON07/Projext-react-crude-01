import React, { useState, useEffect, useContext, useCallback } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { DataContext } from "../../../Home";
import { Formik, useFormik } from "formik";
import Grid from "@mui/material/Grid";
import axios from "axios";
import Swal from "sweetalert2";
import TextField from "@mui/material/TextField";
import * as Yup from "yup";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const initialValues = {
  message: "",
};

const validationSchema = Yup.object().shape({
  message: Yup.string().required("กรุณาป้อนความคิดเห็นของท่าน"),
});
export default function index() {
  const {
    setReload,
    status,
    setStatus,
    setLoading,
    id,
    openNewsModal,
    setOpenNewsModal,
    newsData,
    setNewsData,
  } = useContext(DataContext);


  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      addNewsData(values.message);
    },
  });


  const addNewsData = useCallback(
    async (message) => {
      setLoading(true);
      await axios
        .put(
          "https://us-central1-api-test-9bed7.cloudfunctions.net/expressApi/api/users/"+id,
          { message : message }
        )
        .then((res) => {
          if (res?.data) {
            Swal.fire({
              icon: "success",
              title: "ข้อความ",
              text: "สร้างสำเร็จ!",
            });
            setReload(Math.floor(Date.now() / 1000));
            setOpenNewsModal(false);
          }
        })
        .catch((er) => {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        })
        .finally(() => {
          setLoading(false);
          formik.setFieldValue("message","");
        });
    },
    [id,formik]
  );

  

  return (
    <div>
      <Modal
        open={openNewsModal}
        onClose={() => {
          setOpenNewsModal(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={5}>
              <Grid
                item
                xs={12}
                sx={{ display: "flex", flexDirection: "column" }}
              >
                <Typography variant="h6" sx={{ marginBottom: "25px" }}>
                  {status === "create" ? "เพิ่มข้อมูล" : "เพิ่มความคิดเห็น"}
                </Typography>
                <Grid item xs={12}>
                  <TextField
                    label="กรุณากรอกคิดเห็นของท่าน"
                    variant="outlined"
                    name="message"
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    fullWidth={true}
                  />
                  {formik?.touched.message && formik?.errors.message && (
                    <Typography
                      variant="p"
                      sx={{ color: "red", fontSize: "12px" }}
                    >
                      {formik?.errors.message}
                    </Typography>
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row ",
                  }}
                >
                  <Button
                    size="small"
                    color="inherit"
                    variant="contained"
                    fullWidth
                    sx={{ marginRight: "30px" }}
                    onClick={() => {
                      setOpenNewsModal(false);
                    }}
                  >
                    ยกเลิก
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    variant="contained"
                    fullWidth
                    type="submit"
                  >
                    ตกลง
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
